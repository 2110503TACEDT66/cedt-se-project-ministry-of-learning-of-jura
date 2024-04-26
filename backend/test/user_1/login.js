module.exports=async function(env){
    let response = await fetch(`${env.URL}/api/v1/auth/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email:"user@gmail.com",
            password:"12345678"
        })
    }).then((res)=>res.json())
    env.TOKEN = response.token;
    console.log(response)
}