export default async function getRestaurantImageData(restaurantId: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/${restaurantId}/image`
        );

        if (!response.ok) {
            return "/img/pure_logo.jpg";
        }

        const imageData = await response.arrayBuffer();
        const base64ImageData = Buffer.from(imageData).toString("base64");

        return `data:image;base64,${base64ImageData}`;
    } catch (error) {
        return "/img/pure_logo.jpg";
    }
}


