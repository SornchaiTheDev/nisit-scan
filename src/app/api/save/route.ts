import { NextRequest } from "next/server";
import { firestore } from "../firebase";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { barcode, timestamp } = body;

    await firestore
      .collection("nisits")
      .doc(barcode)
      .set({
        barcode,
        timestamp: new Date(timestamp),
      });
    return Response.json({ status: "SUCCESS" });
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        status: "INTERNAL_SERVER_ERROR",
      },
      { status: 400 },
    );
  }
};
