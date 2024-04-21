"use client"
import { useFormik } from "formik"
import { Menu, Restaurant } from "@/../interface"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import ResizableMultiInput from "@/components/ResizableMultiInput"
import * as yup from "yup"
import hourRegex from "@/constants/hourRegex"
import useSession from "@/hooks/useSession"
import { useState } from "react"
import MenuTextField from "@/components/MenuTextField"

export default function(){
    const {session} = useSession();
    const [isSubmitting,setIsSubmitting] = useState(false);
    const [isAlerting,setIsAlerting] = useState<boolean>(false);
    const [alertMessages,setAlertMessage] = useState<{
        title:string|null,
        description: string|null
    }>({
        title:null,
        description:null
    });
    
    const invalidHourMessage = "invalid hour time"
    const invalidMenuMessage = "menu name can't be empty!"
    const invalidTagsMessage = "tag name can't be empty!"
    const invalidAddressMessage = "address can't be empty!"
    const invalidNameMessage = "restaurant name can't be empty!"
    const ValidationSchema=yup.object().shape({
        name:yup.string().required(invalidNameMessage),
        address:yup.string().required(invalidAddressMessage),
        menu:yup.array().of(
            yup.string().required(invalidMenuMessage)
        ),
        openingHours: yup.string().matches(hourRegex,invalidHourMessage),
        closingHours: yup.string().matches(hourRegex,invalidHourMessage),
        tags:yup.array().of(
            yup.string().required(invalidTagsMessage)
        ),
    })

    const formik = useFormik<Omit<Restaurant,"id">>({
        initialValues:{
            name: "",
            address: "",
            menu: [] as Menu[],
            openingHours: "",
            closingHours: "",
            tags: [] as string[]
        },
        validationSchema:ValidationSchema,
        async onSubmit(values){
            const response = await fetch("/api/restaurants/",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${session?.token}`
                },
                body: JSON.stringify(values)
            })
            const responseJson = await response.json();
            if(!responseJson.success){
                setIsAlerting(true);
                setAlertMessage({
                    title:"Error",
                    description:"Restaurant might be duplicated, and we don't allow it"
                })
                return
            }
            setIsAlerting(true)
            setAlertMessage({
                title:"Success!",
                description:"Successfully create a restaurant"
            })
            setIsSubmitting(false);
        }
    })

    return (
        <div>
            <Dialog
                open={isAlerting}
                onClose={()=>setIsAlerting(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {alertMessages.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    {alertMessages.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>setIsAlerting(false)}>Ok</Button>
                </DialogActions>
            </Dialog>
            <form onSubmit={formik.handleSubmit} className="text-black bg-white p-2 flex flex-col gap-2">
                <p className="self-center">Create Restaurant!</p>
                <TextField
                    id="name"
                    name="name"
                    label="Restaurant Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={formik.errors.name&&String(formik.errors.name)}
                    error={Boolean(formik.errors.name)}
                ></TextField>
                
                <TextField
                    id="address"
                    name="address"
                    label="Restaurant Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={formik.errors.address&&String(formik.errors.address)}
                    error={Boolean(formik.errors.address)}
                ></TextField>

                <ResizableMultiInput
                    label="menu"
                    InnerProps={MenuTextField}
                    onChange={(newValue)=>{console.log(newValue);formik.setFieldValue("menu",newValue)}}
                    helperTexts={formik.errors.menu as string[]|undefined}
                />

                <TextField
                    id="openingHours"
                    name="openingHours"
                    label="Opening Hours"
                    value={formik.values.openingHours}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={formik.errors.openingHours&&String(formik.errors.openingHours)}
                    error={Boolean(formik.errors.openingHours)}
                ></TextField>
                
                <TextField
                    id="closingHours"
                    name="closingHours"
                    label="Closing Hours"
                    value={formik.values.closingHours}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={formik.errors.closingHours&&String(formik.errors.closingHours)}
                    error={Boolean(formik.errors.closingHours)}
                ></TextField>

                <ResizableMultiInput
                    label="tags"
                    onChange={(newValue)=>{console.log(newValue);formik.setFieldValue("tags",newValue)}}
                    helperTexts={formik.errors.tags as string[]|undefined}
                />
                <Button 
                    type="submit"
                    disabled={isSubmitting}
                >
                    create restaurant
                </Button>
            </form>
        </div>
    )
}