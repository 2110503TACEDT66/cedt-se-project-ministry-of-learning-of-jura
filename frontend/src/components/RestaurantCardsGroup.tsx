"use client"
import { Restaurant } from "../../interface"
import RestaurantCard from "./RestaurantCard"

export default function({
    index,
    restaurants,
    tag,
    currentIndex
}:{
    index: number,
    restaurants?: Restaurant[]|undefined,
    tag: string,
    currentIndex: number
}){
    return (
        <div className="flex justify-evenly align-center md:gap-1 sm:gap-0">
            {
                restaurants?.map((restaurant)=>{
                    return (
                        <RestaurantCard key={restaurant._id} restaurant={restaurant}></RestaurantCard>
                    )
                })
            }
        </div>
    )
}