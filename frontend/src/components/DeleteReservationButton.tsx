"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Dispatch, SetStateAction, useState } from "react";
import deleteReservation from "@/utils/deleteReservation";
import { useRouter } from "next/navigation";
import { Reservation } from "../../interface";

export default function ({
  token,
  reservationId,
  // setReservations
}: {
  token: string;
  reservationId: string;
  // setReservations: Dispatch<SetStateAction<Reservation[]>>
}) {
  const [isAlerting, setIsAlerting] = useState<boolean>(false);
  const router = useRouter();
  async function onDeleteButtonClick() {
    setIsAlerting(false);
    const response = await deleteReservation(token, reservationId);
    // setReservations()
    router.refresh();
  }
  return (
    <>
      <Dialog
        open={isAlerting}
        onClose={() => setIsAlerting(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Reservation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this reservation? This cannot be
            undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDeleteButtonClick}>Delete</Button>
          <Button onClick={() => setIsAlerting(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <button onClick={() => setIsAlerting(true)}>
        <DeleteIcon></DeleteIcon>
      </button>
    </>
  );
}
