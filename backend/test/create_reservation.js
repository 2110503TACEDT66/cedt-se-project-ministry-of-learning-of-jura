module.exports=async function(env){
    const body = {
        restaurantId:env.RESTAURANT_ID,
        reservationDate: new Date(),
        reservationPeriod: {
            start: "10:00",
            end: "12:00"
        },
        welcomeDrink: true
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
}