import { BrowserMultiFormatReader } from "@zxing/library";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { exists } from "fs";
import { toast } from "sonner";

type ScanResult = {
  barcode: string | null;
  timestamp: number | null;
};

function useScanner() {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader.listVideoInputDevices().then((videoInputDevices) => {
      setCameras(videoInputDevices);
      setSelectedCamera(videoInputDevices[0].deviceId);
    });
  }, []);

  const [scanResult, setScanResult] = useState<ScanResult>({
    barcode: null,
    timestamp: null,
  });
  const isScanSuccess = scanResult.barcode !== null;

  useEffect(() => {
    if (videoRef.current === null || selectedCamera === null) return;

    const codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoDevice(
      selectedCamera,
      videoRef.current,
      (result) => {
        if (result === null || scanResult.barcode !== null) return;
        setScanResult({
          barcode: result.getText(),
          timestamp: result.getTimestamp(),
        });
      },
    );
    return () => codeReader.reset();
  }, [selectedCamera, scanResult]);

  const [saveStatus, setSaveStatus] = useState<"SAVING" | "SAVED" | "IDLE">(
    "IDLE",
  );

  useEffect(() => {
    if (scanResult.barcode === null) return;
    const saveToDB = async () => {
      setSaveStatus("SAVING");

      try {
        const existRes = await axios.get<{
          status: "ALREADY_EXIST" | "NOT_FOUND";
        }>(`/api/barcode/${scanResult.barcode}`);

        if (existRes.data.status === "ALREADY_EXIST")
          return toast.error("นิสิตลงทะเบียนไปแล้ว");

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

  const onChangeCameraSource = (camera: string) => {
    setSelectedCamera(camera);
  };

  const clearResult = () => {
    setScanResult({
      barcode: null,
      timestamp: null,
    });
    setSaveStatus("IDLE");
  };

  return {
    cameras,
    scanResult,
    selectedCamera,
    onChangeCameraSource,
    videoRef,
    isScanSuccess,
    clearResult,
    saveStatus,
  };
}

export default useScanner;
