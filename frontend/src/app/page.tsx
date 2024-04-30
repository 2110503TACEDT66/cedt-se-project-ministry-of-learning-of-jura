import RestaurantsWithTag from "@/components/RestaurantsWithTag";
import WelcomeBackDialog from "@/components/WelcomeBackDialog";
import useServerSession from "@/hooks/useServerSession";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

export default async function Home() {
  const session = await useServerSession();

  console.log(process.env.BACKEND_URL + "/api/v1/redeem",await fetch(
    process.env.BACKEND_URL + "/api/v1/redeem",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    },
  ).then((res) => res.text()))

  const { data: canRedeem } = await fetch(
    process.env.BACKEND_URL + "/api/v1/redeem",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    },
  ).then((res) => res.json());

  return (
    <main className="flex flex-col gap-2">
      {session?.user.role === "restaurantOwner" && (
        <Link href={`/restaurants/create`} className="absolute right-0">
          <AddIcon fontSize="large" />
        </Link>
      )}
      {session?.user.role == "user" && canRedeem && <WelcomeBackDialog />}
      <RestaurantsWithTag tag="japanese"></RestaurantsWithTag>
      <RestaurantsWithTag tag="thai"></RestaurantsWithTag>
    </main>
  );
}
