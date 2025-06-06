import { Calendar, LogOut, Menu, UserRound, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { getBasePath } from "~/lib/getBasePath";
import { cn } from "~/lib/utils";

interface Props {
  name: string;
}

function Hamburger({ name }: Props) {
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="fixed left-0 right-0 z-40 bg-white p-2 shadow-sm rounded-b-lg">
      <div className="flex justify-end">
        <Button size="icon" variant="ghost" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size="1rem" /> : <Menu size="1rem" />}
        </Button>
      </div>
      {isOpen && (
        <>
          <div className="flex-1 p-2">
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
              <button
                onClick={handleLogout}
                className="flex gap-2 items-center p-2 rounded-lg w-full hover:bg-gray-100 justify-start"
              >
                <LogOut size="1rem" className="text-red-500" />
                <span className="font-normal text-red-500">ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Hamburger;
