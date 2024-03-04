import { connectDB } from "@/backend/config/connectDB";
import { canReview } from "@/backend/controllers/room";
import { isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

connectDB();

const router = createEdgeRouter<NextRequest, RequestContext>();

router.use(isAuth).get(canReview);

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
