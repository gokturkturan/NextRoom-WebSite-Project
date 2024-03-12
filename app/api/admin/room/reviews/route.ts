import { connectDB } from "@/backend/config/connectDB";
import { deleteRoomReview, getRoomReviews } from "@/backend/controllers/room";
import { authorizeRoles, isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {}

const router = createEdgeRouter<NextRequest, RequestContext>();

connectDB();

router.use(isAuth, authorizeRoles("admin")).get(getRoomReviews);
router.use(isAuth, authorizeRoles("admin")).delete(deleteRoomReview);

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}

export async function DELETE(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
