"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

function Alert() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    switch (error) {
      case "not-allowed":
        toast.error("คุณไม่มีสิทธิ์ในการเข้าถึงอีเวนต์นี้");
        break;
      case "unauthorized":
        toast.error("คุณไม่มีสิทธิ์ในการใช้งานระบบนี้");
        break;
      case "something-went-wrong":
        toast.error("เกิดข้อผิดพลาดบางอย่าง โปรดลองอีกครั้งในภายหลัง");
        break;
    }
  }, [error]);
}

export default Alert;
