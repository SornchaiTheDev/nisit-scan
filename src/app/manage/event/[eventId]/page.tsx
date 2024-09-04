"use client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Skeleton } from "~/components/ui/skeleton";
import { getEventById } from "~/requests/event";
import "dayjs/locale/th";
import { ArrowLeft, Hash, MapPin, Search, User } from "lucide-react";
import { DataTable } from "~/components/ui/data-table";
import { participantsColumns } from "./columns/participants";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { getParticipants } from "~/requests/participants/getParticipants";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

const EventDateLoading = () => (
  <div className="flex flex-col items-center gap-2">
    <Skeleton className="w-12 h-12" />
    <Skeleton className="w-20 h-6" />
  </div>
);

function EventPage({ params: { eventId } }: { params: { eventId: string } }) {
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ["event"],
    queryFn: () => getEventById(eventId),
  });

  const name = event?.name ?? "";
  const place = event?.place ?? "";
  const date = dayjs(event?.date).locale("th");
  const day = date.format("DD");
  const month = date.format("MMM");
  const host = event?.host ?? "";

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: participants, isLoading: isPartiLoading } = useQuery({
    queryKey: ["participants", pagination],
    queryFn: () =>
      getParticipants(eventId, pagination.pageIndex, pagination.pageSize),
  });

  const router = useRouter();

  return (
    <div>
      <button
        className="flex gap-2 mt-2 mb-4 hover:text-gray-500"
        onClick={() => router.back()}
      >
        <ArrowLeft />
        ย้อนกลับ
      </button>
      <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start bg-white p-4 rounded-lg border border-slate-200">
        {isEventLoading ? (
          <EventDateLoading />
        ) : (
          <div className="flex flex-col items-center">
            <h5 className="font-medium text-4xl">{day}</h5>
            <h6>{month}</h6>
          </div>
        )}
        <div className="space-y-2 flex-1">
          <h5 className="text-xl font-medium">รายละเอียดอีเวนต์</h5>
          <div className="flex items-center gap-2">
            <Hash size="0.9rem" className="min-w-[1rem]" />
            <h5 className="text-sm text-gray-600">ชื่ออีเวนต์</h5>
          </div>
          {isEventLoading ? (
            <Skeleton className="w-40 h-6" />
          ) : (
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          )}
          <div className="flex items-center gap-2">
            <User size="0.9rem" className="min-w-[1rem]" />
            <h5 className="text-sm text-gray-600">ผู้รับผิดชอบ</h5>
          </div>
          {isEventLoading ? (
            <Skeleton className="w-40 h-6" />
          ) : (
            <h3 className="text-lg font-medium">{host}</h3>
          )}

          <div className="flex items-center gap-2">
            <MapPin size="0.9rem" className="min-w-[1rem]" />
            <h5 className="text-sm text-gray-600">สถานที่</h5>
          </div>
          {isEventLoading ? (
            <Skeleton className="w-40 h-6" />
          ) : (
            <h3 className="text-lg">{place}</h3>
          )}
        </div>
      </div>
      <div className="mt-10">
        <h5 className="mb-4">ผู้เข้าร่วมงาน</h5>
        <DataTable
          topSection={
            <div className="relative">
              <Input
                placeholder="ค้นหาผู้เข้าร่วม"
                className="max-w-[300px] pl-8"
              />
              <Search
                className="absolute top-1/2 -translate-y-1/2 left-2"
                size="0.9rem"
              />
            </div>
          }
          isLoading={isPartiLoading}
          totalRows={participants?.totalRows ?? 0}
          columns={participantsColumns}
          data={participants?.participants ?? []}
          {...{ pagination, setPagination }}
        />
      </div>
    </div>
  );
}

export default EventPage;
