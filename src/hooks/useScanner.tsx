import { BrowserMultiFormatReader } from "@zxing/library";
import { useEffect, useRef, useState } from "react";

type ScanResult = {
  barcode: string | null;
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
        if (result.getText().length !== 14) return;

        const res = {
          barcode: result.getText(),
          timestamp: result.getTimestamp(),
        };

        setScanResult(res);

        if (props !== undefined && props.onScan !== undefined) {
          props.onScan(res);
        }
      },
    );

    return () => codeReader.reset();
  }, [selectedCamera, scanResult, props]);

  const onChangeCameraSource = (camera: string) => {
    setSelectedCamera(camera);
  };

  const clearResult = () => {
    setScanResult({
      barcode: null,
      timestamp: null,
    });
  };

  return {
    cameras,
    scanResult,
    selectedCamera,
    onChangeCameraSource,
    videoRef,
    isScanSuccess,
    clearResult,
    isNoCamera,
  };
}

export default useScanner;
