/* eslint-disable import/no-anonymous-default-export */
"use client";
import {
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useFormik } from "formik";
import { SyntheticEvent, useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { DeepPartial, Discount, Period, Reservation, Restaurant } from "../../interface";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import useSession from "@/hooks/useSession";

export default function ({ token }: { token: string }) {
  function parsePeriod(periodString: string|null|undefined): Period|undefined{
    if(periodString==undefined){
      return undefined;
    }
    let [start,end] = periodString.split("-");
    return {
      start,
      end
    }
  }
  const { session } = useSession();
  const searchParams = useSearchParams();
  const [restaurantsList, setRestaurantsList] = useState<string[]>([]);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [alertMessages, setAlertMessage] = useState<{
    title: string | null;
    description: string | null;
  }>({
    title: null,
    description: null,
  });
  const router = useRouter();
  const [discountsList, setDiscountsList] = useState<Discount[][]>([]);
  const formik = useFormik<DeepPartial<Omit<Reservation,"reservationDate">> & {
    restaurantName: string,
    reservationDate?: Dayjs
  }>({
    initialValues: {
      restaurantName: searchParams.get("restaurantName") || "",
      reservationDate: undefined,
      discountIndex: undefined,
      reservationPeriod: parsePeriod(searchParams.get("reservationPeriod")) || undefined,
      welcomeDrink: false,
    },
    async onSubmit(values) {
      console.log(values);
      let data = values;
      const result = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const responseJson = await result.json();
      if (!result.ok || !responseJson.success) {
        setAlertMessage({
          title: "Error!",
          description: responseJson.message || "Wrong restaurant name",
        });
        setIsAlerting(true);
        return;
      }
      setAlertMessage({
        title: "Success!",
        description: "Successfully create reservation",
      });

      setIsAlerting(true);
      router.push("/reservations");
      router.refresh();
    },
  });

  async function onRestaurantNameChange(
    _e: SyntheticEvent<Element, Event>,
    value: string | null
  ) {
    if (!value || value.trim() == "") {
      return;
    }
    value = value.trim();
    const restaurantsResponse = await fetch(
      `/api/restaurants?name[regex]=${value}&select=name,discounts`
    ).then((res) => {
      return res.json();
    });
    const newRestaurantsList = restaurantsResponse.data.map(
      (restaurant: Restaurant) => {
        return restaurant.name;
      }
    );
    setRestaurantsList(newRestaurantsList);
    const newDiscountsList = restaurantsResponse.data.map(
      (restaurant: Restaurant) => {
        return restaurant.discounts;
      }
    );
    setDiscountsList(newDiscountsList);
  }

  async function onDiscountChange(e: SelectChangeEvent<unknown>) {
    formik.setFieldValue("discountIndex", e.target.value);
  }

  useEffect(() => {
    console.log(discountsList);
  }, [discountsList]);

  return (
    <div className="h-full flex items-center justify-center m-2">
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
        className="flex flex-col gap-2 w-2/3 sm:w-1/2 bg-white rounded-2xl p-2"
      >
        <Autocomplete
          disablePortal
          sx={{
            width: "100%",
            alignSelf: "center",
          }}
          options={restaurantsList}
          filterOptions={(options, _state) => options}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Restaurant Name"
              InputProps={{
                ...params.InputProps,
              }}
            />
          )}
          value={formik.values.restaurantName}
          onInputChange={onRestaurantNameChange}
          onChange={async (e, value) => {
            console.log("on change triggered");
            formik.setFieldValue("restaurantName", value);
          }}
          freeSolo
          autoSelect
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="reservation date"
            value={formik.values.reservationDate}
            onChange={(value) => {
              formik.setFieldValue("reservationDate", value);
            }}
          ></DatePicker>
        </LocalizationProvider>
        <Select onChange={onDiscountChange} value={formik.values.discountIndex}>
          {restaurantsList[0] == formik.values.restaurantName &&
            discountsList[0] !== undefined &&
            discountsList[0]
              .filter((discount) => discount.isValid)
              .map((discount, index) => {
                const isDisabled = session!.user.point < discount.points;
                return (
                  <MenuItem
                    key={discount._id}
                    value={index}
                    disabled={isDisabled}
                    style={{ color: isDisabled ? "gray" : "inherit" }}
                  >
                    <p>
                      {discount.name} - {discount.points}
                    </p>
                  </MenuItem>
                );
              })}
        </Select>

        <FormControlLabel
          control={
            // <>
            <input
              // checked={welcomedrink}
              checked={formik.values.welcomeDrink}
              id="checked-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) =>
                formik.setFieldValue("welcomeDrink", e.target.checked)
              }
            />
          }
          className="m-0"
          label={
            <label
              htmlFor="checked-checkbox"
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-900"
            >
              Welcome Drink
            </label>
          }
        />
        <Button type="submit" disabled={formik.isSubmitting}>
          reserve now!
        </Button>
      </form>
    </div>
  );
}
