import { connectDB } from "@/backend/config/connectDB";
import { resetPassword } from "@/backend/controllers/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();

connectDB();

router.post(resetPassword);

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
