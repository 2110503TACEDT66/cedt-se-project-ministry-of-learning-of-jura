module.exports=async function(env){
    const body = {
        restaurantId: env.RESTAURANT_ID,
        reservationDate: Date.parse("2020-01-02"),
        welcomeDrink: false,
    }
    let response = await fetch(`${env.URL}/api/v1/reservations`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+env.TOKEN
        },
        body:JSON.stringify(body)
    }).then((res)=>res.json())
    console.log(response)
    env.RESERVATION_ID = response.data._id
}