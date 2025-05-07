"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "~/lib/dayjs";
import "dayjs/locale/th";
import {
  ArrowLeft,
  Download,
  Hash,
  MapPin,
  Pencil,
  Save,
  Search,
  Trash,
  User,
} from "lucide-react";
import { DataTable } from "~/components/ui/data-table";
import { participantsColumns } from "./columns/participants";
import { useEffect, useMemo, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import {
  getParticipantsFn,
  removeParticipantFn,
  removeEventFn,
  editEventFn,
  getEventFn,
} from "~/requests/event";
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
import EventDialog from "../../components/EventDialog";
import { EventSchema } from "~/schemas/eventSchema";
import { queryClient } from "~/wrapper/QueryWrapper";
import { Skeleton } from "~/components/ui/skeleton";
import _ from "lodash";
import { Participant } from "~/types/Event";
import { Table } from "@tanstack/react-table";
import { Tag, TagInput } from "emblor";
import { setStaffsFn } from "~/requests/staff";
import CopyLinkButton from "./_components/CopyLinkButton";
import { AxiosError } from "axios";
import { getBasePath } from "~/lib/getBasePath";

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

  const webUrl = window.location.origin;

  const name = event?.name ?? "";
  const place = event?.place ?? "";
  const host = event?.host ?? "";
  const _date = dayjs(event?.date);
  const day = _date.format("DD");
  const month = _date.format("MMM");
  const year = _date.format("BBBB");

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
      router.push("/");
      toast.success("ลบอีเวนต์สำเร็จ");
    },
    onError: () => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"),
  });

  const editEvent = useMutation({
    mutationFn: (formData: EventSchema) => editEventFn(id, formData),
    onSuccess: () => {
      toast.success("แก้ไขอีเวนต์สำเร็จ");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.code === "EVENT_ALREADY_EXISTS") {
          toast.error("อีเวนต์นี้มีอยู่แล้ว");
        }
        return;
      }
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
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

  const deleteParticipant = useMutation({
    mutationFn: (barcodes: string[]) => removeParticipantFn(id, barcodes),
    onSuccess: () => {
      toast.success("ลบผู้เข้าร่วมสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["participants", pagination] });
    },
    onError: () => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"),
  });

  const handleOnDeleteRows = (table: Table<Participant>) => {
    const rows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    const barcodes = rows.map((row) => row.barcode);

    deleteParticipant.mutate(barcodes);
    table.resetRowSelection();
  };

  const noParticipants = participants?.participants.length === 0;
  const handleExportAsCSV = () => {
    if (participants === undefined) return;

    const csv = participants.participants
      .map(
        ({ barcode, timestamp }) =>
          `${barcode},${dayjs(timestamp).format("DD/MM/BBBB HH:mm:ss")}`,
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const fileName = `${name.replace(/\s/g, "_")}_${day}_${month}_${year}_participants.csv`;
    a.download = fileName;
    a.click();
  };

  const [staffsInput, setStaffsInput] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isEventLoading) return;
    const emails = event?.staffs.map((staff) => staff.email) ?? [];
    setStaffsInput(emails.map((email) => ({ id: email, text: email }) as Tag));
  }, [event?.staffs, isEventLoading]);

  const setStaffs = useMutation({
    mutationFn: (staffs: string[]) => setStaffsFn(id, staffs),
    onSuccess: () => {
      toast.success("แก้ไขเจ้าหน้าที่สำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
    onError: () => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"),
  });

  const staffsEvent = staffsInput.map((tag) => tag.text);

  const isStaffsChanged =
    JSON.stringify(staffsEvent) !==
    JSON.stringify(event?.staffs.map((staff) => staff.email));

  return (
    <>
      <button
        className="flex gap-2 mt-2 mb-4 hover:text-gray-500 w-fit"
        onClick={() => router.push("/")}
      >
        <ArrowLeft />
        ย้อนกลับ
      </button>
      <div className="flex justify-end gap-2 mb-2">
        <CopyLinkButton link={`${webUrl}/${getBasePath()}/scan/${id}`} />
        <EventDialog
          key={event?.id}
          initialData={{
            name,
            place,
            host,
            date: new Date(event?.date ?? ""),
          }}
          triggerButton={
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Pencil size="1rem" />
              แก้ไขอีเวนต์
            </Button>
          }
          actionBtnContent={
            <>
              <Pencil size="1.25rem" />
              แก้ไข
            </>
          }
          handleOnSubmit={async (formData) => editEvent.mutate(formData)}
          isPending={editEvent.isPending}
          isSuccess={editEvent.isSuccess}
          {...{ isOpen, setIsOpen }}
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash size="1rem" />
              ลบอีเวนต์
            </Button>
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
                <h3 className="text-lg font-medium  text-gray-900">{host}</h3>

                <div className="flex items-center gap-2">
                  <MapPin size="1rem" className="min-w-[1rem]" />
                  <h5 className="text-sm text-gray-600">สถานที่</h5>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{place}</h3>
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
            <h6>
              {month} {year}
            </h6>
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
      <div className="w-full bg-white rounded-lg border border-slate-200 my-4 p-4">
        <h5 className="text-sm text-gray-600">เจ้าหน้าที่</h5>
        <div className="mt-2">
          {isEventLoading ? (
            <Skeleton className="w-full h-12" />
          ) : (
            <TagInput
              tags={staffsInput}
              setTags={setStaffsInput}
              styleClasses={{
                input: "shadow-none",
                tag: {
                  body: "pl-2 bg-gray-100 rounded-lg",
                },
              }}
              placeHolder="กรอกอีเมลเจ้าหน้าที่แล้ว Enter"
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          )}
        </div>
        <Button
          className="flex gap-2 items-center mt-2"
          size="sm"
          disabled={!isStaffsChanged}
          onClick={() => setStaffs.mutate(staffsEvent)}
        >
          <Save size="1rem" />
          บันทึก
        </Button>
      </div>
      <div className="mt-2">
        <h5 className="mb-4">ผู้เข้าร่วมงาน</h5>
        <DataTable
          topSection={(table) => (
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
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
                <h6 className="text-sm text-gray-700">
                  เลือกทั้งหมด {table.getFilteredSelectedRowModel().rows.length}{" "}
                  แถว
                </h6>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  disabled={
                    table.getFilteredSelectedRowModel().rows.length === 0
                  }
                  onClick={() => handleOnDeleteRows(table)}
                  size="icon"
                  className="w-8 h-8"
                  variant="outline"
                >
                  <Trash size="1rem" />
                </Button>
                <Button
                  disabled={noParticipants}
                  onClick={handleExportAsCSV}
                  variant="outline"
                  size="sm"
                  className="h-8 font-normal flex items-center gap-2"
                >
                  <Download size="1rem" />
                  Export as CSV
                </Button>
              </div>
            </div>
          )}
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
