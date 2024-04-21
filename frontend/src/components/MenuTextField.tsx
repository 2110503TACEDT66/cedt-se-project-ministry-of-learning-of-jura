import { TextField } from "@mui/material";
import { ResizableMultiInputEvent } from "../../interface";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup"

export default function({
    label,
    onChange,
    helperText
}:{
    onChange: (event:ResizableMultiInputEvent)=>void,
    label: string,
    helperText?: any
}){
    const invalidNameMessage = "name can't be left empty"
    const invalidPriceMessage = "price is invalid"
    const ValidationSchema=yup.object().shape({
        name:yup.string().required(invalidNameMessage),
        price: yup.number().min(0).required(invalidPriceMessage).typeError(invalidPriceMessage)
    })
    const formik = useFormik<{
        name: string|undefined,
        price: string|undefined
    }>({
        initialValues: {
            name: "",
            price: ""
        },
        validationSchema:ValidationSchema,
        async onSubmit(){
            throw new Error("this form is not intended to be submitted!")
        }
    })
    useEffect(()=>{
        let {name,price: priceStr} = formik.values;
        if(name=="" || priceStr=="" || priceStr==undefined){
            return;
        }
        const price=parseFloat(priceStr);
        onChange({
            currentTarget:{
                value: {
                    name,
                    price
                }
            }
        })
    },[formik.values])

    return (
        <div className="w-full flex flex-row gap-2 justify-center">
            <TextField
                id="name"
                label="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.name)}
                className="grow"
                helperText={formik.errors.name}
            ></TextField>
            <p
                className="self-center"
            >-</p>
            <TextField
                id="price"
                label="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.price)}
                className="grow"
                helperText={formik.errors.price||""}
            ></TextField>
        </div>
    )
}