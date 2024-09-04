"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

function TopBar() {
  const pathname = usePathname();
  const isEvent = pathname === "/manage/events";
  const isStaff = pathname === "/manage/staff";

  const router = useRouter();
  return (
    <div className="flex justify-center gap-8 border-b pt-4">
      <button
        onClick={() => router.push("/manage/events")}
        className={cn("border-gray-900", isEvent && "border-b-2")}
      >
        <h4>จัดการอีเวนต์</h4>
      </button>
      <button
        onClick={() => router.push("/manage/staff")}
        className={cn("border-gray-900", isStaff && "border-b-2")}
      >
        <h4>เจ้าหน้าที่</h4>
      </button>
    </div>
  );
}

export default TopBar;
