import { connectDB } from "@/backend/config/connectDB";
import { updateRoom, deleteRoom } from "@/backend/controllers/room";
import { authorizeRoles, isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {
  params: {
    id: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

connectDB();

router.use(isAuth, authorizeRoles("admin")).put(updateRoom);
router.use(isAuth, authorizeRoles("admin")).delete(deleteRoom);

export async function PUT(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}

export async function DELETE(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
