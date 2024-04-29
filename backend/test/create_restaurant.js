module.exports = async function (env) {
  const body = {
    name: "som ting wong",
    address: "ถนนไก่",
    menus: [
      {
        name: "something nasty",
        price: 56164,
      },
    ],
    openingHours: "08:00",
    closingHours: "12:00",
    reserverCapacity: 40,
    reservationPeriods: [
      {
        start: "12:00",
        end: "13:00",
      },
    ],
    discounts: [
      {
        name: "ลดโหด",
        description: "ลดโหด naja",
        isValid: true,
        points: 100,
      },
    ],
    tags: "japanese",
  };
  let response = await fetch(`${env.URL}/api/v1/restaurants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + env.TOKEN,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
  console.log(response);
  env.RESTAURANT_ID = response.data._id;
};
