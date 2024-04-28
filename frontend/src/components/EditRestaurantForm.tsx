"use client"
import { useFormik } from "formik"
import { DeepPartial, Discount, Menu, RestaurantResponse, Restaurant, Period, DiscountWithEdit } from "@/../interface"
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


export default function ({
  restaurantInformation,
  restaurantId
}: {
  restaurantInformation: RestaurantResponse,
  restaurantId: string
}) {
  // console.log("restaurantInformation.data.discounts",restaurantInformation.data.discounts)
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [alertMessages, setAlertMessage] = useState<{
    title: string | null,
    description: string | null
  }>({
    title: null,
    description: null
  });
  const router = useRouter();

  const invalidHourMessage = "invalid hour time"
  const invalidMenuMessage = "menu name can't be empty!"
  const invalidTagsMessage = "tag name can't be empty!"
  const invalidAddressMessage = "address can't be empty!"
  const invalidNameMessage = "restaurant name can't be empty!"
  const invalidCapacityMessage = "capacity must be number!";
  const ValidationSchema = yup.object().shape({
    name: yup.string().required(invalidNameMessage),
    address: yup.string().required(invalidAddressMessage),
    menus: yup.array().of(
      yup.object().shape({
        name: yup.string().required(invalidMenuMessage),
        price: yup.number().required(invalidMenuMessage).typeError(invalidMenuMessage)
      })
    ),
    openingHours: yup.string().matches(hourRegex, invalidHourMessage),
    closingHours: yup.string().matches(hourRegex, invalidHourMessage),
    reservationPeriods: yup.array().of(
      yup.object().shape({
        start: yup.string().matches(hourRegex, invalidHourMessage),
        end: yup.string().matches(hourRegex, invalidHourMessage),
      })
    ),
    reserverCapacity: yup.number().required(invalidCapacityMessage).typeError(invalidCapacityMessage),
    tags: yup.array().of(
      yup.string().required(invalidTagsMessage)
    )
  })

  const iconSx = {
    stroke: "white",
    strokeWidth: 1,
  };

  async function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files == undefined) {
      return;
    }
    let formData = new FormData();
    formData.append("image", e.currentTarget.files[0]);
    const response = await fetch(
      `/api/restaurants/${restaurantId}/image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
        body: formData,
      }
    );
    const responseJson = await response.json();
    if (responseJson.success) {
      window.location.reload();
    }
  }

  async function deleteImage(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const response = await fetch(
      `/api/restaurants/${restaurantId}/image`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    const responseJson = await response.json();
    if (responseJson.success) {
      router.refresh();
    }
  }

  let initialValues: any = {};

  let restaurant: Restaurant & Record<string, any> = restaurantInformation.data;
  for (let field in restaurant) {
    // console.log("field " , field , restaurant[field])
    initialValues[field] = restaurant[field];
  }

  const formik = useFormik<DeepPartial<Omit<Restaurant, "tags">> & { tags: string[] }>({
    initialValues: initialValues,
    validationSchema: ValidationSchema,
    async onSubmit(values) {
      const { discounts, ...rest } = values;
      let data: any = rest;
      data.discounts = discounts?.reduce<any>((prev: Partial<Discount> | undefined, cur: Partial<Discount> | undefined, index) => {
        return {
          [index]: cur,
          ...prev
        }
      }, {})
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      });
      const responseJson = await response.json();
      console.log(responseJson);
      if (!responseJson.success) {
        setIsAlerting(true);
        setAlertMessage({
          title: "Error",
          description: "Restaurant might be duplicated, and we don't allow it",
        });
        return;
      }
      setIsAlerting(true);
      setAlertMessage({
        title: "Success!",
        description: "Successfully edit a restaurant",
      });
      setIsSubmitting(false);
    },
  });

  // useEffect(() => {
  //   console.log("values", formik.values)
  //   console.log("errors", formik.errors)
  // }, [formik.values])

  return (
    <div>
      <Dialog
        open={isAlerting}
        onClose={() => setIsAlerting(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{alertMessages.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {alertMessages.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAlerting(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-2 flex flex-col gap-2 text-black"
      >
        <p className="self-center">Edit Restaurant!</p>
        <TextField
          id="name"
          name="name"
          label="Restaurant Name"
          value={formik.values.name || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.errors.name && String(formik.errors.name)}
          error={Boolean(formik.errors.name)}
        ></TextField>

        <TextField
          id="address"
          name="address"
          label="Restaurant Address"
          value={formik.values.address || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.errors.address && String(formik.errors.address)}
          error={Boolean(formik.errors.address)}
        ></TextField>

        <div className="right-0 top-0">
          Delete Image Picture:
          <IconButton
            className="text-black right-0 bottom-0"
            onClick={deleteImage}
          >
            <Delete sx={iconSx}></Delete>
          </IconButton>
        </div>

        <div className="right-0 top-0">
          Upload Image Picture:
          <IconButton
            className="text-black"
            sx={{
              text: "black",
            }}
            component="label"
          >
            <FileUploadIcon sx={iconSx}></FileUploadIcon>
            <input type="file" onChange={uploadImage} hidden />
          </IconButton>
        </div>

        <ResizableMultiInput<DeepPartial<Menu>>
          values={formik.values.menus!}
          InnerProps={MenuTextField}
          label="menu"
          onChange={(newValue) => {
            console.log("triggered: menus", newValue)
            formik.setFieldValue("menus", structuredClone(newValue));
          }}
          helperTexts={formik.errors.menus as string[] | undefined}
        />
        <ResizableMultiInput<DeepPartial<DiscountWithEdit>>
          values={formik.values.discounts!}
          InnerProps={DiscountTextField}
          label="discount"
          onChange={(newValue) => {
            formik.setFieldValue("discounts", structuredClone(newValue));
          }}
          helperTexts={formik.errors.discounts as string[] | undefined}
        />

        <TextField
          id="openingHours"
          name="openingHours"
          label="Opening Hours"
          value={formik.values.openingHours || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={
            formik.errors.openingHours && String(formik.errors.openingHours)
          }
          error={Boolean(formik.errors.openingHours)}
        ></TextField>

        <TextField
          id="closingHours"
          name="closingHours"
          label="Closing Hours"
          value={formik.values.closingHours || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={
            formik.errors.closingHours && String(formik.errors.closingHours)
          }
          error={Boolean(formik.errors.closingHours)}
        ></TextField>

        <ResizableMultiInput<DeepPartial<Period>>
          InnerProps={TimePeriodTextField}
          values={formik.values.reservationPeriods!}
          label="Reservation Periods"
          onChange={(newValue) => {
            // console.log(newValue);
            formik.setFieldValue("reservationPeriods", structuredClone(newValue));
          }}
          helperTexts={formik.errors.discounts as string[] | undefined}
        />
        <TextField
          id="reserverCapacity"
          name="reserverCapacity"
          label="Restaurant Capacity"
          value={formik.values.reserverCapacity || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={
            formik.errors.reserverCapacity &&
            String(formik.errors.reserverCapacity)
          }
          error={Boolean(formik.errors.reserverCapacity)}
        ></TextField>

        <ResizableMultiInput<string>
          label="tags"
          values={formik.values.tags!}
          onChange={async (newValue) => {
            // console.log("tags newValue", newValue)
            let result = await formik.setFieldValue("tags", structuredClone(newValue));
          }}
          helperTexts={formik.errors.tags as string[] | undefined}
        />

        <ResizableMultiInput
          values={formik.values.rooms!}
          label="private rooms"
          onChange={(newValue) => { formik.setFieldValue("rooms", newValue) }}
          helperTexts={formik.errors.tags as string[] | undefined}
        />

        <Button type="submit" disabled={isSubmitting}>
          edit restaurant
        </Button>
      </form>
    </div>
  );
}
