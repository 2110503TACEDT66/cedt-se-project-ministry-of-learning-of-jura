export default async function getRestaurantImageData(imgSrc: string) {
  try {
    const response = await fetch(imgSrc);

    if (!response.ok) {
      return "/img/pure_logo.jpg";
    }
    return response.url;
  } catch (error) {
    return "/img/pure_logo.jpg";
  }
}
