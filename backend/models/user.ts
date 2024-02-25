import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    ETag: string;
    Location: string;
    key: string;
    Key: string;
    Bucket: string;
  };
  role: string;
  createdAt: Date;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Your password must be longer than 6 characters"],
    select: false,
  },
  avatar: {
    type: Object,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

export default mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);
