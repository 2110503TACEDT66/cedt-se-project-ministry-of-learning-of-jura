"use client"
import getRestaurantImageData from "@/utils/getRestaurantImageData";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function(props:React.ComponentProps<typeof Image>){
    
    const [imgSrc, setImgSrc] = useState(props.src);
    const {src, ...rest} = props;

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const imageData = await getRestaurantImageData(imgSrc.toString());
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