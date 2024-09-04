"use client";

import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import EventCard from "./components/EventCard";
import CreateEventDialog from "./components/CreateEventDialog";
import { api } from "~/lib/axios";
import { Event } from "~/types";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";

function ManagePage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await api.get<Event[]>("/events");
      return res.data;
    },
  });

  const eventCount = events?.length ?? 0;

  return (
    <div>
      <h2 className="text-xl font-medium">จัดการอีเวนต์</h2>

      <CreateEventDialog />
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
