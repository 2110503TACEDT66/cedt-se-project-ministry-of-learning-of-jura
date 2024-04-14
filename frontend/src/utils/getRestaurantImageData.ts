export default async function getRestaurantImageData(restaurantId: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/${restaurantId}/image`
        );

        if (!response.ok) {
            return "/img/pure_logo.jpg";
        }
        return response.url;
    } catch (error) {
        return "/img/pure_logo.jpg";
    }
}

