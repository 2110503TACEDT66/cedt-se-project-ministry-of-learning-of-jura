"use client"
import getClientRestaurantImageUrl from "@/utils/getClientRestaurantImageUrl";
import getRestaurantImageData from "@/utils/getRestaurantImageData";
import getRestaurantImageUrl from "@/utils/getRestaurantImageUrl";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props extends Omit<React.ComponentProps<typeof Image>,"src">{
    restaurantId: string,
    onLoad: ()=>void
}

export default function({
    restaurantId,
    ...rest
}:Props){
    const initialImage = getClientRestaurantImageUrl(restaurantId);
    const [imgSrc, setImgSrc] = useState<string>(initialImage);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const imageData = await getRestaurantImageData(imgSrc);
                setImgSrc(imageData);
            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };
        fetchImage();
    }, []);

    return (
        <Image
            {...rest}
            src={imgSrc}
            onError={() => {
                setImgSrc(`/img/pure_logo.jpg`);
            }}
        ></Image>
    )
}