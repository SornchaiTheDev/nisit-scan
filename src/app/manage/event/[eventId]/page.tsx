interface Participant {
  barcode: string;
  scannedDate: Date;
}

interface Event {
  name: string;
  date: Date;
  participants: Participant[];
}

function EventPage() {
  const { name, date, participants }: Event = {
    name: "กิจกรรม Coop",
    date: new Date(),
    participants: [
      {
        barcode: "1234567890",
        scannedDate: new Date(),
      },
    ],
  };
  return (
    <div>
      <h5 className="text-xl font-semibold">Event Detail</h5>
      <h3 className="text-lg">{name}</h3>
    </div>
  );
}

export default EventPage;
