"use server";
import { Discount, RestaurantResponse } from "@/../interface";
import EditRestaurantForm from "@/components/EditRestaurantForm";
import useServerSession from "@/hooks/useServerSession";
import getRestaurant from "@/utils/getRestaurant";

export default async function ({
  params,
}: {
  params: {
    restaurantId: string;
  };
}) {
  const session = await  useServerSession();
  let restaurantInformation: RestaurantResponse = await getRestaurant(
    params.restaurantId + "?time=" + new Date(),
    session?.token
  );
  console.log(restaurantInformation)
  restaurantInformation.data.discounts.forEach((discount) => {
    discount.canEdit = discount.isValid;
  });
  return (
    <EditRestaurantForm
      restaurantInformation={restaurantInformation}
      restaurantId={params.restaurantId}
    ></EditRestaurantForm>
  );
}
