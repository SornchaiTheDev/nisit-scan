"use client";

import { CirclePlus, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import EventCard from "./components/EventCard";
import { api } from "~/lib/axios";
import { Event } from "~/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import EventDialog from "./components/EventDialog";
import { createEventFn } from "~/requests/event";
import { queryClient } from "~/wrapper/QueryWrapper";
import { EventSchema } from "~/schemas/createEventSchema";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";

function ManagePage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await api.get<Event[]>("/events");
      return res.data;
    },
  });

  const eventCount = events?.length ?? 0;

  const createEvent = useMutation({
    mutationFn: createEventFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleOnSubmit = async (formData: EventSchema) => {
    try {
      await createEvent.mutateAsync(formData);
      toast.success("สร้างอีเวนต์สำเร็จ");
      setIsOpen(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        const { response } = err;
        if (response?.data.code === "EVENT_ALREADY_EXISTS") {
          toast.error("เกิดข้อผิดพลาด", {
            description: "อีเวนต์นี้มีอยู่แล้ว",
          });
        }
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-medium">จัดการอีเวนต์</h2>

      <EventDialog
        triggerButton={
          <Button className="w-full gap-4 my-4">
            <CirclePlus size="1.25rem" /> สร้างอีเวนต์ใหม่
          </Button>
        }
        actionBtnContent={
          <>
            <CirclePlus size="1.25rem" />
            สร้าง
          </>
        }
        isPending={createEvent.isPending}
        {...{ handleOnSubmit, isOpen, setIsOpen }}
      />
      <div className="relative">
        <Search
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
          size="1.25rem"
        />
        <Input className="pl-10" placeholder="ค้นหาอีเวนต์" />
      </div>
      <h6 className="text-sm font-light my-4">
        อีเวนต์ทั้งหมด <span className="font-medium">{eventCount}</span> รายการ
      </h6>
      {isLoading ? (
        <div className="grid grid-cols-12 lg:flex-row flex-wrap mt-2 mb-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="col-span-12 md:col-span-4 h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-12 lg:flex-row flex-wrap mt-2 mb-4 gap-4">
          {events!.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ManagePage;
