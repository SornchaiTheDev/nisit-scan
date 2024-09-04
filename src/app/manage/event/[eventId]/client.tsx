"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { removeEventFn } from "~/requests/event";
import "dayjs/locale/th";
import { ArrowLeft, Hash, MapPin, Search, User } from "lucide-react";
import { DataTable } from "~/components/ui/data-table";
import { participantsColumns } from "./columns/participants";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { getParticipantsFn } from "~/requests/participants";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Event } from "~/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

function EventClient({ id, name, place, host, date }: Event) {
  const _date = dayjs(date).locale("th");
  const day = _date.format("DD");
  const month = _date.format("MMM");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: participants, isLoading: isPartiLoading } = useQuery({
    queryKey: ["participants", pagination],
    queryFn: () =>
      getParticipantsFn(id, pagination.pageIndex, pagination.pageSize),
  });

  const router = useRouter();

  const deleteEvent = useMutation({
    mutationFn: removeEventFn,
    onSuccess: () => {
      router.push("/manage/events");
      toast.success("ลบอีเวนต์สำเร็จ");
    },
  });

  return (
    <>
      <button
        className="flex gap-2 mt-2 mb-4 hover:text-gray-500"
        onClick={() => router.back()}
      >
        <ArrowLeft />
        ย้อนกลับ
      </button>
      <div className="flex justify-end gap-2 mb-2">
        <Button>แก้ไขอีเวนต์</Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">ลบอีเวนต์</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-medium">
                คุณแน่ใจที่จะลบอีเวนต์นี้หรือไม่?
              </DialogTitle>
              <DialogDescription className="space-y-2">
                <div className="flex items-center gap-2 mt-2">
                  <Hash size="1rem" className="min-w-[1rem]" />
                  <h5 className="text-sm text-gray-600">ชื่ออีเวนต์</h5>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                <div className="flex items-center gap-2">
                  <User size="1rem" className="min-w-[1rem]" />
                  <h5 className="text-sm text-gray-600">ผู้รับผิดชอบ</h5>
                </div>
                <h3 className="text-lg font-medium">{host}</h3>

                <div className="flex items-center gap-2">
                  <MapPin size="1rem" className="min-w-[1rem]" />
                  <h5 className="text-sm text-gray-600">สถานที่</h5>
                </div>
                <h3 className="text-lg">{place}</h3>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col md:flex-row gap-1">
              <DialogClose asChild>
                <Button variant="secondary">ยกเลิก</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => deleteEvent.mutate(id)}
                disabled={deleteEvent.isPending}
              >
                ลบอีเวนต์
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex flex-col items-center">
          <h5 className="font-medium text-4xl">{day}</h5>
          <h6>{month}</h6>
        </div>
        <div className="space-y-2 flex-1">
          <h5>รายละเอียดอีเวนต์</h5>
          <div className="flex items-center gap-2">
            <Hash size="1rem" className="min-w-[1rem]" />
            <h5 className="text-sm text-gray-600">ชื่ออีเวนต์</h5>
          </div>
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          <div className="flex items-center gap-2">
            <User size="1rem" className="min-w-[1rem]" />
            <h5 className="text-sm text-gray-600">ผู้รับผิดชอบ</h5>
          </div>
          <h3 className="text-lg font-medium">{host}</h3>

          <div className="flex items-center gap-2">
            <MapPin size="1rem" className="min-w-[1rem]" />
            <h5 className="text-sm text-gray-600">สถานที่</h5>
          </div>
          <h3 className="text-lg">{place}</h3>
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
                size="1rem"
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
    </>
  );
}

export default EventClient;
