"use client";
import { FormEvent, useState } from "react";
import { ScanEventPayload } from "~/hooks/useScanner";

interface Props {
  onScan: (barcode: ScanEventPayload) => void;
}

function BarcodeScanner({ onScan }: Props) {
  const [barcode, setBarcode] = useState("");

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onScan({ barcode, timestamp: new Date() });
  };

  return (
    <div className="mb-10 flex flex-col gap-1">
      <label>สำหรับยิงบาร์โค้ด</label>
      <form onSubmit={handleOnSubmit}>
        <input
          className="text-xl "
          autoFocus
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
      </form>
    </div>
  );
}

export default BarcodeScanner;
