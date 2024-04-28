import relativeToAbsolute from "./relativeToAbsolute";

export default function getRestaurantImageData(restaurantId: string) {
    return relativeToAbsolute(`/api/v1/restaurants/${restaurantId}/image`);
}
