import { TextField } from "@mui/material";
import { ResizableMultiInputEvent } from "../../interface";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

export default function({
    label,
    onChange,
    helperText
}:{
    onChange: (event:ResizableMultiInputEvent)=>void,
    label: string,
    helperText?: any
}){
    let [name,setName] = useState<string|undefined>(undefined);
    let [price,setPrice] = useState<number|undefined>(undefined);
    useEffect(()=>{
        console.log(name,price)
        if(name==undefined || price==undefined){
            return;
        }
        onChange({
            currentTarget:{
                value: {
                    name,
                    price
                }
            }
        })
    },[name,price])
    return (
        <div className="w-full flex flex-row gap-2 justify-center items-center">
            <TextField
                label="name"
                value={name}
                onChange={(e)=>{
                    setName(e.currentTarget.value);
                }}
                className="grow"
            ></TextField>
            <p
            >-</p>
            <TextField
                label="price"
                value={price}
                onChange={(e)=>{
                    setPrice(parseInt(e.currentTarget.value)||undefined);
                }}
                className="grow"
            ></TextField>
        </div>
    )
}