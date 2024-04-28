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
  InputLabel
} from "@mui/material";
import { useFormik } from "formik";
import { ChangeEvent, ChangeEventHandler, SyntheticEvent, useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { DeepPartial, Discount, Period, Reservation, Restaurant, Session } from "../../interface";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import useSession from "@/hooks/useSession";

export default function ({
  session,
  restaurantName,
  reservationPeriod
}: {
  session: Session,
  restaurantName: string | undefined,
  reservationPeriod: string | undefined
}) {
  console.log(reservationPeriod, parsePeriod(reservationPeriod));
  function parsePeriod(periodString: string | null | undefined): Period | undefined {
    if (periodString == undefined) {
      return undefined;
    }
    let [start, end] = periodString.split("-");
    return {
      start,
      end
    }
  }
  const router = useRouter();
  const [discountsList, setDiscountsList] = useState<Discount[][]>([]);
  const [restaurantsList, setRestaurantsList] = useState<string[]>([]);
  const [periodsList, setPeriodsList] = useState<Period[][]>([]);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const [roomList, setRoomList] = useState<string[]>([]);
  const [alertMessages, setAlertMessage] = useState<{
    title: string | null,
    description: string | null
  }>({
    title: null,
    description: null
  });
  const formik = useFormik<DeepPartial<Omit<Reservation, "reservationDate">> & {
    restaurantName: string,
    reservationDate?: Dayjs
  }>({
    initialValues: {
      restaurantName: restaurantName ?? "",
      reservationDate: undefined,
      discountIndex: undefined,
      reservationPeriod: parsePeriod(reservationPeriod),
      welcomeDrink: false,
      room: undefined
    },
    async onSubmit(_values) {
      let discount = discountsList[0][0]
      console.log(discount)
      let data = { ...formik.values, discount };
      const result = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(data)
      })
      const responseJson = await result.json();
      if (!result.ok || !responseJson.success) {
        setAlertMessage({
          title: "Error!",
          description: responseJson.message || "Wrong restaurant name"
        })
        setIsAlerting(true);
        return;
      }
      setAlertMessage({
        title: "Success!",
        description: "Successfully create reservation"
      })

      setIsAlerting(true);
      router.push("/reservations");
      router.refresh();
    }
  })

  async function onRestaurantNameChange(_e: SyntheticEvent<Element, Event>, value: string | null) {
    if (!value || value.trim() == "") {
      return
    }
    value = value.trim();
    const restaurantsResponse = await fetch(`/api/restaurants?name[regex]=${value}&select=name,discounts,reservationPeriods,rooms`)
      .then((res) => {
        return res.json()
      })
    const newRestaurantsList = restaurantsResponse.data.map((restaurant: Restaurant) => {
      return restaurant.name
    })
    setRestaurantsList(newRestaurantsList)

    const newDiscountsList = restaurantsResponse.data.map((restaurant: Restaurant) => {
      return restaurant.discounts
    })
    setDiscountsList(newDiscountsList);

    const newPeriodsList = restaurantsResponse.data.map(
      (restaurant: Restaurant) => {
        return restaurant.reservationPeriods
      }
    )
    setPeriodsList(newPeriodsList)

    const newRoomList = restaurantsResponse.data.map((restaurant: Restaurant) => {
      return restaurant.rooms;
    }).flat();
    setRoomList(newRoomList);
  }

  async function onDiscountChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    console.log(e.target);
    formik.setFieldValue("discountIndex", e.target.value);
    console.log(formik.values.discountIndex);
  }
  async function onRoomChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    console.log(e.target);
    formik.setFieldValue("room", e.target.value);
    console.log(formik.values.room);
  }

  return (
    <div className="h-full flex items-center justify-center m-2">
      <Dialog
        open={isAlerting}
        onClose={() => setIsAlerting(false)}
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
          <Button onClick={() => setIsAlerting(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2 w-2/3 sm:w-1/2 bg-white rounded-2xl p-2">
        <Autocomplete
          disablePortal
          sx={{
            width: "100%",
            alignSelf: "center"
          }}
          options={restaurantsList}
          filterOptions={(options, _state) => options}
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
          onChange={async (e, value) => {
            console.log("on change triggered")
            formik.setFieldValue("restaurantName", value)
          }}
          freeSolo
          autoSelect
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="reservation date"
            // value={formik.values.reservationDate ?? ""}
            onChange={(value) => {
              formik.setFieldValue("reservationDate", value)
            }}
          ></DatePicker>
        </LocalizationProvider>

        <TextField
          select
          value={JSON.stringify(formik.values.reservationPeriod)}
          onChange={(e) => {
            formik.setFieldValue("reservationPeriod", JSON.parse(e.target.value))
          }}
          label="Reservation Period"
        >
          {
            restaurantsList[0] == formik.values.restaurantName &&
            periodsList[0] !== undefined &&
            periodsList[0]
              .map((period, index) => {
                return (
                  <MenuItem
                    key={`${period.start}-${period.end}`}
                    value={JSON.stringify(period)}
                  >
                    <p>
                      {period.start} - {period.end}
                    </p>
                  </MenuItem>
                );
              })
          }
        </TextField>
        
        <TextField
          select
          onChange={onDiscountChange}
          value={formik.values.discountIndex ?? ""}
          label={"Discount"}
        >
          {
            restaurantsList.length === 1 &&
            discountsList[0] !== undefined &&
            discountsList[0].map((discount, index) => (
              <MenuItem key={index} value={index}>
                <p>{discount.name}</p>
                <p>{discount.points}</p>
              </MenuItem>
            ))
          }
        </TextField>

        <TextField
          select
          onChange={onRoomChange}
          value={formik.values.room}
          label="Room"
        >
          {
            roomList.map((room, index) => (
              <MenuItem key={index} value={room}>
                {room}
              </MenuItem>
            ))
          }
        </TextField>

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
