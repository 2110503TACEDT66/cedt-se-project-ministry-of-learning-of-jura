module.exports=async function(env){
    let response = await fetch(`${env.URL}/api/v1/redeem`,{
        method: "POST",
        headers:{
            Authorization: `Bearer ${env.TOKEN}`
        }
    })
    .then(res=>res.json());
    console.log(response)
}