import DeleteReservationButton from "@/components/DeleteReservationButton";
import RestaurantImage from "@/components/RestaurantImage";
import useServerSession from "@/hooks/useServerSession";
import getReservations from "@/utils/getReservations";
import getRestaurant from "@/utils/getRestaurant";
import getRestaurantUrl from "@/utils/getRestaurantUrl";
import { Button, Typography } from "@mui/material";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Reservation,
  ReservationsResponse,
  Restaurant,
  RestaurantResponse,
} from "../../../interface";
import getServerRestaurantImageUrl from "@/utils/getServerRestaurantImageUrl";
import ReservationInformation from "@/components/ReservationInformation";

export default async function () {
  const session = await useServerSession();

  if (session == undefined) {
    redirect("/login");
  }

  const user = session.user;

  const reservationsResponse: ReservationsResponse = (await getReservations(
    session?.token,
  ).catch(() => {
    notFound();
  })) as ReservationsResponse;
  const reservations: (Reservation & {
    restaurant?: Restaurant;
  })[] = reservationsResponse.data;

  for (let reservation of reservations) {
    const restaurantResponse: RestaurantResponse = await getRestaurant(
      reservation.restaurantId,
    );
    const restaurant = restaurantResponse.data;
    reservation.restaurant = restaurant;
  }

  return (
    <div className="flex items-center justify-around text-black m-2">
      <div className="flex flex-col self-start h-fit items-center justify-center gap-3 p-2 rounded-2xl bg-white border-gray border-2 border-solid">
        <div className="flex col">
          <Typography>name : {user.username}</Typography>
        </div>
        <div className="flex-col">
          <Typography>email : {user.email}</Typography>
        </div>
        <div className="flex-col">
          <Typography>karma point : {user.karma}</Typography>
        </div>
        <div className="flex-col">
          <Typography>user point : {user.point}</Typography>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 flex-col">
        {reservations.map((reservation, index) => {
          return (
            <div
              key={reservation._id}
              className="flex h-fit items-center justify-center gap-3 p-2 rounded-2xl bg-white border-gray border-2 border-solid"
            >
              <Link
                href={getRestaurantUrl(reservation.restaurantId)}
                className="h-[30vw] md:h-[275px] aspect-square"
              >
                <RestaurantImage
                  alt={reservation.restaurant?.name || ""}
                  src={getServerRestaurantImageUrl(reservation.restaurantId)}
                  width={10}
                  height={10}
                  sizes="25vw"
                  // layout={'fill'}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </Link>

              <ReservationInformation
                session={session}
                reservation={reservation!}
              ></ReservationInformation>

              <div className="flex flex-col self-stretch justify-between">
                {!reservation.isConfirmed && (
                  <DeleteReservationButton
                    token={session.token}
                    reservationId={reservation._id!}
                  />
                )}
              </div>
            </div>
          );
        })}
        {user.role != "restaurantOwner" &&
          reservations.filter((reservation) => !reservation.isConfirmed)
            .length < 3 && (
            <Link
              href="/reservations/create"
              className="bg-white hover:bg-[lightblue] text-black hover:text-black p-2 rounded-2xl border-solid border-2 border-gray"
            >
              reserve now!
            </Link>
          )}
      </div>
    </div>
  );
}
