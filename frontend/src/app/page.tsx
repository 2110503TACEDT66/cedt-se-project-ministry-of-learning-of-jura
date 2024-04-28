import RestaurantsWithTag from "@/components/RestaurantsWithTag";
import WelcomeBackDialog from "@/components/WelcomeBackDialog";
import useServerSession from "@/hooks/useServerSession";
import AddIcon from "@mui/icons-material/Add"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Link from "next/link";

export default async function Home() {
  const session = await useServerSession();
  return (
    <main className="flex flex-col gap-2">
      {
        session?.user.role === "restaurantOwner" && (
          <Link href={`/restaurants/create`} className="absolute right-0">
            <AddIcon fontSize="large" />
          </Link>
        )
      }
      {
        session?.user.role == "user" && (
          <WelcomeBackDialog/>
        )
      }
      <RestaurantsWithTag tag="japanese"></RestaurantsWithTag>
      <RestaurantsWithTag tag="thai"></RestaurantsWithTag>
    </main>
  );
}