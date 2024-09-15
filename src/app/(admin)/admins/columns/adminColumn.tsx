import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Admin } from "~/types";

export const adminsColumns: ColumnDef<Admin>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "อีเมลล์",
  },
  {
    accessorKey: "fullName",
    header: "ชื่อจริง",
  },
  {
    id: "actions",
    header: "แก้ไข",
    cell: ({ table, row }) => (
      <Button
        onClick={() => table.options.meta?.selectRow(row.original)}
        size="icon"
        variant="ghost"
        className="w-8 h-8"
      >
        <Pencil size="1rem" />
      </Button>
    ),
  },
];
