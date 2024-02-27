import Error from "@/app/error";
import BookingDetails from "@/components/booking/BookingDetails";
import { getAuthHeader } from "@/helpers/authHeader";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: "My Bookings Details",
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

  return <BookingDetails data={data} />;
}
