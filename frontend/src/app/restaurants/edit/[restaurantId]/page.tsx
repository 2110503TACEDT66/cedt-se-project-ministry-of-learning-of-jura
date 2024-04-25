import { useFormik } from "formik"
import { DeepPartial, Discount, Menu, RestaurantResponse, Restaurant, Period } from "@/../interface"
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
import TimePeriodTextField from "@/components/TimePeriodTextField";
import DiscountTextField from "@/components/DiscountTextField";
import EditRestaurantForm from "@/components/EditRestaurantForm"
import getRestaurant from "@/utils/getRestaurant"


export default async function ({
  params
}: {
  params: {
    restaurantId: string
  }
}) {
  let initialValues = await getRestaurant(params.restaurantId);
  return (
    <EditRestaurantForm
      initialValues={initialValues}
      restaurantId={params.restaurantId}
    >

    </EditRestaurantForm>
  )
}
