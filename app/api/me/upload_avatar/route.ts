import { connectDB } from "@/backend/config/connectDB";
import { uploadAvatar } from "@/backend/controllers/auth";
import { isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();

connectDB();

router.use(isAuth).post(uploadAvatar);

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
