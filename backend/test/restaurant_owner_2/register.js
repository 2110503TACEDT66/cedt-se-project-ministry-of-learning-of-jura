module.exports = async function (env) {
  let response = await fetch(`${env.URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "restaurantOwner@gmail.com",
      password: "12345678",
      role: "restaurantOwner",
      username: "restaurantOwner",
    }),
  }).then((res) => res.json());
  env.TOKEN = response.token;
  console.log(response);
};
