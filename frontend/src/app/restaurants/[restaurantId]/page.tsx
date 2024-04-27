"use server";

import { Restaurant, RestaurantResponse } from "@/../interface";
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
import getRestaurantImageUrl from "@/utils/getRestaurantImageUrl";
import getServerRestaurantImageUrl from "@/utils/getServerRestaurantImageUrl";
export default async function ({
  params,
}: {
  params: {
    restaurantId: string;
  };
}) {
  const restaurantResponse: RestaurantResponse = await getRestaurant(params.restaurantId)
  .catch(()=>{
    notFound();
  })

  const restaurant: Restaurant = restaurantResponse.data;

  return (
    <main className=" flex  justify-center">
      <div className="bg-white text-black flex flex-row border-solid border-gray-400 border-2 p-2 rounded-2xl">
        <div>
          <RestaurantImage
            alt={restaurant.name}
            src={await getServerRestaurantImageUrl(params.restaurantId)}
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
          <Typography variant="h5" className="font-semibold">
            Available Reservation Periods
          </Typography>
          {restaurant.reservationPeriods && (
            <List>
              {restaurant.reservationPeriods.map(({ start, end }, index) => {
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
              })}
            </List>
          )}
          <Typography variant="h5" className="font-semibold">
            Discount List
          </Typography>
          {restaurant.discounts ? (
            <List>
              {restaurant.discounts.map(
                ({ name, description, points,isValid }, index) => {
                  return (
                    <div key={index} className="flex flex-row items-start">
                      <p>{index+1}.</p>
                      <ListItem className="flex flex-col items-start pt-0 pl-0 pr-0">
                        <ListItemText primary={"name: "+name} className="ml-2"></ListItemText>
                        <ListItemText primary={"description: "+description}  className="ml-2"></ListItemText>
                        <ListItemText primary={"points: "+points}  className="ml-2"></ListItemText>
                        <ListItemText primary={"can be used: "+(isValid? "yes":"no")}  className="ml-2"></ListItemText>
                      </ListItem>
                    </div>
                  );
                }
              )}
            </List>
          ) : null}{" "}
        </div>
      </div>
    </main>
  );
}
