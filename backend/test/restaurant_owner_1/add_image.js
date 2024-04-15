const fs = require("fs")
const path = require("path");
const FormData = require("form-data")
const fetch = require("node-fetch");
module.exports=async function(env){
    let formData = new FormData();
    formData.append("image",fs.createReadStream(path.join(__dirname,'../resource/steak.jpg')))
    // console.log(formData)
    let response = await fetch(`${env.URL}/api/v1/restaurants/${env.RESTAURANT_ID}/image`,{
        method:"POST",
        headers:{
            "Authorization":"Bearer "+env.TOKEN,
            // ...formData.getHeaders()
        },
        body:formData
    }).then((res)=>res.json())
    console.log(response)
}