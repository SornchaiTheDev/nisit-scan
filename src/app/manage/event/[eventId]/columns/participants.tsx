import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Participant } from "~/types/Event";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";

export const participantsColumns: ColumnDef<Participant>[] = [
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
    accessorKey: "barcode",
    header: "บาร์โค้ด",
  },
  {
    accessorKey: "timestamp",
    header: "เวลาเข้าร่วม",
    cell: ({ row }) =>
      dayjs(row.getValue("timestamp")).format("DD/MM/YYYY HH:mm:ss"),
  },
];
