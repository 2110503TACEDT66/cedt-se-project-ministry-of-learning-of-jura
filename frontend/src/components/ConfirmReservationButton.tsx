"use client"
import React, { useState } from "react";
import { Reservation } from "../../interface";
import useSession from "@/hooks/useSession";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ConfirmReservationButton({
  reservation
}: {
  reservation: Reservation
}) {
  const { session } = useSession();
  const [isOpen,setIsOpen] = useState(false);
  const [title,setTitle] = useState("");
  const [content,setContent] = useState("");
  const router = useRouter();
  const handleConfirmationClick = async () => {
    const response = await fetch(`/api/reservations/${reservation._id}/confirm`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session?.token}`
      }
    })
    const responseJson = await response.json();
    if (responseJson.success) {
      setTitle("Confirmed!")
      setContent("Click ok to refresh")
      setIsOpen(true);
      return; 
    }
    setTitle("Error Occured!")
    setContent("Click ok to refresh")
    setIsOpen(true)
  };

  async function onOkClick() {
    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <Dialog
        open={isOpen}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button onClick={onOkClick}>
            ok
          </Button>
        </DialogActions>
      </Dialog>
      <button
        className="bg-cyan-600 text-white border border-transparent font-light rounded hover:bg-slate-200 hover:text-cyan-600 hover:border-cyan-600 mt-1"
        onClick={handleConfirmationClick}
      >
        Confirm this reservation
      </button>
    </>
  );
}