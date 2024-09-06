"use client";
import axios from "axios";
import dayjs from "dayjs";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
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
import useScanner from "~/hooks/useScanner";
import { api } from "~/lib/axios";

function EventPage() {
  const [saveStatus, setSaveStatus] = useState<"SAVING" | "SAVED" | "IDLE">(
    "IDLE",
  );

  const {
    selectedCamera,
    scanResult,
    cameras,
    videoRef,
    isScanSuccess,
    onChangeCameraSource,
    isNoCamera,
    clearResult,
  } = useScanner();

  useEffect(() => {
    if (scanResult.barcode === null) return;

    const saveToDB = async () => {
      setSaveStatus("SAVING");

      try {
        const existRes = await api.get<{
          status: "ALREADY_EXIST" | "NOT_FOUND";
        }>(`/api/barcode/${scanResult.barcode}`);

        if (existRes.data.status === "ALREADY_EXIST") {
          setSaveStatus("IDLE");
          return toast.error("นิสิตลงทะเบียนไปแล้ว");
        }

        const res = await axios.post("/api/save", scanResult);

        if (res.data.status === "SUCCESS") {
          setSaveStatus("SAVED");
          toast.success("ลงทะเบียนนิสิตสำเร็จ");
        }
      } catch (err) {
        setSaveStatus("IDLE");
        toast.error("เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    };
    saveToDB();
  }, [scanResult]);
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
          <h4 className="text-lg font-medium text-gray-900">First Event</h4>
        </div>
      </div>
      <Dialog open={isScanSuccess} onOpenChange={clearResult}>
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
                disabled={saveStatus === "SAVING"}
                onClick={clearResult}
                className="w-full mt-4"
              >
                {saveStatus === "SAVING" ? "กำลังตรวจสอบ" : "ปิด"}
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="mt-10 flex-1 flex flex-col justify-center items-start">
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
