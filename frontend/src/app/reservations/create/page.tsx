import CreateReservationForm from "@/components/CreateReservationForm";
import useServerSession from "@/hooks/useServerSession";
import { redirect, useSearchParams } from "next/navigation";

export default async function({
  searchParams
}:{
  searchParams:{
    restaurantName?: string,
    restaurantPeriod?: string
  }
}){
  const session = await useServerSession();
  if(session==undefined){
    redirect("/login")
  }
  if(session.user.role=="restaurantOwner"){
    redirect("/")
  }
  return (
    <main>
      <CreateReservationForm 
        session={session}
        restaurantName={searchParams.restaurantName}
        reservationPeriod={searchParams.restaurantPeriod}
      ></CreateReservationForm>
    </main>
  )
}