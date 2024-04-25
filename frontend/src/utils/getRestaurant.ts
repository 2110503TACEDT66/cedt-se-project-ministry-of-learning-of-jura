"use server"
import relativeToAbsolute from "./relativeToAbsolute";

export default async function getRestaurant(restaurantId:string){
    return await fetch(relativeToAbsolute(`/api/v1/restaurants/${restaurantId}`),{
        cache:"no-cache"
    }).then((res)=>res.json())
}