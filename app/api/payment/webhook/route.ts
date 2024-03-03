import { connectDB } from "@/backend/config/connectDB";
import { webhookCheckout } from "@/backend/controllers/payment";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

connectDB();

const router = createEdgeRouter<NextRequest, RequestContext>();

router.post(webhookCheckout);

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
