import { connectDB } from "@/backend/config/connectDB";
import { registerUser } from "@/backend/controllers/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

connectDB();

const router = createEdgeRouter<NextRequest, RequestContext>();

router.post(registerUser);

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
