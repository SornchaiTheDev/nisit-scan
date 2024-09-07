import { BrowserMultiFormatReader } from "@zxing/library";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ScanResult = {
  barcode: string;
  timestamp: number | null;
};

interface Props {
  onScan?: (result: ScanResult) => void;
}

function useScanner(props?: Props) {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const isNoCamera = cameras.length === 0;

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader.listVideoInputDevices().then((videoInputDevices) => {
      setCameras(videoInputDevices);
      if (videoInputDevices.length === 0) return;
      setSelectedCamera(videoInputDevices[0].deviceId);
    });
  }, []);

  const onScan = useMemo(() => props?.onScan, [props]);

  const decodeFromVideoDevice = useCallback(() => {
    if (videoRef.current === null) return;

    const codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoDevice(
      selectedCamera,
      videoRef.current,
      (result) => {
        if (result === null) return;
        if (result.getText().length !== 14) return;

        const res = {
          barcode: result.getText(),
          timestamp: result.getTimestamp(),
        };

        if (onScan === undefined) return;
        onScan(res);
      },
    );

    return () => codeReader.reset();
  }, [onScan, selectedCamera]);

  useEffect(() => {
    if (videoRef.current === null || selectedCamera === null) return;

    decodeFromVideoDevice();
  }, [selectedCamera, decodeFromVideoDevice]);

  const onChangeCameraSource = (camera: string) => {
    setSelectedCamera(camera);
  };

  return {
    cameras,
    selectedCamera,
    onChangeCameraSource,
    videoRef,
    isNoCamera,
  };
}

export default useScanner;
