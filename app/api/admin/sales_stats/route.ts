import { connectDB } from "@/backend/config/connectDB";
import { getSalesStats } from "@/backend/controllers/booking";
import { authorizeRoles, isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

connectDB();

const router = createEdgeRouter<NextRequest, RequestContext>();

router.use(isAuth, authorizeRoles("admin")).get(getSalesStats);

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
