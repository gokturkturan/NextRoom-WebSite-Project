import { connectDB } from "@/backend/config/connectDB";
import { getRoomBookedDates } from "@/backend/controllers/booking";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();

connectDB();

router.get(getRoomBookedDates);

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
