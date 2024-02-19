import { NextRequest, NextResponse } from "next/server";
import Room from "../models/room";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";

// GET /api/room
export const allRooms = catchAsyncErrors(async (req: NextRequest) => {
  const resPerPage: number = 8;
  const rooms = await Room.find();
  return NextResponse.json({ success: true, resPerPage, rooms });
});

// POST /api/admin/room
export const newRoom = catchAsyncErrors(async (req: NextRequest) => {
  const body = await req.json();

  const room = await Room.create(body);

  return NextResponse.json({ success: true, room });
});

// GET /api/room/:id
export const getRoomDetails = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: "string" } }) => {
    const room = await Room.findById(params.id);

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    return NextResponse.json({ success: true, room });
  }
);

// PUT /api/admin/room/:id
export const updateRoom = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: "string" } }) => {
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
  async (req: NextRequest, { params }: { params: { id: "string" } }) => {
    let room = await Room.findById(params.id);

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    await room.deleteOne();

    return NextResponse.json({ success: true });
  }
);
