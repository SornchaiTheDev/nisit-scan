import Link from "next/link";
import React from "react";
import { Event } from "~/types";

function EventCard({ id, name, owner }: Event) {
  return (
    <Link
      href={`/manage/event/${id}`}
      className="rounded-lg col-span-12 md:col-span-4 h-32 border p-2 relative flex flex-col justify-end gap-1 bg-white hover:drop-shadow-md"
    >
      <h4 className="text-xl">{name}</h4>
      <h6 className="text-xs font-light">
        สร้างโดย <span className="font-semibold">{owner}</span>
      </h6>
      {/* <Badge className="absolute right-3 top-3 gap-2"> */}
      {/*   <Users size="1rem" /> */}
      {/*   10 */}
      {/* </Badge> */}
    </Link>
  );
}

export default EventCard;
