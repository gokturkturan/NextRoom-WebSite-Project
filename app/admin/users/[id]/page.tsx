import Error from "@/app/error";
import UpdateUser from "@/components/admin/UpdateUser";
import { getAuthHeader } from "@/helpers/authHeader";

export const metadata = { title: "Update User - Admin" };

interface Props {
  params: { id: string };
}

const getUser = async (id: string) => {
  const authHeader = getAuthHeader();
  const res = await fetch(
    `${process.env.API_URL}/api/admin/user/${id}`,
    authHeader
  );
  return res.json();
};

export default async function UpdateUserPage({ params }: Props) {
  const data = await getUser(params?.id);
  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return <UpdateUser data={data} />;
}
