"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { removeEventFn } from "~/requests/event";
import "dayjs/locale/th";
import { ArrowLeft, Hash, MapPin, Pencil, Search, User } from "lucide-react";
import { DataTable } from "~/components/ui/data-table";
import { participantsColumns } from "./columns/participants";
import { useEffect, useMemo, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { getParticipantsFn } from "~/requests/participants";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import EventDialog from "../../events/components/EventDialog";
import { editEventFn } from "~/requests/event/editEventFn";
import { EventSchema } from "~/schemas/eventSchema";
import { queryClient } from "~/wrapper/QueryWrapper";
import { getEventFn } from "~/requests/event/getEventFn";
import { Skeleton } from "~/components/ui/skeleton";
import _ from "lodash";

const EventDateLoading = () => (
  <div className="flex flex-col items-center gap-2">
    <Skeleton className="w-12 h-12" />
    <Skeleton className="w-20 h-6" />
  </div>
);

interface Props {
  id: string;
}

function EventClient({ id }: Props) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventFn(id),
  });

  const name = event?.name ?? "";
  const place = event?.place ?? "";
  const host = event?.host ?? "";
  const _date = dayjs(event?.date).locale("th");
  const day = _date.format("DD");
  const month = _date.format("MMM");

  const [search, setSearch] = useState("");

  const {
    data: participants,
    isLoading: isPartiLoading,
    refetch,
  } = useQuery({
    queryKey: ["participants", pagination],
    queryFn: () =>
      getParticipantsFn(id, search, pagination.pageIndex, pagination.pageSize),
  });

  const router = useRouter();

  const deleteEvent = useMutation({
    mutationFn: removeEventFn,
    onSuccess: () => {
      router.push("/manage/events");
      toast.success("ลบอีเวนต์สำเร็จ");
    },
  });

  const editEvent = useMutation({
    mutationFn: (formData: EventSchema) => editEventFn(id, formData),
    onSuccess: () => {
      toast.success("แก้ไขอีเวนต์สำเร็จ");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const debouncedRefetch = useMemo(
    () =>
      _.debounce(() => {
        refetch();
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }, 500),
    [refetch],
  );

  useEffect(() => {
    debouncedRefetch();
  }, [search, debouncedRefetch]);

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
        <EventDialog
          key={event?.id}
          initialData={{
            name,
            place,
            host,
            date: new Date(event?.date ?? ""),
          }}
          triggerButton={<Button>แก้ไขอีเวนต์</Button>}
          actionBtnContent={
            <>
              <Pencil size="1.25rem" />
              แก้ไข
            </>
          }
          handleOnSubmit={async (formData) => editEvent.mutate(formData)}
          isPending={editEvent.isPending}
          {...{ isOpen, setIsOpen }}
        />

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
        {isEventLoading ? (
          <EventDateLoading />
        ) : (
          <div className="flex flex-col items-center">
            <h5 className="font-medium text-4xl">{day}</h5>
            <h6>{month}</h6>
          </div>
        )}
        <div className="space-y-2 flex-1">
          <h5>รายละเอียดอีเวนต์</h5>
          <div className="flex items-center gap-2">
            <Hash size="1rem" className="min-w-[1rem]" />
            <h5 className="text-sm text-gray-600">ชื่ออีเวนต์</h5>
          </div>
          {isEventLoading ? (
            <Skeleton className="w-40 h-6" />
          ) : (
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          )}
          <div className="flex items-center gap-2">
            <User size="1rem" className="min-w-[1rem]" />
            <h5 className="text-sm text-gray-600">ผู้รับผิดชอบ</h5>
          </div>
          {isEventLoading ? (
            <Skeleton className="w-40 h-6" />
          ) : (
            <h3 className="text-lg font-medium">{host}</h3>
          )}

          <div className="flex items-center gap-2">
            <MapPin size="1rem" className="min-w-[1rem]" />
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
