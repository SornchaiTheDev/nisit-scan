import { BrowserMultiFormatReader } from "@zxing/library";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ScanEventPayload } from "~/types";

export interface ScanResult {
  barcode: string | null;
  timestamp: Date | null;
}

interface Props {
  onScan?: (result: ScanEventPayload) => void;
}

function useScanner(props?: Props) {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const isNoCamera = cameras.length === 0;

  const videoRef = useRef<HTMLVideoElement>(null);

  const codeReaderRef = useRef(new BrowserMultiFormatReader());
  const codeReader = codeReaderRef.current;

  useEffect(() => {
    codeReader.listVideoInputDevices().then((videoInputDevices) => {
      setCameras(videoInputDevices);
      if (videoInputDevices.length === 0) return;
      setSelectedCamera(videoInputDevices[0].deviceId);
    });
  }, [codeReader]);

  const onScan = useCallback(
    (res: ScanEventPayload) => {
      if (props?.onScan === undefined) return;
      props.onScan(res);
    },
    [props],
  );

  const [scanResult, setScanResult] = useState<ScanResult>({
    barcode: null,
    timestamp: null,
  });

  const clearResult = () => {
    setScanResult({
      barcode: null,
      timestamp: null,
    });
  };

  useEffect(() => {
    if (selectedCamera === null || scanResult.barcode !== null) return;

    const codeReader = new BrowserMultiFormatReader();

    const getBarcode = async () => {
      if (videoRef.current === null) return;

      const result = await codeReader.decodeOnceFromVideoDevice(
        selectedCamera,
        videoRef.current,
      );

      const barcode = result.getText();

      if (!barcode.startsWith("200") || barcode.length !== 14) {
        toast.error("รูปแบบรหัสบาร์โค้ดไม่ถูกต้อง");
        return;
      }

      setScanResult({
        barcode,
        timestamp: new Date(result.getTimestamp()),
      });

      onScan({
        barcode,
        timestamp: new Date(result.getTimestamp()),
      });
    };

    getBarcode();
  }, [selectedCamera, onScan, scanResult.barcode, codeReader]);

  const onChangeCameraSource = (camera: string) => {
    setSelectedCamera(camera);
  };

  return {
    cameras,
    selectedCamera,
    onChangeCameraSource,
    videoRef,
    isNoCamera,
    scanResult,
    clearResult,
  };
}

export default useScanner;
