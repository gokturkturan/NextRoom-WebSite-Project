import { NextRequest, NextResponse } from "next/server";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import Booking, { IBooking } from "../models/booking";
import Moment from "moment";
import { extendMoment } from "moment-range";
import ErrorHandler from "../utils/errorHandler";

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

// GET /api/booking/check_rooom_availability
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

// GET /api/booking/me
export const myBookings = catchAsyncErrors(async (req: NextRequest) => {
  const bookings = await Booking.find({
    user: req.user._id,
  });

  return NextResponse.json({ bookings });
});

// GET /api/booking/:id
export const getBookingDetails = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: "string" } }) => {
    const booking = await Booking.findById(params.id).populate("room user");

    if (
      booking.user._id.toString() !== req.user._id &&
      req.user.role !== "admin"
    )
      throw new ErrorHandler("You cannot view this booking", 403);

    return NextResponse.json({ booking });
  }
);

const getLastSixMonthsSales = async () => {
  const last6MonthsSales: any = [];

  // Get Current date
  const currentDate = moment();

  async function fetchSalesForMonth(
    startDate: moment.Moment,
    endDate: moment.Moment
  ) {
    const result = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amountPaid" },
          numOfBookings: { $sum: 1 },
        },
      },
    ]);

    const { totalSales, numOfBookings } =
      result?.length > 0 ? result[0] : { totalSales: 0, numOfBookings: 0 };

    last6MonthsSales.push({
      monthName: startDate.format("MMMM"),
      totalSales,
      numOfBookings,
    });
  }

  for (let i = 0; i < 6; i++) {
    const startDate = moment(currentDate).startOf("month");
    const endDate = moment(currentDate).endOf("month");

    await fetchSalesForMonth(startDate, endDate);

    currentDate.subtract(1, "months");
  }

  return last6MonthsSales;
};

const getTopPerformingRooms = async (startDate: Date, endDate: Date) => {
  const topRooms = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$room",
        bookingsCount: { $sum: 1 },
      },
    },
    {
      $sort: { bookingsCount: -1 },
    },
    {
      $limit: 3,
    },
    {
      $lookup: {
        from: "rooms",
        localField: "_id",
        foreignField: "_id",
        as: "roomData",
      },
    },
    {
      $unwind: "$roomData",
    },
    {
      $project: {
        _id: 0,
        roomName: "$roomData.name",
        bookingsCount: 1,
      },
    },
  ]);

  return topRooms;
};

// GET /api/admin/sales_stats
export const getSalesStats = catchAsyncErrors(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const startDate = new Date(searchParams.get("startDate") as string);
  const endDate = new Date(searchParams.get("endDate") as string);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const bookings = await Booking.find({
    createdAt: { $gte: startDate, $lte: endDate },
  });

  const numberOfBookings = bookings.length;
  const totalSales = bookings.reduce(
    (acc, booking) => acc + booking.amountPaid,
    0
  );

  const sixMonthSalesData = await getLastSixMonthsSales();
  const topRooms = await getTopPerformingRooms(startDate, endDate);

  return NextResponse.json({
    numberOfBookings,
    totalSales,
    sixMonthSalesData,
    topRooms,
  });
});

// GET /api/admin/booking
export const allAdminBookings = catchAsyncErrors(async (req: NextRequest) => {
  const bookings = await Booking.find();

  return NextResponse.json({ bookings });
});

// DELETE /api/admin/booking/:id
export const deleteBooking = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: "string" } }) => {
    const booking = await Booking.findById(params.id);

    if (!booking) throw new ErrorHandler("Booking not found.", 404);

    await booking.deleteOne();

    return NextResponse.json({ success: true });
  }
);
