"use server"
import relativeToAbsolute from "./relativeToAbsolute"

export default async function getReservations(token?: string, restaurantId?: string): Promise<Response|null>{
    if(token==undefined){
        return null
    }
    if(restaurantId){
        return await fetch(relativeToAbsolute(`/api/v1/reservations?restaurantId=${restaurantId}`),{
            headers:{
                Authorization:`Bearer ${token}`
            },
            cache:"no-cache"
        })
    }
    return await fetch(relativeToAbsolute("/api/v1/reservations"),{
        headers:{
            Authorization:`Bearer ${token}`
        },
        cache:"no-cache"
    })
}