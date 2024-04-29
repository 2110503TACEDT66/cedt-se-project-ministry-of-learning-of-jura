module.exports = async function (env) {
  const body = {
    // restaurantId:env.RESTAURANT_ID,
    restaurantName: "som ting wong",
    reservationDate: new Date(
      new Date().setDate(new Date().getDate() - 1),
    ).toISOString(),
    reservationPeriod: {
      start: "11:00",
      end: "12:00",
    },
    // discountIndex:0,
    welcomeDrink: true,
  };
  let response = await fetch(`${env.URL}/api/v1/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + env.TOKEN,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
  console.log(response);
  env.RESERVATION_ID = response.data._id;
};
