import React from "react";
import TopBar from "./components/TopBar";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 h-screen">
      <TopBar />
      <div className="p-4 max-w-6xl container">{children}</div>
    </div>
  );
}
