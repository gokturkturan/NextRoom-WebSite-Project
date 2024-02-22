import { NextRequest, NextResponse } from "next/server";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import User from "../models/user";
import ErrorHandler from "../utils/errorHandler";
import S3 from "aws-sdk/clients/s3.js";
import { nanoid } from "nanoid";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  region: "eu-north-1",
  apiVersion: "2010-12-01",
};

const awsS3 = new S3(awsConfig);

// POST /api/auth/register
export const registerUser = catchAsyncErrors(async (req: NextRequest) => {
  const body = await req.json();
  const { name, email, password } = body;

  const user = await User.create({
    name,
    email,
    password,
  });

  return NextResponse.json({
    success: true,
  });
});

// PUT /api/me/update
export const updateProfile = catchAsyncErrors(async (req: NextRequest) => {
  const body = await req.json();

  const userData = {
    name: body.name,
    email: body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, userData);

  return NextResponse.json({
    success: true,
    user,
  });
});

// PUT /api/me/update_password
export const updatePassword = catchAsyncErrors(async (req: NextRequest) => {
  const body = await req.json();

  const user = await User.findById(req.user._id).select("+password");

  const isMatched = await user.comparePassword(body.oldPassword);

  if (!isMatched) throw new ErrorHandler("Old password is incorrect", 400);

  user.password = body.newPassword;

  await user.save();

  return NextResponse.json({
    success: true,
  });
});

export const uploadAvatar = catchAsyncErrors(async (req: NextRequest) => {
  const body = await req.json();

  const { avatar } = body;

  const base64Image = Buffer.from(
    avatar.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const type = avatar.split(";")[0].split("/")[1];

  const params = {
    Bucket: "nextroom3",
    Key: `${nanoid()}.${type}`,
    Body: base64Image,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  const data = await awsS3.upload(params).promise();

  if (!data) throw new ErrorHandler("Upload failed. Try again.", 400);

  const userData = {
    avatar: data,
  };

  await User.findByIdAndUpdate(req.user._id, userData);

  if (req.user.avatar.Location) {
    const Bucket = req.user.avatar.Bucket;
    const Key = req.user.avatar.Key;
    const data = await awsS3.deleteObject({ Bucket, Key }).promise();

    if (!data) throw new ErrorHandler("Deletion failed. Try again.", 400);
  }

  return NextResponse.json({
    success: true,
  });
});
