module.exports=async function(env){
    const body = {
    }
    let response = await fetch(`${env.URL}/api/v1/reservations/${env.RESERVATION_ID}`,{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+env.TOKEN
        },
        body:JSON.stringify(body)
    }).then((res)=>res.json())
    console.log(response)
}