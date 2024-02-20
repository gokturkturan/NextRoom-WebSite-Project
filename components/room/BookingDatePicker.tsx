import { IRoom } from "@/backend/models/room";
import React from "react";

interface Props {
  room: IRoom;
}

const BookingDatePicker = ({ room }: Props) => {
  return (
    <div className="booking-card shadow p-4">
      <p className="price-per-night">
        <b>${room.pricePerNight}</b> / night
      </p>
      <hr />
      <p className="mt-5 mb-3">Pick Check In & Check Out Date</p>
    </div>
  );
};

export default BookingDatePicker;
