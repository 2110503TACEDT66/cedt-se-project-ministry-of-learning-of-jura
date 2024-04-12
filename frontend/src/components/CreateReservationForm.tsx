"use client"
import { TextField, Button, Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useFormik } from "formik";
import { SyntheticEvent, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { Restaurant } from "../../interface";
import { useSearchParams } from "next/navigation";

export default function({
    token
}:{
    token: string
}){
    const searchParams = useSearchParams();
    const [restaurantsList,setRestaurantsList] = useState<string[]>([]);
    const [isAlerting,setIsAlerting] = useState<boolean>(false);
    const [alertMessages,setAlertMessage] = useState<{
        title:string|null,
        description: string|null
    }>({
        title:null,
        description:null
    });
    
    const formik = useFormik({
        initialValues:{
            restaurantName: searchParams.get("restaurantName")||"",
            reservationDate: null as (Dayjs|null),
        },
        async onSubmit(values,{setSubmitting, setErrors}){
            let data = formik.values
            const result = await fetch("/api/reservations",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
            const responseJson = await result.json();
            if(!result.ok||!responseJson.success){
                setAlertMessage({
                    title:"Error!",
                    description:responseJson.message||"Wrong restaurant name"
                })
                setIsAlerting(true);
                return
            }
            setAlertMessage({
                title:"Success!",
                description:"Successfully create reservation"
            })
            setIsAlerting(true);
        }
    })

    async function onRestaurantNameChange(_e:SyntheticEvent<Element, Event>, value: string|null){
        if(!value || value.trim()==""){
            return
        }
        value = value.trim();
        const restaurantsResponse = await fetch(`/api/restaurants?name[regex]=${value}&select=name`)
        .then((res)=>{
            return res.json()
        })
        const newRestaurantsList = restaurantsResponse.data.map((restaurant: Restaurant)=>{
            return restaurant.name
        })
        setRestaurantsList(newRestaurantsList)
    }

    return (
        <div className="h-full flex items-center justify-center m-2">
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
            <form  onSubmit={formik.handleSubmit} className="flex flex-col gap-2 w-2/3 sm:w-1/2 bg-white rounded-2xl p-2">
                <Autocomplete
                    disablePortal
                    sx={{
                        width:"100%",
                        alignSelf:"center"
                    }}
                    options={restaurantsList}
                    filterOptions={(options, state) => options}
                    // sx={{ width: 300 }}
                    renderInput={(params) => <TextField 
                        {...params} 
                        label="Restaurant Name" 
                        InputProps={{
                            ...params.InputProps,
                            // type: 'search',
                        }}
                    />}
                    value={formik.values.restaurantName}
                    onInputChange={onRestaurantNameChange}
                    onChange={async (e,value)=>{
                        console.log("on change triggered")
                        formik.setFieldValue("restaurantName",value)
                    }}
                    freeSolo
                    autoSelect
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="reservation date"
                        value={formik.values.reservationDate}
                        onChange={(value)=>{
                            formik.setFieldValue("reservationDate",value)
                        }}
                    ></DatePicker>
                </LocalizationProvider>
                <Button 
                    type="submit"
                    disabled={formik.isSubmitting}
                >
                    reserve now!
                </Button>
            </form>
        </div>
    )
}