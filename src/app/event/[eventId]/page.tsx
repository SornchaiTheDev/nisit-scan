"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import useScanner from "~/hooks/useScanner";
import { addParticipantFn } from "~/requests/event";
import { getEventFn } from "~/requests/event/getEventFn";

function EventPage({ params }: { params: { eventId: string } }) {
  const event = useQuery({
    queryKey: ["event", params.eventId],
    queryFn: () => getEventFn(params.eventId),
  });

  const addParticipant = useMutation({
    mutationFn: (barcode: string) => addParticipantFn(params.eventId, barcode),
    onSuccess: () => {
      toast.success("ลงทะเบียนนิสิตสำเร็จ");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.code === "PARTICIPANT_ALREADY_EXISTS") {
          return toast.error("นิสิตลงทะเบียนไปแล้ว");
        }
      }
      toast.error("เกิดข้อผิดพลาดในการลงทะเบียน");
    },
  });

  const {
    selectedCamera,
    cameras,
    videoRef,
    onChangeCameraSource,
    scanResult,
    clearResult,
    isNoCamera,
  } = useScanner({
    onScan: (res) => addParticipant.mutate(res.barcode),
  });

  return (
    <div className="p-4 flex flex-col h-screen">
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              Sornchai Somsakul
            </h4>
            <h5 className="text-xs font-normal text-gray-500">เจ้าหน้าที่</h5>
          </div>
          <Button variant="outline" size="icon">
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
      <Dialog open={scanResult.barcode !== null} onOpenChange={clearResult}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ผลการแสกนบาร์โค้ด</DialogTitle>
            <h5 className="mt-4">หมายเลขบาร์โค้ด</h5>
            <h4 className="text-xl">{scanResult?.barcode}</h4>

            <h5 className="mt-4">แสกนเมื่อ</h5>
            <h4 className="text-xl">
              {dayjs(scanResult?.timestamp).format("DD-MM-YYYY HH:mm:ss")}
            </h4>
            <DialogFooter>
              <Button
                disabled={addParticipant.isPending}
                onClick={clearResult}
                className="w-full mt-4"
              >
                {addParticipant.isPending ? "กำลังตรวจสอบ" : "ปิด"}
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="mt-10 flex-1 flex flex-col justify-center items-center">
        <video className="rounded-2xl" autoPlay ref={videoRef}></video>
        <div className="mt-4">
          <Select
            value={selectedCamera ?? undefined}
            onValueChange={onChangeCameraSource}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={selectedCamera ?? "เลือกกล้อง"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {isNoCamera && (
                  <SelectLabel className="font-normal">ไม่พบกล้อง</SelectLabel>
                )}
                {cameras.map(({ deviceId, label }) => (
                  <SelectItem value={deviceId} key={deviceId}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default EventPage;
