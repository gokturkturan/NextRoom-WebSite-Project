import { connectDB } from "@/backend/config/connectDB";
import { getBookingDetails } from "@/backend/controllers/booking";
import { isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {
  params: {
    id: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

connectDB();

router.use(isAuth).get(getBookingDetails);

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
