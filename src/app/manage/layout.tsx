import React from "react";
import TopBar from "./components/TopBar";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <TopBar />
      <div className="max-w-6xl container p-4">{children}</div>
    </div>
  );
}
