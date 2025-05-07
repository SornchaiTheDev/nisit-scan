"use client";

import { Calendar, LogOut, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getBasePath } from "~/lib/getBasePath";
import { cn } from "~/lib/utils";

interface Props {
  name: string;
}

function SideBar({ name }: Props) {
  const pathname = usePathname();

  const eventPath = "/";
  const adminPath = "/admins";

  const isEvent = pathname === eventPath;
  const isStaff = pathname === adminPath;

  const router = useRouter();

  const handleLogout = () => {
    window.location.href = `/${getBasePath()}/auth/sign-out`;
  };

  return (
    <div className="fixed w-[240px] bg-white p-4 backdrop-blur-lg flex flex-col rounded-xl left-4 top-4 bottom-4 border">
      <div className="flex-1">
        <div>
          <h4 className="text-lg font-medium text-gray-900">{name}</h4>
          <h5 className="text-xs font-normal text-gray-500">แอดมิน</h5>
        </div>
        <div className="space-y-2 mt-4">
          <h6 className="text-sm text-gray-500">เมนู</h6>
          <button
            onClick={() => router.push(eventPath)}
            className={cn(
              "flex gap-2 items-center p-2 rounded-lg w-full hover:bg-gray-100",
              isEvent && "bg-gray-100",
            )}
          >
            <Calendar size="1rem" />
            จัดการอีเวนต์
          </button>
          <button
            onClick={() => router.push(adminPath)}
            className={cn(
              "flex gap-2 items-center p-2 rounded-lg w-full hover:bg-gray-100",
              isStaff && "bg-gray-100",
            )}
          >
            <UserRound size="1rem" />
            จัดการแอดมิน
          </button>
        </div>
      </div>
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full flex gap-4 justify-start"
      >
        <LogOut size="1rem" className="text-red-500" />
        <span className="text-sm font-normal text-red-500">ออกจากระบบ</span>
      </Button>
    </div>
  );
}

export default SideBar;
