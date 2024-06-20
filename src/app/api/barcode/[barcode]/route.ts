import { firestore } from "../../firebase";

export const GET = async (
  _: Request,
  { params }: { params: { barcode: string } },
) => {
  console.log(params);
  const { barcode } = params;

  const doc = await firestore.collection("nisits").doc(barcode).get();

  if (doc.exists) {
    return Response.json({ status: "ALREADY_EXIST" });
  }

  return Response.json({ status: "NOT_FOUNT" });
};
