import { connectDB } from "@/backend/config/connectDB";
import { getAllRooms, newRoom } from "@/backend/controllers/room";
import { authorizeRoles, isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

connectDB();

const router = createEdgeRouter<NextRequest, RequestContext>();

router.use(isAuth, authorizeRoles("admin")).post(newRoom);
router.use(isAuth, authorizeRoles("admin")).get(getAllRooms);

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
