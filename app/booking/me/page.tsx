import Error from "@/app/error";
import MyBookings from "@/components/booking/MyBookings";
import { getAuthHeader } from "@/helpers/authHeader";

export const metadata = { title: "My Bookings" };

const myBookings = async () => {
  const authHeader = getAuthHeader();
  const res = await fetch(`${process.env.API_URL}/api/booking/me`, authHeader);
  return res.json();
};

export default async function MyBookingsPage() {
  const data = await myBookings();

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return <MyBookings data={data} />;
}
