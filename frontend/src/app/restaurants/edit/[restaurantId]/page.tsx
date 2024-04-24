"use client";
import { useFormik } from "formik";
import { Discount, Restaurant } from "@/../interface";
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
import { ChangeEvent, useState } from "react";
import { IconButton } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import TimePeriodTextField from "@/components/TimePeriodTextField";
import DiscountTextField from "@/components/DiscountTextField";

export default function ({
  params,
}: {
  params: {
    restaurantId: string;
  };
}) {
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [alertMessages, setAlertMessage] = useState<{
    title: string | null;
    description: string | null;
  }>({
    title: null,
    description: null,
  });
  const router = useRouter();

  const invalidHourMessage = "invalid hour time";
  const invalidMenuMessage = "menu name can't be empty!";
  const invalidTagsMessage = "tag name can't be empty!";
  const invalidAddressMessage = "address can't be empty!";
  const invalidNameMessage = "restaurant name can't be empty!";
  const invalidCapacityMessage = "capacity must be number!";
  const ValidationSchema = yup.object().shape({
    name: yup.string(),
    address: yup.string(),
    menus: yup.array().of(yup.string()),
    openingHours: yup.string().matches(hourRegex, invalidHourMessage),
    closingHours: yup.string().matches(hourRegex, invalidHourMessage),
    reservationPeriods: yup.array().of(
      yup.object().shape({
        start: yup.string().matches(hourRegex, invalidHourMessage),
        end: yup.string().matches(hourRegex, invalidHourMessage),
      })
    ),
    reserverCapacity: yup.number(),
    tags: yup.array().of(yup.string()),
  });

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
      `/api/restaurants/${params.restaurantId}/image`,
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
      `/api/restaurants/${params.restaurantId}/image`,
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

  const formik = useFormik<
    Omit<Restaurant, "reservation" | "_id" | "menus" | "reserverCapacity"> & {
      reserverCapacity: string;
      menus: string[];
    }
  >({
    initialValues: {
      name: "",
      address: "",
      menus: [""],
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
      reserverCapacity: "",
      tags: [],
    },
    validationSchema: ValidationSchema,
    async onSubmit(values) {
      let data: any = { ...values };
      data.discounts = data.discounts.map(
        (discount: Discount, index: number) => {
          return {
            [index]: { ...discount },
          };
        }
      );
      const response = await fetch(`/api/restaurants/${params.restaurantId}`, {
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
        <p className="self-center">Create Restaurant!</p>
        <TextField
          id="name"
          name="name"
          label="Restaurant Name"
          value={formik.values.name}
          onChange={formik.handleChange}
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

        <ResizableMultiInput
          value={formik.values.menus}
          label="menu"
          onChange={(newValue) => {
            formik.setFieldValue("menus", newValue);
          }}
          helperTexts={formik.errors.menus as string[] | undefined}
        />
        <ResizableMultiInput
          value={formik.values.discounts}
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

        <ResizableMultiInput
          InnerProps={TimePeriodTextField}
          value={formik.values.reservationPeriods}
          label="Reservation Periods"
          onChange={(newValue) => {
            console.log(newValue);
            formik.setFieldValue("reservationPeriods", newValue);
          }}
          helperTexts={formik.errors.discounts as string[] | undefined}
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
          value={formik.values.tags}
          label="tags"
          onChange={(newValue) => {
            console.log(newValue);
            formik.setFieldValue("tags", newValue);
          }}
          helperTexts={formik.errors.tags as string[] | undefined}
        />

        <Button type="submit" disabled={isSubmitting}>
          edit restaurant
        </Button>
      </form>
    </div>
  );
}
