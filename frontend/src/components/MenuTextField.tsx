import { TextField } from "@mui/material";
import { DeepPartial, Menu, ResizableMultiInputEvent } from "../../interface";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup"

export default function({
    label,
    onChange,
    helperText,
    value
}:{
    onChange: (event:ResizableMultiInputEvent)=>void,
    label: string,
    helperText?: any,
    value: DeepPartial<Menu>|undefined
}){
    console.log("init value menu ",value)
    const invalidNameMessage = "name can't be left empty"
    const invalidPriceMessage = "price is invalid"
    const ValidationSchema=yup.object().shape({
        name:yup.string().required(invalidNameMessage),
        price: yup.number().min(0).required(invalidPriceMessage).typeError(invalidPriceMessage)
    })
    const formik = useFormik<DeepPartial<Menu>>({
        initialValues: value || {
            name: "",
            price: 0
        },
        validationSchema:ValidationSchema,
        async onSubmit(){
            throw new Error("this form is not intended to be submitted!")
        }
    })
    useEffect(()=>{
        let {name,price} = formik.values;
        if(name=="" || price==0){
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