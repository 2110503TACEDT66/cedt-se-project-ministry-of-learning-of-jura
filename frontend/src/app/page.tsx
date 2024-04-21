import RestaurantsWithTag from "@/components/RestaurantsWithTag";
import useServerSession from "@/hooks/useServerSession";
import AddIcon from "@mui/icons-material/Add"
import Link from "next/link";

export default async function Home() {
  const session = await useServerSession();
  console.log(session)
  return (
    <main className="flex flex-col gap-2">
      {
        session?.user.role=="restaurantOwner" && 
        <Link href={`/restaurants/create`} className="absolute right-0">
          <AddIcon fontSize="large"/>
        </Link>
      }
      <RestaurantsWithTag tag="japanese"></RestaurantsWithTag>
      <RestaurantsWithTag tag="thai"></RestaurantsWithTag>
    </main>
  );
}
