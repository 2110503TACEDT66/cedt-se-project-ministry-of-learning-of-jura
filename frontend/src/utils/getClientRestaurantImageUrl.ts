"use client";
export default function getRestaurantImageData(restaurantId: string) {
  const origin = typeof window !== 'undefined' ? (window.location.origin) : "http://localhost:3000";
  let queryParams = new URLSearchParams();
  queryParams.append("time", new Date().getTime().toString());
  return `${origin}/api/restaurants/${restaurantId}/image/?${queryParams.toString()}`;
}
