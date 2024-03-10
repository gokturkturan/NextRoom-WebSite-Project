import Error from "@/app/error";
import UpdateRoom from "@/components/admin/UpdateRoom";
import { getAuthHeader } from "@/helpers/authHeader";

export const metadata = { title: "Update Room - Admin" };

const getRoom = async (id: string) => {
  const authHeaders = getAuthHeader();
  const res = await fetch(`${process.env.API_URL}/api/room/${id}`, {
    headers: authHeaders.headers,
  });
  return res.json();
};

export default async function AdminRoomsPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getRoom(params.id);

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return <UpdateRoom data={data} />;
}
