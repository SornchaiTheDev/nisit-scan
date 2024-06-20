"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import useScanner from "~/hooks/useScanner";
import dayjs from "dayjs";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "~/components/ui/select";

export default function Home() {
  const {
    cameras,
    selectedCamera,
    onChangeCameraSource,
    scanResult,
    videoRef,
    isScanSuccess,
    clearResult,
    saveStatus,
    isNoCamera,
  } = useScanner();

  return (
    <div className="flex flex-col justify-center h-screen p-4">
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
                ปิด
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div>
        <video className="rounded-2xl" ref={videoRef}></video>
        <div className="mt-4">
          <Select
            value={selectedCamera ?? undefined}
            onValueChange={onChangeCameraSource}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="เลือกกล้อง" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {isNoCamera && <SelectLabel className="font-normal">ไม่พบกล้อง</SelectLabel>}
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
