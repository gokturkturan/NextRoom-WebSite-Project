import { NextRequest, NextResponse } from "next/server";
import Room, { IReview, IRoom } from "../models/room";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import APIFilters from "../utils/apiFilters";
import Booking from "../models/booking";

// GET /api/room
export const allRooms = catchAsyncErrors(async (req: NextRequest) => {
  const resPerPage: number = 4;
  const queryStr: any = {};

  const { searchParams } = new URL(req.url);

  searchParams.forEach((value, key) => {
    queryStr[key] = value;
  });

  const apiFilters = new APIFilters(Room, queryStr).search().filter();

  let rooms: IRoom[] = await apiFilters.query;
  const filteredRoomCount: number = rooms.length;

  apiFilters.pagination(resPerPage);
  rooms = await apiFilters.query.clone();

  return NextResponse.json({
    success: true,
    filteredRoomCount,
    resPerPage,
    rooms,
  });
});

// POST /api/admin/room
export const newRoom = catchAsyncErrors(async (req: NextRequest) => {
  const body = await req.json();

  body.user = req.user._id;

  const room = await Room.create(body);

  return NextResponse.json({ success: true, room });
});

// GET /api/room/:id
export const getRoomDetails = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const room = await Room.findById(params.id).populate("reviews.user");

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    return NextResponse.json({ success: true, room });
  }
);

// PUT /api/admin/room/:id
export const updateRoom = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    let room = await Room.findById(params.id);
    const body = await req.json();

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    room = await Room.findByIdAndUpdate(params.id, body, { new: true });

    return NextResponse.json({ success: true, room });
  }
);

// DELETE /api/admin/room/:id
export const deleteRoom = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    let room = await Room.findById(params.id);

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    await room.deleteOne();

    return NextResponse.json({ success: true });
  }
);

// POST /api/review
export const createRoomReview = catchAsyncErrors(async (req: NextRequest) => {
  const body = await req.json();

  const { rating, comment, roomId } = body;

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment,
  };

  const room = await Room.findById(roomId);

  if (!room) {
    throw new ErrorHandler("Room not found", 404);
  }

  const isReviewed = room.reviews.find(
    (r: IReview) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    room.reviews.forEach((review: IReview) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    room.reviews.push(review);
    room.numOfReviews = room.reviews.length;
  }

  room.ratings =
    room.reviews.reduce(
      (acc: number, item: { rating: number }) => item.rating + acc,
      0
    ) / room.reviews.length;

  await room.save();

  return NextResponse.json({ success: true });
});

// GET /api/review/can_review
export const canReview = catchAsyncErrors(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  const bookings = await Booking.find({ user: req.user._id, room: roomId });

  const canReview = bookings.length > 0 ? true : false;

  return NextResponse.json({ canReview });
});

// GET /api/admin/room
export const getAllRooms = catchAsyncErrors(async (req: NextRequest) => {
  const rooms = await Room.find();

  return NextResponse.json({ rooms });
});
