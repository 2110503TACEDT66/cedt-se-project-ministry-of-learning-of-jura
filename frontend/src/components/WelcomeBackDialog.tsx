"use client";
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
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="welcome-back-dialog-title"
      aria-describedby="welcome-back-dialog-description"
    >
      <DialogTitle id="welcome-back-dialog-title">Welcome Back!</DialogTitle>
      <DialogContent>
        <DialogContentText id="welcome-back-dialog-description">
          We're thrilled to have you back! As a token of our appreciation for
          your return, we're offering you a special discount on your next
          purchase. Click the "Claim" button below to redeem your welcome-back
          offer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Claim</Button>
      </DialogActions>
    </Dialog>
  );
}
