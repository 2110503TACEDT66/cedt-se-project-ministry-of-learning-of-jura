"use server"

import { Restaurant, RestaurantResponse } from "@/../interface"
import { notFound } from "next/navigation"
import { List, ListItem, ListItemButton,ListItemText, Typography  } from "@mui/material"
import getRestaurant from "@/utils/getRestaurant"
import RestaurantImage from "@/components/RestaurantImage"
import {Menu} from "@/../interface"
import getRestaurantImageData from "@/utils/getRestaurantImageData"

export default async function({
    params
}:{
    params:{
        restaurantId: string
    }
}){
    const restaurantResponse: RestaurantResponse = await getRestaurant(params.restaurantId)
    .then((res)=>{
        if(!res.ok){
            notFound()
        }
        return res
    })
    .then((res)=>res.json())
    console.log(restaurantResponse)

    const restaurant: Restaurant = restaurantResponse.data;

    return (
        <main className="w-full h-full flex items-center justify-center">
            <div className="bg-white text-black flex flex-row border-solid border-gray-400 border-2 p-2 rounded-2xl">
                <div>
                    <RestaurantImage
                        alt={restaurant.name}
                        src={getRestaurantImageData(params.restaurantId)}
                        width={400}
                        height={400}
                        sizes={"100vw"}
                        className={`rounded-2xl aspect-square object-cover`}
                    ></RestaurantImage>
                </div>
                <div className="self-center m-2 flex flex-col gap-2">
                    <Typography variant="h2"  className="font-bold">{restaurant.name}</Typography>

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
          </div>
        </div>
      </main>
    );
}