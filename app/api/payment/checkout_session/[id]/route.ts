import { connectDB } from "@/backend/config/connectDB";
import { stripeCheckoutSession } from "@/backend/controllers/payment";
import { isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

connectDB();

const router = createEdgeRouter<NextRequest, RequestContext>();

router.use(isAuth).get(stripeCheckoutSession);

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
