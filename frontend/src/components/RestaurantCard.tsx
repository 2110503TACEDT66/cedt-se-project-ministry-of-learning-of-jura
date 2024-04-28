"use client"
import Image from "next/image"
import Link from "next/link"
import { Restaurant } from "../../interface"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useSession from "@/hooks/useSession"
import { Delete, Edit } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useRouter } from "next/navigation"
import getRestaurantImageData from "@/utils/getRestaurantImageData"
import RestaurantImage from "./RestaurantImage"
import getRestaurantImageUrl from "@/utils/getRestaurantImageUrl"
// import { useRouter } from "next/navigation"

export default function({
    restaurant,
    className
}:{
    restaurant:Restaurant
    className?: string
}){
    const [imageLoaded,setImageLoaded] = useState(false);
    const {session} = useSession();
    const isRestaurantOwner = session?.user.role=="restaurantOwner";
    
    const router = useRouter();

    async function deleteRestaurant(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        const response = await fetch(`/api/restaurants/${restaurant._id}`,{
            method:"DELETE",
            headers:{
                "Authorization":`Bearer ${session?.token}`
            }
        })
        const responseJson = await response.json();
        if(responseJson.success){
            router.refresh()
        }
    }

    const iconSx = {
        stroke: "white",
        strokeWidth: 1
    };


    return (
        <div
            className={`${
                className || ""
            } ${
                imageLoaded? "" : `overflow-hidden h-[280px]`
            } relative md:w-[250px] sm:w-1/3 rounded-2xl p-2 border-solid border-2 border-grey text-black bg-white`}
        >
            <Link href={`/restaurants/${restaurant._id}`} className="relative w-full block">
                {
                (
                    <div className={`w-full absolute ${
                        imageLoaded? "opacity-0":"opacity-1"
                    }`}>
                        <div className="w-full rounded-2xl overflow-hidden aspect-square">
                            <Skeleton className="w-full rounded-2xl aspect-square"></Skeleton>
                        </div>
                        <Skeleton className="w-full h-5"></Skeleton>
                        <Skeleton className="w-full h-5"></Skeleton>
                    </div>
                )} 
                <RestaurantImage
                    alt={restaurant.name}
                    restaurantId={restaurant._id}
                    width={250}
                    height={250}
                    sizes={"100vw"}
                    className={`rounded-2xl aspect-square object-cover`}
                    onLoad={() => {
                        setTimeout(()=>{
                            setImageLoaded(true);
                        },10)
                    }}
                ></RestaurantImage>
                <p className={`text-center ${imageLoaded ? "" : "hidden"}`}>
                    {restaurant.name}
                </p>
                <p
                    className={`bg-gray-300 rounded-2xl relative bottom-0 w-fit p-1 px-2 ${
                        imageLoaded ? "" : "hidden"
                    }`}
                >
                    {restaurant.openingHours}-{restaurant.closingHours}
                </p>
            </Link>
            {
                isRestaurantOwner &&
                <div>
                    <Link
                        href={`/restaurants/edit/${restaurant._id}`}
                        className="absolute right-0 top-0"
                    >
                        <IconButton className="text-black">
                            <Edit sx={iconSx}></Edit>
                        </IconButton>
                    </Link>
                    <IconButton
                        className="text-black absolute right-0 bottom-0"
                        onClick={deleteRestaurant}
                    >
                        <Delete sx={iconSx}></Delete>
                    </IconButton>
                </div>
            }
        </div>
    );
}