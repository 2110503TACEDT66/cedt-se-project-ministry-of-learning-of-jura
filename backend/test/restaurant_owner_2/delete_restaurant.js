module.exports=async function(env){
    const body = {
        "name":"เจ๊ไก่ naja 3",
        "address":"ถนน bing chilling ซอย 4 3",
        "menu":["ชานมข้าวผัดชีส","พิซซ่าใส่"],
        "openingHours":"08:00",
        "closingHours":"12:00",
        "reservationPeriods":[
            {
                "start":"12:00",
                "end":"13:00"
            }
        ],
        "discounts":[{
            "name":"ลดโหด",
            "points": 100
        }],
        "tags":"japanese"
    }
    let response = await fetch(`${env.URL}/api/v1/restaurants/${env.RESTAURANT_ID}`,{
        method:"DELETE",
        headers:{
            "Authorization":"Bearer "+env.TOKEN
        }
    }).then((res)=>res.json())
    console.log(response)
}