import { Typography } from "@mui/material"
import { Reservation, Restaurant, Session } from "../../interface"
import ConfirmReservationButton from "./ConfirmReservationButton";

interface PopulatedReservation extends Reservation{
  restaurant?: Restaurant
}

export default function ({
  session,
  reservation,
  className
}:{
  session: Session,
  reservation: PopulatedReservation,
  className?: string
}) {
  const isRestaurantOwner = session.user.role == "restaurantOwner";
  return (
  <div className={className ?? ""}>
    <Typography>
      Id: {reservation._id}
    </Typography>
    <Typography>
      Restaurant: {reservation.restaurant?.name}
    </Typography>
    <Typography>
      Reservation Date:{" "}
      {new Date(
        Date.parse(reservation.reservationDate)
      ).toLocaleDateString("en-UK")}
    </Typography>
    <Typography>
      Welcome Drink:{reservation.welcomeDrink ? " Yes" : " No"}
    </Typography>
    <Typography>
      By:{" "}
      {reservation.reservorId == session.user._id
        ? "you"
        : reservation.reservorId}
    </Typography>
    {
      <Typography>
        room: {reservation.room ?? "no room"}
      </Typography>
    }
    {
      reservation.isConfirmed ? (
        <Typography>confirmed</Typography>
      ) : (
        isRestaurantOwner && (
          <ConfirmReservationButton reservation={reservation} />
        )
      )
    }
  </div>
  )
}