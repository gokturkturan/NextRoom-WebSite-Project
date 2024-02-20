import Home from "@/components/Home";
import Error from "./error";

export const metadata = { title: "HomePage - NextRoom" };

const getRooms = async () => {
  const res = await fetch(`${process.env.API_URL}/api/room`);
  return res.json();
};

export default async function HomePage() {
  const data = await getRooms();
  if (data?.message) {
    return <Error error={data} />;
  }

  return (
    <div className="container">
      <Home data={data} />
    </div>
  );
}
