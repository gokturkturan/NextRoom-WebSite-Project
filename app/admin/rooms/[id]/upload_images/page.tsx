import Error from "@/app/error";
import UploadRoomImage from "@/components/admin/UploadRoomImage";

export const metadata = { title: "Update Room Images - Admin" };

const getRoom = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/api/room/${id}`, {
    next: { tags: ["RoomDetails"] },
  });
  return res.json();
};

export default async function AdminUploadImagesPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getRoom(params.id);

  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return <UploadRoomImage data={data} />;
}
