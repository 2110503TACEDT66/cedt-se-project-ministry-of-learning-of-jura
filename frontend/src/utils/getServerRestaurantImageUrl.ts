"use server"

import relativeToAbsolute from "./relativeToAbsolute";

export default async function getRestaurantImageData(restaurantId: string) {
    return relativeToAbsolute(`/api/v1/restaurants/${restaurantId}/image`);
}
