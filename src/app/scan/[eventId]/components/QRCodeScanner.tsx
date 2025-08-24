"use client";
import { memo } from "react";
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
import { ScanEventPayload } from "~/types";

interface Props {
  onScan: (payload: ScanEventPayload) => void;
}

function QRCodeScanner({ onScan }: Props) {
  const {
    selectedCamera,
    cameras,
    videoRef,
    onChangeCameraSource,
    isNoCamera,
  } = useScanner({
    onScan,
  });


  return (
    <>
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
                <SelectItem value={deviceId} key={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

export default memo(QRCodeScanner);
