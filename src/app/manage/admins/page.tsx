"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PaginationState, Table } from "@tanstack/react-table";
import { Search, Trash, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";
import {
  addAdminFn,
  getAdminPaginationFn,
  removeAdminsFn,
} from "~/requests/admin";
import { adminsColumns } from "./columns/adminColumn";
import { Admin } from "~/types";
import AdminDialog from "./_components/AdminDialog";
import { toast } from "sonner";
import { queryClient } from "~/wrapper/QueryWrapper";
import { AxiosError, AxiosHeaders } from "axios";

function ManageStaffPage() {
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });

  const removeAdmins = useMutation({
    mutationFn: removeAdminsFn,
    onSuccess: () => {
      toast.success("ลบแอดมินสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["admins", pagination] });
    },
  });

  const handleOnDeleteRows = async (table: Table<Admin>) => {
    const rows = table.getFilteredSelectedRowModel().rows;
    const ids = rows.map((row) => row.original.id);

    await removeAdmins.mutateAsync(ids);
    table.resetRowSelection();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admins", pagination],
    queryFn: () =>
      getAdminPaginationFn(search, pagination.pageIndex, pagination.pageSize),
  });

  const [isOpen, setIsOpen] = useState(false);

  const addAdmin = useMutation({
    mutationFn: addAdminFn,
    onSuccess: () => {
      setIsOpen(false);
      toast.success("เพิ่มแอดมินสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["admins", pagination] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.code === "ADMIN_ALREADY_EXISTS") {
          toast.error("อีเมลล์นี้มีอยู่ในระบบแล้ว");
        }
      }
    },
  });

  return (
    <div>
      <h3 className="text-2xl">จัดการแอดมิน</h3>

      <div className="flex justify-end mb-4 mt-2">
        <AdminDialog
          triggerButton={
            <Button className="flex gap-2" size="sm">
              <UserRoundPlus size="1rem" />
              เพิ่มแอดมิน
            </Button>
          }
          actionBtnContent="เพิ่มแอดมิน"
          handleOnSubmit={(admin) => addAdmin.mutate(admin)}
          {...{ isOpen, setIsOpen }}
          isPending={addAdmin.isPending}
        />
      </div>

      <DataTable
        topSection={(table) => (
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาแอดมิน"
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
                disabled={table.getFilteredSelectedRowModel().rows.length === 0}
                onClick={() => handleOnDeleteRows(table)}
                size="icon"
                className="w-8 h-8"
                variant="outline"
              >
                <Trash size="1rem" />
              </Button>
            </div>
          </div>
        )}
        isLoading={isLoading}
        totalRows={data?.totalRows ?? 0}
        columns={adminsColumns}
        data={data?.admins ?? []}
        {...{ pagination, setPagination }}
      />
    </div>
  );
}

export default ManageStaffPage;
