import { ColumnDef } from "@tanstack/react-table";
import dayjs from "~/lib/dayjs";
import Link from "~/components/ui/link";
import type { Event } from "~/types/Event";

export const eventsColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "ชื่อ",
    cell: ({ row }) => (
      <Link href={`/event/${row.original.id}`}>{row.original.name}</Link>
    ),
  },
  {
    accessorKey: "date",
    header: "วันที่",
    cell: ({ row }) => dayjs(row.getValue("date")).format("DD/MM/BBBB"),
  },
  {
    accessorKey: "place",
    header: "สถานที่",
  },
  {
    accessorKey: "host",
    header: "ผู้รับผิดชอบ",
  },
  {
    accessorKey: "participants_count",
    header: "จำนวนผู้เข้าร่วม",
  },
  {
    accessorKey: "owner",
    header: "ผู้สร้าง",
  },
];
