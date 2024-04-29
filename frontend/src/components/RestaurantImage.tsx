"use client";
import getClientRestaurantImageUrl from "@/utils/getClientRestaurantImageUrl";
import getRestaurantImageData from "@/utils/getRestaurantImageData";
import getRestaurantImageUrl from "@/utils/getRestaurantImageUrl";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props extends Omit<React.ComponentProps<typeof Image>, "src"> {
  restaurantId?: string;
  src?: string;
  onLoad?: () => void;
}

export default function ({ restaurantId, src, ...rest }: Props) {
  if (restaurantId == undefined && src == undefined) {
    throw new Error("restaurantId or src must be specified");
  }
  const initialImage = src ?? getClientRestaurantImageUrl(restaurantId!);
  // console.log("initialImage",initialImage)
  const [imgSrc, setImgSrc] = useState<string>(initialImage);

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={(e) => {
        e.stopPropagation();
        setImgSrc(`/img/pure_logo.jpg`);
      }}
      priority={true}
    ></Image>
  );
}
