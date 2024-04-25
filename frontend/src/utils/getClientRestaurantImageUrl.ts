export default function getRestaurantImageData(restaurantId: string) {
    let queryParams = new URLSearchParams()
    queryParams.append("time", (new Date()).getTime().toString());
    return `/api/restaurants/${restaurantId}/image/?${queryParams.toString()}`;
}
