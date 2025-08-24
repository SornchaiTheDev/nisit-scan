"use client";
import { FormEvent, RefObject, useState } from "react";
import { ScanEventPayload } from "~/types";

interface Props {
  onScan: (barcode: ScanEventPayload) => void;
  inputRef: RefObject<HTMLInputElement>;
}

function BarcodeScanner({ onScan, inputRef }: Props) {
  const [barcode, setBarcode] = useState("");

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onScan({ barcode, timestamp: new Date() });
    setBarcode("");
  };

  return (
    <div className="mb-10 flex flex-col gap-1">
      <label>สำหรับยิงบาร์โค้ด</label>
      <form onSubmit={handleOnSubmit}>
        <input
          ref={inputRef}
          className="text-xl border rounded-lg p-2"
          autoFocus
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
      </form>
    </div>
  );
}

export default BarcodeScanner;
