"use client";

export default function getRestaurantImageData(restaurantId: string) {
  return `/api/restaurants/${restaurantId}/image`;
}
