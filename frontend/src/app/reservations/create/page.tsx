import CreateReservationForm from "@/components/CreateReservationForm";
import useServerSession from "@/hooks/useServerSession";
import { redirect } from "next/navigation";

export default async function(){
  const session = await useServerSession();
  if(session==undefined){
    redirect("/login")
  }
  if(session.user.role=="restaurantOwner"){
    redirect("/")
  }
  return (
    <main>
      <CreateReservationForm token={session.token}></CreateReservationForm>
    </main>
  )
}