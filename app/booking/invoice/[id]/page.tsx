import Error from "@/app/error";
import Invoice from "@/components/invoice/Invoice";
import { getAuthHeader } from "@/helpers/authHeader";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: "My Booking Invoice",
};

const getBooking = async (id: string) => {
  const authHeader = getAuthHeader();
  const res = await fetch(
    `${process.env.API_URL}/api/booking/${id}`,
    authHeader
  );

  return res.json();
};

export default async function BookingDetailsPage({ params }: Props) {
  const data = await getBooking(params?.id);

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return <Invoice data={data} />;
}
