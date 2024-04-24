import DeleteReservationButton from "@/components/DeleteReservationButton";
import RestaurantImage from "@/components/RestaurantImage";
import useServerSession from "@/hooks/useServerSession";
import getReservations from "@/utils/getReservations";
import getRestaurant from "@/utils/getRestaurant";
import getRestaurantUrl from "@/utils/getRestaurantUrl";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import getMe from "@/utils/getMe";
import { Typography } from "@mui/material";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ReservationsResponse,
  RestaurantResponse,
  User,
} from "../../../interface";

export default async function () {
  const session = await useServerSession();
  if (session == undefined) {
    redirect("/login");
  }
  const userResponse: User = await getMe(session?.token).then(
    (res: Response | null) => {
      if (res == null || !res.ok) {
        notFound();
      }
      return res.json();
    }
  );
  const reservationsResponse: ReservationsResponse = await getReservations(
    session?.token
  ).then((res: Response | null) => {
    if (res == null || !res.ok) {
      notFound();
    }
    return res.json();
  });
  const reservations = reservationsResponse.data;
  for (let reservation of reservations) {
    const restaurantResponse: RestaurantResponse = await getRestaurant(
      reservation.restaurantId
    ).then((res) => {
      return res.json();
    });
    const restaurant = restaurantResponse.data;
    reservation.restaurant = restaurant;
  }
  const isRestaurantOwner = session.user.role == "restaurantOwner";
  return (
    <div className="flex items-center justify-around text-black m-2">
      <div className="flex flex-col self-start h-fit items-center justify-center gap-3 p-2 rounded-2xl bg-white border-gray border-2 border-solid">
        <div className="flex col">
          <Typography>name : {userResponse.username}</Typography>
        </div>
        <div className="flex-col">
          <Typography>email : {userResponse.email}</Typography>
        </div>
        <div className="flex-col">
          <Typography>karma point : {userResponse.karma}</Typography>
        </div>
        <div className="flex-col">
          <Typography>user point : {userResponse.point}</Typography>
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
                  src={"/img/pure_logo.jpg"}
                  width={10}
                  height={10}
                  sizes="25vw"
                  // layout={'fill'}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </Link>
              <div className="">
                <Typography>
                  Restaurant: {reservation.restaurant?.name}
                </Typography>
                <Typography>
                  Reservation Date:{" "}
                  {new Date(
                    Date.parse(reservation.reservationDate)
                  ).toLocaleDateString("en-UK")}
                </Typography>
                <Typography>
                  Welcome Drink:{reservation.welcomedrink ? " Yes" : " No"}
                </Typography>
                {isRestaurantOwner && (
                  <Typography>
                    By:{" "}
                    {reservation.reservorId == session.user._id
                      ? "you"
                      : reservation.reservorId}
                  </Typography>
                )}
              </div>
              <div className="flex flex-col self-stretch justify-between">
                <Link href={`/reservations/edit/${reservation._id}`}>
                  <ModeEditIcon></ModeEditIcon>
                </Link>
                <DeleteReservationButton
                  token={session.token}
                  reservationId={reservation._id!}
                />
              </div>
            </div>
          );
        })}
        {reservations.length < 3 && (
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
