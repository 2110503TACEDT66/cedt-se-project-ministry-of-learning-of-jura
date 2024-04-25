"use server"
import { RestaurantResponse } from "../../interface";
import relativeToAbsolute from "./relativeToAbsolute";

export default async function getRestaurant(restaurantId:string): Promise<RestaurantResponse>{
    return await fetch(relativeToAbsolute(`/api/v1/restaurants/${restaurantId}`),{
        cache:"no-cache"
    }).then((res)=>res.json())
}