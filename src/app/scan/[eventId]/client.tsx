"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { addParticipantFn, getEventFn } from "~/requests/event";
import BarcodeScanner from "./components/BarcodeScanner";
import { useEffect, useRef, useState } from "react";
import QRCodeScanner from "./components/QRCodeScanner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import dayjs from "~/lib/dayjs";
import { getUserByCodeFn } from "~/requests/user";
import { AddParticipantPayload } from "~/types/Particiapnt";
import { ScanEventPayload } from "~/types";

interface Props {
  name: string;
  id: string;
  role: string;
}

function EventClient({ name, id, role }: Props) {
  const event = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventFn(id),
  });

  const addParticipant = useMutation({
    mutationFn: (res: AddParticipantPayload) => addParticipantFn(id, res),
    onSuccess: () => {
      toast.success("ลงทะเบียนนิสิตสำเร็จ");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.code === "PARTICIPANT_ALREADY_EXISTS") {
          toast.info("นิสิตลงทะเบียนไปแล้ว");
          return;
        }

        if (err.response?.status === 401) {
          toast.error("กรุณาเข้าสู่ระบบใหม่");
          router.push(`/auth/sign-out?redirect_to=/scan/${id}`);
          return;
        }
      }

      toast.error("เกิดข้อผิดพลาดในการลงทะเบียน");
    },
  });

  const router = useRouter();

  const handleLogout = async () => {
    router.push(`/auth/sign-out?redirect_to=/scan/${id}`);
  };

  const [payload, setPayload] = useState<ScanEventPayload | null>(null);
  const isScanned = payload !== null;

  const handleOnScan = (payload: ScanEventPayload) => {
    const code = payload?.barcode.match(/200(\d{10})\d{1}/);
    if (!code) return toast.error("บาร์โค้ดไม่ถูกต้อง");

    setPayload(payload);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const clearResult = () => {
    setPayload(null);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 0);
  };

  const user = useQuery({
    queryKey: ["users", payload?.barcode],
    queryFn: async () => {
      const code = payload?.barcode.match(/200(\d{10})\d{1}/);
      if (!code) return null;
      const matchedGroup = code[1];

      return getUserByCodeFn(matchedGroup);
    },
  });

  useEffect(() => {
    if (user.data && payload) {
      addParticipant.mutate({
        ...payload,
        student_code: user.data.student_code,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.data, payload]);

  const isNoUserData = !user.isFetching && user.data === null;

  return (
    <div className="p-4 flex flex-col h-screen">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-medium text-gray-900">{name}</h4>
            <h5 className="text-xs font-normal text-gray-500">
              {" "}
              {role === "admin" ? "แอดมิน" : "เจ้าหน้าที่"}
            </h5>
          </div>
          <Button onClick={handleLogout} variant="outline" size="icon">
            <LogOut size="1rem" className="text-red-500" />
          </Button>
        </div>
        <div className="mt-4">
          <h5 className="font-normal text-gray-500">ชื่ออีเวนต์</h5>
          {event.isLoading ? (
            <Skeleton className="w-48 h-8" />
          ) : (
            <h4 className="text-lg font-medium text-gray-900">
              {event.data?.name}
            </h4>
          )}
        </div>
      </div>
      <Dialog open={isScanned} onOpenChange={clearResult}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ผลการแสกนบาร์โค้ด</DialogTitle>
            <h5 className="mt-4">หมายเลขบาร์โค้ด</h5>
            <h4 className="text-xl">{payload?.barcode}</h4>
            <h5 className="mt-4">รายละเอียดนิสิต</h5>
            <h4 className="text-xl">
              {user.isFetching
                ? "กำลังโหลด"
                : isNoUserData
                  ? "ไม่พบข้อมูลในระบบ"
                  : `${user.data?.full_name} (${user.data?.major})`}
            </h4>
            <h5 className="mt-4">แสกนเมื่อ</h5>
            <h4 className="text-xl">
              {dayjs(payload?.timestamp).format("DD-MM-YYYY HH:mm:ss")}
            </h4>
            <DialogFooter>
              <Button
                disabled={addParticipant.isPending}
                className="w-full mt-4"
                onClick={clearResult}
              >
                {addParticipant.isPending ? "กำลังตรวจสอบ" : "ปิด"}
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="mt-10 flex-1 flex flex-col justify-center items-center">
        <BarcodeScanner onScan={handleOnScan} inputRef={inputRef} />
        <QRCodeScanner onScan={handleOnScan} />
      </div>
    </div>
  );
}

export default EventClient;
