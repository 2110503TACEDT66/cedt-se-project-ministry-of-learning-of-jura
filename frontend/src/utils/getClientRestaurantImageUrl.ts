"use client"
export default function getRestaurantImageData(restaurantId: string) {
    let queryParams = new URLSearchParams()
    queryParams.append("time", (new Date()).getTime().toString());
    return `http://localhost:3000/api/restaurants/${restaurantId}/image/?${queryParams.toString()}`;

    // return relativeToAbsolute(`/api/v1/restaurants/${restaurantId}/image`);
}
