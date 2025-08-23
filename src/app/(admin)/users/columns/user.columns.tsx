import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { User } from "~/types";

export const usersColumns: ColumnDef<User>[] = [
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
    accessorKey: "code",
    header: "รหัสนิสิต",
  },
  {
    accessorKey: "full_name",
    header: "ชื่อ",
  },
  {
    accessorKey: "gmail",
    header: "Gmail",
  },
  {
    accessorKey: "major",
    header: "รหัสสาขา",
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
