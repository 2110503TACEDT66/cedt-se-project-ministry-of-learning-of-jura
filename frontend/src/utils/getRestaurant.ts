"use server";
import { RestaurantResponse } from "../../interface";
import relativeToAbsolute from "./relativeToAbsolute";

export default async function getRestaurant(
  restaurantId: string,
  token?: string
): Promise<RestaurantResponse> {
  return await fetch(
    relativeToAbsolute(`/api/v1/restaurants/${restaurantId}`),
    {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
  ).then((res) => res.json());
}
