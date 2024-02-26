"use client";

import { IRoom } from "@/backend/models/room";
import { calculateDaysOfStay } from "@/helpers/helpers";
import {
  useGetRoomBookedDatesQuery,
  useLazyCheckRoomAvailabilityQuery,
  useNewBookingMutation,
} from "@/redux/api/bookingApi";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  room: IRoom;
}

const BookingDatePicker = ({ room }: Props) => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [daysOfStay, setDaysOfStay] = useState(0);

  const [newBooking] = useNewBookingMutation();

  const [checkRoomAvailability, { data }] = useLazyCheckRoomAvailabilityQuery();

  const isAvailable = data?.isAvailable;

  const { data: { bookedDates: dates } = {} } = useGetRoomBookedDatesQuery({
    id: room._id,
  });

  const excludeDates = dates?.map((date: string) => new Date(date)) || [];

  const onChange = (dates: Date[]) => {
    const [checkInDate, checkOutDate] = dates;

    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate);

    if (checkInDate && checkOutDate) {
      const days = calculateDaysOfStay(checkInDate, checkOutDate);
      setDaysOfStay(days);
      checkRoomAvailability({
        id: room._id,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
      });
    }
  };

  const bookRoom = () => {
    const bookingData = {
      room: room._id,
      checkInDate,
      checkOutDate,
      daysOfStay,
      amountPaid: room.pricePerNight * daysOfStay,
      paymentInfo: {
        id: "STRIPE_ID",
        status: "PAID",
      },
    };
    newBooking(bookingData);
  };

  return (
    <div className="booking-card shadow p-4">
      <p className="price-per-night">
        <b>${room.pricePerNight}</b> / night
      </p>
      <hr />
      <p>Pick Check In & Check Out Date</p>
      <DatePicker
        className="w-100"
        selected={checkInDate}
        onChange={onChange}
        startDate={checkInDate}
        endDate={checkOutDate}
        minDate={new Date()}
        excludeDates={excludeDates}
        selectsRange
        inline
      />

      {isAvailable === true && (
        <div className="alert alert-success my-3">
          Room is available. Book now.
        </div>
      )}

      {isAvailable === false && (
        <div className="alert alert-danger my-3">
          Room is not available. Try different date.
        </div>
      )}

      <button className="form-btn py-2 w-100" onClick={bookRoom}>
        Pay
      </button>
    </div>
  );
};

export default BookingDatePicker;
