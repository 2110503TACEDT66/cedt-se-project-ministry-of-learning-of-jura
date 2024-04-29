module.exports = async function (env) {
  const body = {
    // "name":"เจ๊ไก่",
    // "address":"ถนน bing chilling ซอย 4",
    // "menus":[{
    //     name: "something nasty",
    //     price: 56164
    // }],
    // "openingHours":"08:00",
    // "closingHours":"12:00",
    // "reserverCapacity":40,
    // "reservationPeriods":[
    //     {
    //         "start":"12:00",
    //         "end":"13:00"
    //     }
    // ],
    discounts: {
      // "0":{
      //     "name":"โดนแก้",
      //     "description":"ลดโหด naja",
      //     "isValid":false,
      //     "points": 100
      // },
      2: {
        name: "อันใหม่",
        description: "ลดโหด naja",
        isValid: false,
        points: 100,
      },
    },
    // "tags":"thai"
  };
  let response = await fetch(
    `${env.URL}/api/v1/restaurants/${env.RESTAURANT_ID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + env.TOKEN,
      },
      body: JSON.stringify(body),
    },
  ).then((res) => res.json());
  console.log(JSON.stringify(response, null, 2));
};
