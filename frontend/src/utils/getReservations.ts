"use server"
import { ReservationsResponse } from "../../interface"
import relativeToAbsolute from "./relativeToAbsolute"

export default async function getReservations(token?: string, restaurantId?: string): Promise<ReservationsResponse|null>{
    if(token==undefined){
        return null
    }
    if(restaurantId){
        return await fetch(relativeToAbsolute(`/api/v1/reservations?restaurantId=${restaurantId}`),{
            headers:{
                Authorization:`Bearer ${token}`
            },
            cache:"no-cache"
        }).then(res=>res.json())
    }
    return await fetch(relativeToAbsolute("/api/v1/reservations"),{
        headers:{
            Authorization:`Bearer ${token}`
        },
        cache:"no-cache"
    }).then(res=>res.json())
}