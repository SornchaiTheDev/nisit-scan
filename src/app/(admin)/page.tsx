"use client";

import { CirclePlus, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import EventDialog from "./components/EventDialog";
import { createEventFn, getEventPaginationFn } from "~/requests/event";
import { queryClient } from "~/wrapper/QueryWrapper";
import { EventSchema } from "~/schemas/eventSchema";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "~/components/ui/data-table";
import { PaginationState } from "@tanstack/react-table";
import _ from "lodash";
import { eventsColumns } from "./columns/eventColumns";

function ManagePage() {
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

  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["events", pagination],
    queryFn: () =>
      getEventPaginationFn(search, pagination.pageIndex, pagination.pageSize),
  });

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
    <div className="flex flex-col flex-1">
      <h2 className="text-xl font-medium mb-4">จัดการอีเวนต์</h2>
      <DataTable
        className="flex-1"
        topSection={() => (
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex gap-4 items-center w-full md:w-fit">
              <div className="relative w-full">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาอีเวนต์"
                  className="w-full md:max-w-[300px] pl-8"
                />
                <Search
                  className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-600"
                  size="1rem"
                />
              </div>
            </div>
            <EventDialog
              triggerButton={
                <Button className="gap-2 w-full md:w-fit" size="sm">
                  <CirclePlus size="1rem" /> สร้างอีเวนต์ใหม่
                </Button>
              }
              actionBtnContent={
                <>
                  <CirclePlus size="1.25rem" />
                  สร้าง
                </>
              }
              isPending={createEvent.isPending}
              isSuccess={createEvent.isSuccess}
              {...{ handleOnSubmit, isOpen, setIsOpen }}
            />
          </div>
        )}
        isLoading={isLoading}
        totalRows={data?.totalRows ?? 0}
        columns={eventsColumns}
        data={data?.events ?? []}
        {...{ pagination, setPagination }}
      />
    </div>
  );
}

export default ManagePage;
