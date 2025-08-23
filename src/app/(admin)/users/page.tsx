"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PaginationState, Table } from "@tanstack/react-table";
import { Search, Trash, UserRoundPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";
import { usersColumns } from "./columns/user.columns";
import { User } from "~/types";
import { toast } from "sonner";
import { queryClient } from "~/wrapper/QueryWrapper";
import { AxiosError } from "axios";
import _ from "lodash";
import { getUserPaginationFn } from "~/requests/user/getUserPaginationFn";
import UserDialog from "./components/UserDialog";
import { UserSchema } from "~/schemas/userSchema";
import { addUserFn, editUserFn, removeUsersFn } from "~/requests/user";
import ImportUserDialog from "./components/ImportUserDialog";

function ManageStaffPage() {
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });

  const removeUsers = useMutation({
    mutationFn: removeUsersFn,
    onSuccess: () => {
      toast.success("ลบข้อมูลนิสิตสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["users", pagination] });
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

  const handleOnDeleteRows = async (table: Table<User>) => {
    const rows = table.getFilteredSelectedRowModel().rows;
    const codes = rows.map((row) => row.original.code);

    await removeUsers.mutateAsync(codes);
    table.resetRowSelection();
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", pagination],
    queryFn: () =>
      getUserPaginationFn(search, pagination.pageIndex, pagination.pageSize),
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

  const addUser = useMutation({
    mutationFn: addUserFn,
    onSuccess: () => {
      setIsOpen(false);
      toast.success("เพิ่มข้อมูลนิสิตสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["users", pagination] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.code === "USER_ALREADY_EXISTS") {
          toast.error("รหัสนิสิตนี้มีอยู่ในระบบแล้ว");
          return;
        }
      }
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const selectRow = (row: User) => {
    setSelectedUser(row);
  };

  const editUser = useMutation({
    mutationFn: (user: UserSchema) => editUserFn(selectedUser?.code!, user),
    onSuccess: () => {
      setSelectedUser(null);
      toast.success("แก้ไขข้อมูลนิสิตสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["users", pagination] });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.data.code === "USER_ALREADY_EXISTS") {
          toast.error("รหัสนิสิตนี้มีอยู่ในระบบแล้ว");
          return;
        }
      }
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });

  return (
    <>
      <UserDialog
        key={selectedUser?.code}
        title="แก้ไขข้อมูลนิสิต"
        actionBtnContent="แก้ไข"
        initialData={!!selectedUser ? selectedUser : undefined}
        handleOnSubmit={(user) => editUser.mutate(user)}
        isPending={editUser.isPending}
        isSuccess={editUser.isSuccess}
        {...{
          isOpen: !!selectedUser,
          setIsOpen: () => setSelectedUser(null),
        }}
      />
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl">จัดการข้อมูลนิสิต</h3>

        <div className="flex justify-end mb-4 mt-2 gap-2">
          <UserDialog
            title="เพิ่มข้อมูลนิสิตใหม่"
            triggerButton={
              <Button className="flex gap-2" size="sm">
                <UserRoundPlus size="1rem" />
                เพิ่มข้อมูลนิสิต
              </Button>
            }
            actionBtnContent="เพิ่มข้อมูลนิสิต"
            handleOnSubmit={(user) => addUser.mutate(user)}
            isSuccess={addUser.isSuccess}
            isPending={addUser.isPending}
            {...{ isOpen, setIsOpen }}
          />
          <ImportUserDialog />
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
                    placeholder="ค้นหาข้อมูลนิสิต"
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
          columns={usersColumns}
          data={data?.users ?? []}
          {...{ pagination, setPagination }}
        />
      </div>
    </>
  );
}

export default ManageStaffPage;
