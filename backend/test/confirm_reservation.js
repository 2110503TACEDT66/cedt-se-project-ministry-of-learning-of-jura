module.exports = async function (env) {
  let response = await fetch(
    `${env.URL}/api/v1/reservations/${env.RESERVATION_ID}/confirm`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.TOKEN,
      },
    },
  ).then((res) => res.json());
  console.log(response);
};
