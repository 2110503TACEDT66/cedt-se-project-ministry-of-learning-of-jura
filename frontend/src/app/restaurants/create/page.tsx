"use client";
import { useFormik } from "formik";
import { Menu, Period, Restaurant } from "@/../interface";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import ResizableMultiInput from "@/components/ResizableMultiInput";
import * as yup from "yup";
import hourRegex from "@/constants/hourRegex";
import useSession from "@/hooks/useSession";
import { useEffect, useState } from "react";
import MenuTextField from "@/components/MenuTextField";
import TimePeriodTextField from "@/components/TimePeriodTextField";
import DiscountTextField from "@/components/DiscountTextField";
import { redirect } from "next/navigation";
export default function () {
  const { session } = useSession();
  console.log(session);
  if (
    session?.user?.role == undefined ||
    session?.user?.role != "restaurantOwner"
  ) {
    redirect("/");
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [alertMessages, setAlertMessage] = useState<{
    title: string | null;
    description: string | null;
  }>({
    title: null,
    description: null,
  });

  const invalidHourMessage = "invalid hour time";
  const invalidMenuMessage = "menu name can't be empty!";
  const invalidTagsMessage = "tag name can't be empty!";
  const invalidAddressMessage = "address can't be empty!";
  const invalidNameMessage = "restaurant name can't be empty!";
  const invalidCapacityMessage = "capacity must be number!";
  const ValidationSchema = yup.object().shape({
    name: yup.string().required(invalidNameMessage),
    address: yup.string().required(invalidAddressMessage),
    menus: yup.array().of(
      yup.object().shape({
        name: yup.string().required(invalidMenuMessage),
        price: yup.number().required(invalidMenuMessage),
      }),
    ),
    openingHours: yup.string().matches(hourRegex, invalidHourMessage),
    closingHours: yup.string().matches(hourRegex, invalidHourMessage),
    reservationPeriods: yup.array().of(
      yup.object().shape({
        start: yup.string().matches(hourRegex, invalidHourMessage),
        end: yup.string().matches(hourRegex, invalidHourMessage),
      }),
    ),
    reserverCapacity: yup.number().required(invalidCapacityMessage),
    tags: yup.array().of(yup.string().required(invalidTagsMessage)),
  });

  const formik = useFormik<Omit<Restaurant, "_id" | "reservation">>({
    initialValues: {
      name: "",
      address: "",
      menus: [
        {
          name: "",
          price: 0,
        },
      ],
      discounts: [
        {
          name: "",
          description: "",
          points: 0,
          isValid: true,
        },
      ],
      openingHours: "",
      closingHours: "",
      reservationPeriods: [
        {
          start: "",
          end: "",
        },
      ],
      reserverCapacity: 0,
      tags: [""],
      rooms: [""],
    },
    validationSchema: ValidationSchema,
    async onSubmit(values) {
      const response = await fetch("/api/restaurants/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(values),
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
        description: "Successfully create a restaurant",
      });
      setIsSubmitting(false);
    },
  });
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
        className="text-black bg-white p-2 flex flex-col gap-2"
      >
        <p className="self-center">Create Restaurant!</p>
        <TextField
          id="name"
          name="name"
          label="Restaurant Name"
          value={formik.values.name}
          onChange={(e) => {
            console.log(formik.errors);
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          helperText={formik.errors.name && String(formik.errors.name)}
          error={Boolean(formik.errors.name)}
        ></TextField>

        <TextField
          id="address"
          name="address"
          label="Restaurant Address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.errors.address && String(formik.errors.address)}
          error={Boolean(formik.errors.address)}
        ></TextField>

        <ResizableMultiInput
          label="menu"
          values={formik.values.menus}
          InnerProps={MenuTextField}
          onChange={(newValue) => {
            formik.setFieldValue("menus", newValue);
          }}
          helperTexts={formik.errors.menus as string[] | undefined}
        />
        <ResizableMultiInput
          values={formik.values.discounts}
          InnerProps={DiscountTextField}
          label="discount"
          onChange={(newValue) => {
            formik.setFieldValue("discounts", newValue);
          }}
          helperTexts={formik.errors.discounts as string[] | undefined}
        />
        <TextField
          id="openingHours"
          name="openingHours"
          label="Opening Hours"
          value={formik.values.openingHours}
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
          value={formik.values.closingHours}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={
            formik.errors.closingHours && String(formik.errors.closingHours)
          }
          error={Boolean(formik.errors.closingHours)}
        ></TextField>

        <ResizableMultiInput<Period>
          InnerProps={TimePeriodTextField}
          values={formik.values.reservationPeriods}
          label="Reservation Periods"
          onChange={(newValue) => {
            formik.setFieldValue("reservationPeriods", newValue);
          }}
          helperTexts={formik.errors.reservationPeriods as string[] | undefined}
        />
        <TextField
          id="reserverCapacity"
          name="reserverCapacity"
          label="Restaurant Capacity"
          value={formik.values.reserverCapacity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={
            formik.errors.reserverCapacity &&
            String(formik.errors.reserverCapacity)
          }
          error={Boolean(formik.errors.reserverCapacity)}
        ></TextField>
        <ResizableMultiInput
          values={formik.values.tags}
          label="tags"
          onChange={(newValue) => {
            formik.setFieldValue("tags", newValue);
          }}
          helperTexts={formik.errors.tags as string[] | undefined}
        />
        <ResizableMultiInput
          values={formik.values.rooms!}
          label="private rooms"
          onChange={(newValue) => {
            formik.setFieldValue("rooms", newValue);
          }}
          helperTexts={formik.errors.tags as string[] | undefined}
        />
        <Button type="submit" disabled={isSubmitting}>
          create restaurant
        </Button>
      </form>
    </div>
  );
}
