import useServerSession from "@/hooks/useServerSession";
import { RestaurantsResponse } from "../../interface";
import ClientRestaurantWithTag from "./ClientRestaurantWithTag";
import { Typography } from "@mui/material";

export default async function ({ tag }: { tag: string }) {
  const session = await useServerSession();
  function makeFirstCharUppercase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const restaurants: RestaurantsResponse = await fetch(
    process.env.BACKEND_URL + `/api/v1/restaurants/?tags[in]=${tag}`,
    {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    },
  ).then((response) => response.json());
  return (
    <div className="flex flex-col">
      <Typography variant="h3" className="m-2">
        {makeFirstCharUppercase(tag)} Restaurant
      </Typography>
      <ClientRestaurantWithTag
        tag={tag}
        restaurantsResponse={restaurants}
      ></ClientRestaurantWithTag>
    </div>
  );
}
