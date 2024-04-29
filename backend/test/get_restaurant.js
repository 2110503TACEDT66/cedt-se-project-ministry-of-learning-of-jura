module.exports = async function (env) {
  let response = await fetch(
    `${env.URL}/api/v1/restaurants/${env.RESTAURANT_ID}`,
    {
      method: "GET",
    },
  ).then((res) => res.json());

  console.log(response);
};
