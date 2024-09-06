import React from "react";
import Sidebar from "./components/SideBar";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F5F7F8] min-h-screen p-4">
      <Sidebar />
      <div className="p-4 ml-[240px]">{children}</div>
    </div>
  );
}
