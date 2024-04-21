"use client"
import { useFormik } from "formik"
import { Menu, Restaurant, RestaurantResponse } from "@/../interface"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import ResizableMultiInput from "@/components/ResizableMultiInput"
import * as yup from "yup"
import hourRegex from "@/constants/hourRegex"
import useSession from "@/hooks/useSession"
import { ChangeEvent, useEffect, useState } from "react"
import { IconButton } from "@mui/material"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import { Delete } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import MenuTextField from "@/components/MenuTextField"

export default function({
    params
}:{
    params:{
        restaurantId:string
    }
}){
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
    const router = useRouter();
    
    const invalidHourMessage = "invalid hour time"
    const invalidMenuMessage = "menu name can't be empty!"
    const invalidTagsMessage = "tag name can't be empty!"
    const invalidAddressMessage = "address can't be empty!"
    const invalidNameMessage = "restaurant name can't be empty!"
    const ValidationSchema=yup.object().shape({
        name:yup.string().required(invalidNameMessage),
        address:yup.string().required(invalidAddressMessage),
        menus:yup.array().of(
            yup.object().shape({
                name: yup.string().required(invalidMenuMessage),
                price: yup.number().required(invalidMenuMessage)
            })
        ),
        openingHours: yup.string().matches(hourRegex,invalidHourMessage),
        closingHours: yup.string().matches(hourRegex,invalidHourMessage),
        tags:yup.array().of(
            yup.string().required(invalidTagsMessage)
        )
    })

    const iconSx = {
        stroke: "white",
        strokeWidth: 1
    };

    async function uploadImage(e: ChangeEvent<HTMLInputElement>){
        if(e.currentTarget.files==undefined){
            return;
        }
        let formData = new FormData();
        formData.append("image",e.currentTarget.files[0])
        const response = await fetch(`/api/restaurants/${params.restaurantId}/image`,{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${session?.token}`          
            },
            body: formData
        })
        const responseJson = await response.json();
        if(responseJson.success){
            window.location.reload();
        }
    }

    async function deleteImage(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        const response = await fetch(`/api/restaurants/${params.restaurantId}/image`,{
            method:"DELETE",
            headers:{
                "Authorization":`Bearer ${session?.token}`
            }
        })
        const responseJson = await response.json();
        if(responseJson.success){
            router.refresh()
        }
    }

    const formik = useFormik<Omit<Restaurant,"id">>({
        initialValues:{
            name: "",
            address: "",
            menus: [] as Menu[],
            openingHours: "",
            closingHours: "",
            tags: [] as string[]
        },
        validationSchema:ValidationSchema,
        async onSubmit(values){
            const response = await fetch(`/api/restaurants/${params.restaurantId}`,{
                method:"PUT",
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
                description:"Successfully edit a restaurant"
            })
            setIsSubmitting(false);
        }
    })

    useEffect(()=>{
        async function onStart(){
            let restaurantResponse: RestaurantResponse = await fetch(`/api/restaurants/${params.restaurantId}`)
            .then(res=>res.json())
            let restaurant: Restaurant = restaurantResponse.data;
            for(let field in restaurant){
                console.log("field "+field)
                formik.setFieldValue(field,restaurant[field]);
            }
        }
        onStart();
    },[])

    useEffect(()=>{
        console.log(formik.errors)
    },[formik.values])

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
            <form onSubmit={formik.handleSubmit} className="bg-white p-2 flex flex-col gap-2 text-black">
                <p className="self-center">Edit Restaurant</p>
                <TextField
                    id="name"
                    name="name"
                    label="Restaurant Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={String(formik.errors.name)}
                    error={Boolean(formik.errors.name)}
                >
                </TextField>
                
                <TextField
                    id="address"
                    name="address"
                    label="Restaurant Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={String(formik.errors.address)}
                    error={Boolean(formik.errors.address)}
                ></TextField>
 
                <div className="right-0 top-0">
                    Delete Image Picture:
                    <IconButton
                        className="text-black right-0 bottom-0"
                        onClick={deleteImage}
                    >
                        <Delete 
                        sx={iconSx}
                        ></Delete>
                    </IconButton>
                </div>
 
                <div className="right-0 top-0">
                    Upload Image Picture:
                    <IconButton 
                        className="text-black"
                        sx={{
                            text:"black"
                        }}
                        component="label"
                    >
                        <FileUploadIcon
                            sx={iconSx}
                        >
                        </FileUploadIcon>
                        <input
                            type="file"
                            onChange={uploadImage}
                            hidden
                        />
                    </IconButton>
                </div>

                <ResizableMultiInput
                    label="menu"
                    values={formik.values.menus}
                    InnerProps={MenuTextField}
                    onChange={(newValue)=>{console.log("newValue "+newValue);formik.setFieldValue("menus",newValue)}}
                    helperTexts={formik.errors.menu as string[]|undefined}
                />

                <TextField
                    id="openingHours"
                    name="openingHours"
                    label="Opening Hours"
                    value={formik.values.openingHours}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={String(formik.errors.openingHours)}
                    error={Boolean(formik.errors.openingHours)}
                ></TextField>
                
                <TextField
                    id="closingHours"
                    name="closingHours"
                    label="Closing Hours"
                    value={formik.values.closingHours}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={String(formik.errors.closingHours)}
                    error={Boolean(formik.errors.closingHours)}
                ></TextField>

                <ResizableMultiInput
                    label="tags"
                    values={formik.values.tags}
                    onChange={(newValue)=>{console.log(newValue);formik.setFieldValue("tags",newValue)}}
                    helperTexts={formik.errors.tags as string[]|undefined}
                />

                <Button 
                    type="submit"
                    disabled={isSubmitting}
                >
                    edit restaurant
                </Button>
            </form>
        </div>
    )
}