import { NextRequest, NextResponse } from "next/server";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import Booking, { IBooking } from "../models/booking";
import Moment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(Moment);

// POST /api/booking
export const newBooking = catchAsyncErrors(async (req: NextRequest) => {
  const body = await req.json();
  const {
    room,
    checkInDate,
    checkOutDate,
    daysOfStay,
    amountPaid,
    paymentInfo,
  } = body;

  const booking = await Booking.create({
    room,
    user: req.user._id,
    checkInDate,
    checkOutDate,
    daysOfStay,
    amountPaid,
    paymentInfo,
    paidAt: Date.now(),
  });

  return NextResponse.json({ booking });
});

// GET /api/booking/check
export const checkRoomAvailability = catchAsyncErrors(
  async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    const checkInDate: Date = new Date(
      searchParams.get("checkInDate") as string
    );
    const checkOutDate: Date = new Date(
      searchParams.get("checkOutDate") as string
    );

    const bookings: IBooking[] = await Booking.find({
      room: roomId,
      $and: [
        {
          checkInDate: {
            $lte: checkOutDate,
          },
        },
        {
          checkOutDate: {
            $gte: checkInDate,
          },
        },
      ],
    });

    const isAvailable: boolean = bookings.length === 0;

    return NextResponse.json({ isAvailable });
  }
);

// GET /api/booking/booked_dates
export const getRoomBookedDates = catchAsyncErrors(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  const bookings: IBooking[] = await Booking.find({
    room: roomId,
  });

  const bookedDates = bookings.flatMap((booking) => {
    return Array.from(
      moment
        .range(moment(booking.checkInDate), moment(booking.checkOutDate))
        .by("day")
    );
  });

  return NextResponse.json({ bookedDates });
});
