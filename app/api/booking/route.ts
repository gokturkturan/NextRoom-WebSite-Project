import { connectDB } from "@/backend/config/connectDB";
import { newBooking } from "@/backend/controllers/booking";
import { isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();

connectDB();

router.use(isAuth).post(newBooking);

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
