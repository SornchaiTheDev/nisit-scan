"use client";

import { useMediaQuery } from "usehooks-ts";
import Hamburger from "./components/Hamburger";
import SideBar from "./components/SideBar";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="bg-[#F5F7F8] min-h-screen">
      {isMobile ? <Hamburger /> : <SideBar />}
      <div
        className="p-4"
        style={{
          marginLeft: isMobile ? 0 : 260,
          paddingTop: isMobile ? 80 : 40,
        }}
      >
        {children}
      </div>
    </div>
  );
}
