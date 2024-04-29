export default async function (token: string, reservationId: string) {
  return await fetch(`/api/reservations/${reservationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
