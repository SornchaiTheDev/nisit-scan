"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PaginationState, Table } from "@tanstack/react-table";
import { Search, Trash, UserRoundPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";
import {
  addAdminFn,
  editAdminFn,
  getAdminPaginationFn,
  removeAdminsFn,
} from "~/requests/admin";
import { adminsColumns } from "./columns/admin.column";
import { Admin } from "~/types";
import AdminDialog from "./_components/AdminDialog";
import { toast } from "sonner";
import { queryClient } from "~/wrapper/QueryWrapper";
import { AxiosError } from "axios";
import _ from "lodash";
import { AdminSchema } from "~/schemas/adminSchema";

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
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.code === "CANNOT_DELETE_SELF") {
          toast.error("ไม่สามารถลบตัวเองได้");
          return;
        }
      }
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });

  const handleOnDeleteRows = async (table: Table<Admin>) => {
    const rows = table.getFilteredSelectedRowModel().rows;
    const ids = rows.map((row) => row.original.id);

    await removeAdmins.mutateAsync(ids);
    table.resetRowSelection();
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admins", pagination],
    queryFn: () =>
      getAdminPaginationFn(search, pagination.pageIndex, pagination.pageSize),
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
          return;
        }
      }
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const selectRow = (row: Admin) => {
    setSelectedAdmin(row);
  };

  const editAdmin = useMutation({
    mutationFn: (admin: AdminSchema) => editAdminFn(selectedAdmin?.id, admin),
    onSuccess: () => {
      setSelectedAdmin(null);
      toast.success("แก้ไขแอดมินสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["admins", pagination] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.code === "ADMIN_ALREADY_EXISTS") {
          toast.error("อีเมลล์นี้มีอยู่ในระบบแล้ว");
          return;
        }
      }
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });

  return (
    <>
      <AdminDialog
        key={selectedAdmin?.id}
        title="แก้ไขแอดมิน"
        actionBtnContent="แก้ไข"
        initialData={!!selectedAdmin ? selectedAdmin : undefined}
        handleOnSubmit={(admin) => editAdmin.mutate(admin)}
        isPending={editAdmin.isPending}
        isSuccess={editAdmin.isSuccess}
        {...{
          isOpen: !!selectedAdmin,
          setIsOpen: () => setSelectedAdmin(null),
        }}
      />
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl">จัดการแอดมิน</h3>

        <div className="flex justify-end mb-4 mt-2">
          <AdminDialog
            title="เพิ่มแอดมินใหม่"
            triggerButton={
              <Button className="flex gap-2" size="sm">
                <UserRoundPlus size="1rem" />
                เพิ่มแอดมิน
              </Button>
            }
            actionBtnContent="เพิ่มแอดมิน"
            handleOnSubmit={(admin) => addAdmin.mutate(admin)}
            isSuccess={addAdmin.isSuccess}
            isPending={addAdmin.isPending}
            {...{ isOpen, setIsOpen }}
          />
        </div>

        <DataTable
          className="flex-1"
          meta={{ selectRow }}
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
    </>
  );
}

export default ManageStaffPage;
