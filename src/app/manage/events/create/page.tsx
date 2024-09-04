import React from "react";
import { Input } from "~/components/ui/input";

function CreateEventPage() {
  return (
    <div>
      <h5 className="text-xl">สร้างอีเวนต์ใหม่</h5>
      <label>ชื่ออีเวนต์</label>
      <Input placeholder="ชื่ออีเวนต์" />
    </div>
  );
}

export default CreateEventPage;
