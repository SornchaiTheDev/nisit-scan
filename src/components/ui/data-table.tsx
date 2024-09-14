import {
  ColumnDef,
  OnChangeFn,
  RowData,
  TableMeta,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Table,
} from "@tanstack/react-table";

import {
  Table as TableUI,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "./skeleton";
import { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "~/lib/utils";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    selectRow: (row: TData) => void;
  }
}

interface Pagination {
  pageIndex: number;
  pageSize: number;
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: Pagination;
  setPagination: OnChangeFn<Pagination>;
  totalRows: number;
  isLoading?: boolean;
  topSection?: (table: Table<TData>) => ReactNode;
  meta?: TableMeta<TData>;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  totalRows,
  isLoading,
  topSection,
  meta,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta,
    state: {
      pagination,
    },
    rowCount: totalRows,
    onPaginationChange: setPagination,
  });

  return (
    <>
      {typeof topSection === "function" && topSection(table)}
      <div
        className={cn(
          "rounded-md border mt-4 bg-white flex flex-col justify-between min-h-[500px]",
          className,
        )}
      >
        <TableUI>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                {columns.map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton className="w-full h-6" />
                  </TableCell>
                ))}
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
        <div className="flex items-center justify-between space-x-2 p-2 border-t">
          <h6 className="text-xs">
            แสดง{" "}
            {Math.min(
              pagination.pageIndex * pagination.pageSize + 1,
              table.getRowCount(),
            )}
            -
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              table.getRowCount(),
            )}{" "}
            จาก {table.getRowCount()} รายการ
          </h6>
          <div className="flex gap-2 items-center">
            <h6 className="text-xs">แสดงหน้าละ</h6>
            <Select
              onValueChange={(value) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: parseInt(value),
                }))
              }
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SelectItem key={i} value={((i + 1) * 10).toString()}>
                    {(i + 1) * 10}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-x-2 flex items-center">
              <Button
                variant="ghost"
                className="w-6 h-6"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="ghost"
                className="w-6 h-6"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
