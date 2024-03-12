import { NextRequest, NextResponse } from "next/server";
import Room, { IImage, IReview, IRoom } from "../models/room";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import APIFilters from "../utils/apiFilters";
import Booking from "../models/booking";
import { nanoid } from "nanoid";
import S3 from "aws-sdk/clients/s3.js";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: "eu-north-1",
  apiVersion: "2010-12-01",
};

const awsS3 = new S3(awsConfig);

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

// PUT /api/admin/room/:id/upload_images
export const uploadRoomImages = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const room = await Room.findById(params.id);
    const body = await req.json();

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    const { images } = body;

    const parameters = images.map((img: any) => {
      const base64Image = Buffer.from(
        img.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const type = img.split(";")[0].split("/")[1];

      const param = {
        Bucket: "nextroom3",
        Key: `${nanoid()}.${type}`,
        Body: base64Image,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      };

      return param;
    });

    for (const param of parameters) {
      try {
        const data = await awsS3.upload(param).promise();
        if (!data) throw new ErrorHandler("Upload failed. Try again.", 400);
        room.images.push(data);
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new ErrorHandler("Error uploading image", 500);
      }
    }

    await room.save();

    return NextResponse.json({ success: true });
  }
);

// DELETE /api/admin/room/:id/delete_image
export const deleteRoomImage = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const room = await Room.findById(params.id);
    const body = await req.json();

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    const { image } = body;
    const { Key, Bucket } = image;

    try {
      const data = await awsS3.deleteObject({ Key, Bucket }).promise();
      if (!data) throw new ErrorHandler("Deletion failed. Try again.", 400);
      room.images = room.images.filter((img: IImage) => img.Key !== Key);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw new ErrorHandler("Error deleting image", 500);
    }

    await room.save();

    return NextResponse.json({ success: true });
  }
);

// DELETE /api/admin/room/:id
export const deleteRoom = catchAsyncErrors(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    let room = await Room.findById(params.id);

    if (!room) {
      throw new ErrorHandler("Room not found", 404);
    }

    for (let i = 0; i < room?.images?.length; i++) {
      await awsS3
        .deleteObject({
          Key: room.images[i].Key,
          Bucket: room.images[i].Bucket,
        })
        .promise();
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

// GET /api/admin/room/reviews
export const getRoomReviews = catchAsyncErrors(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const room = await Room.findById(searchParams.get("roomId"));

  return NextResponse.json({
    reviews: room.reviews,
  });
});

// DELETE /api/admin/room/reviews
export const deleteRoomReview = catchAsyncErrors(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const roomId = searchParams.get("roomId");
  const reviewId = searchParams.get("id");

  const room = await Room.findById(roomId);

  const reviews = room.reviews.filter(
    (review: IReview) => review?._id.toString() !== reviewId
  );
  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews === 0
      ? 0
      : room?.reviews?.reduce(
          (acc: number, item: { rating: number }) => item.rating + acc,
          0
        ) / numOfReviews;

  await Room.findByIdAndUpdate(roomId, { reviews, numOfReviews, ratings });

  return NextResponse.json({
    success: true,
  });
});
