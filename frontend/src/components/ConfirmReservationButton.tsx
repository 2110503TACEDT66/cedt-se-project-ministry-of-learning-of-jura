"use client"
import React from "react";
import { Reservation } from "../../interface";
import useSession from "@/hooks/useSession";

export default function ConfirmReservationButton({
  reservation
}: {
  reservation: Reservation
}) {
  const { session } = useSession();
  const handleConfirmationClick = async () => {
    const response = await fetch(`/api/reservations/${reservation._id}/confirm`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${session?.token}`
      }
    })
    const responseJson = await response.json();
    if (responseJson.success) {
      //
    }

    console.log(responseJson);
  };

  return (
    <button
      className="bg-cyan-600 text-white border border-transparent font-light rounded hover:bg-slate-200 hover:text-cyan-600 hover:border-cyan-600 mt-1"
      onClick={handleConfirmationClick}
    >
      Confirm this reservation
    </button>
  );
}