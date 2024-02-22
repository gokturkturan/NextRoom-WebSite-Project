import Home from "@/components/Home";
import Error from "./error";

export const metadata = { title: "HomePage - NextRoom" };

const getRooms = async (searchParams: string) => {
  const urlParams = new URLSearchParams(searchParams);
  const queryString = urlParams.toString();
  const res = await fetch(`${process.env.API_URL}/api/room?${queryString}`, {
    cache: "no-cache",
  });
  return res.json();
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: string;
}) {
  const data = await getRooms(searchParams);
  if (data?.errMessage) {
    return <Error error={data} />;
  }

  return (
    <div className="container">
      <Home data={data} />
    </div>
  );
}
