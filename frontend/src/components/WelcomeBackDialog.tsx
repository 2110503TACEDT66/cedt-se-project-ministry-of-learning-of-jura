"use client";
import useSession from "@/hooks/useSession";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";

export default function WelcomeBackDialog() {
  const { session } = useSession();
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("Welcome Back!");
  const [description, setDescription] =
    useState(`We're thrilled to have you back! As a token of our appreciation for
  your return, we're offering you a special discount on your next
  purchase. Click the "Claim" button below to redeem your welcome-back
  offer.`);
  const [buttonText, setButtonText] = useState("Claim");

  async function ok() {
    setOpen(false);
  }

  async function handleClose() {
    setOpen(false);
    try {
      let result = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }).then((res) => res.json());
      if (result.success) {
        setTitle("Successfully Redeem");
        setDescription("");
        setButtonText("ok");
        setOpen(true);
        return;
      }
    } catch (e) {
      console.log(e);
    }
    setTitle("Cannot Redeem");
    setDescription("");
    setButtonText("ok");
    setOpen(true);
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="welcome-back-dialog-title"
      aria-describedby="welcome-back-dialog-description"
    >
      <DialogTitle id="welcome-back-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="welcome-back-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      {buttonText != "ok" ? (
        <DialogActions>
          <Button onClick={ok}>cancel</Button>
          <Button onClick={handleClose}>{buttonText}</Button>
        </DialogActions>
      ) : (
        <DialogActions>
          <Button onClick={ok}>ok</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
