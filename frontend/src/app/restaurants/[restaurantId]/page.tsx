"use server";
import { Reservation, ReservationsResponse, Restaurant, RestaurantResponse } from "@/../interface";
import { notFound } from "next/navigation";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import getRestaurant from "@/utils/getRestaurant";
import RestaurantImage from "@/components/RestaurantImage";
import { Menu } from "@/../interface";
import getRestaurantImageData from "@/utils/getRestaurantImageData";
import getRestaurantImageUrl from "@/utils/getRestaurantImageUrl";
import Link from "next/link";
import getReservations from "@/utils/getReservations";
import useServerSession from "@/hooks/useServerSession";

export default async function ({
  params,
}: {
  params: {
    restaurantId: string;
    reservationId: string;
  };
}) {
  const session = await useServerSession();
  const restaurantResponse: RestaurantResponse = await getRestaurant(
    params.restaurantId
  )
    .then((res) => {
      if (!res.ok) {
        notFound();
      }
      return res;
    })
    .then((res) => res.json());
  console.log(restaurantResponse);

  const restaurant: Restaurant = restaurantResponse.data;
  
  let reservations : Reservation[];
  if (session) {
    const reservationsResponse: ReservationsResponse = await getReservations(
      session?.token,
      restaurant._id
    )
      .then((res) => {
        if (!res?.ok) {
          notFound();
        }
        return res;
      })
      .then((res) => res!.json());
    console.log(reservationsResponse);
    reservations = reservationsResponse.data.filter(
        (reservation) => reservation.restaurantId === restaurant._id
    );
  } else {
    reservations = [];
  }


  return (
    <main className="w-full h-full flex items-center justify-center">
      <div className="bg-white text-black flex flex-row border-solid border-gray-400 border-2 p-2 rounded-2xl">
        <div>
          <RestaurantImage
            alt={restaurant.name}
            src={getRestaurantImageUrl(params.restaurantId)}
            width={400}
            height={400}
            sizes={"100vw"}
            className={`rounded-2xl aspect-square object-cover`}
          ></RestaurantImage>
        </div>
        <div className="self-center m-2 flex flex-col gap-2">
          <Typography variant="h2" className="font-bold">
            {restaurant.name}
          </Typography>
          <Typography variant="h5" className="font-semibold">
            Address
          </Typography>
          <Typography variant="h6" className="ml-3">
            {restaurant.address}
          </Typography>
          <Typography variant="h5" className="font-semibold">
            Open Hours
          </Typography>
          <Typography variant="h6" className="ml-3">
            {restaurant.openingHours}-{restaurant.closingHours}
          </Typography>
          <Typography variant="h5" className="font-semibold">
            Menus
          </Typography>
          <List>
            {restaurant.menus.map((menu: Menu, index: number) => (
              <ListItem
                key={index}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItemText primary={menu.name} />
                <ListItemText
                  primary={`${menu.price.toString().padStart(6, " ")} baht.`}
                  style={{ textAlign: "right" }}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h5"  className="font-semibold">Available Reservation Periods</Typography>
          {restaurant.reservationPeriods ? (
            <List>
              {
              restaurant.reservationPeriods.map(({ start, end }, index) => {
                const periodString = `${start}-${end}`;
                const searchParams = new URLSearchParams({
                  restaurantName: restaurant.name,
                  reservationPeriod: periodString,
                });
                return (
                  <ListItemButton
                    key={index}
                    component="a"
                    href={`/reservations/create?${searchParams.toString()}`}
                  >
                    <ListItemText key={index} primary={periodString} />
                  </ListItemButton>
                );
              })
              }
            </List>
          ) : null}{" "}

          <Typography variant="h5"  className="font-semibold">All Reservations</Typography>
          {reservations.map(reservation => (
              <List>
                <div>ID: {reservation._id}</div>
                <div>Reservation Date: {new Date(reservation.reservationDate).toLocaleDateString("en-UK")}</div>
                <div>Welcome Drink: {reservation.welcomedrink ? "Yes" : "No"}</div>
              </List>
          ))}
        </div>
      </div>
    </main>
  );
}
