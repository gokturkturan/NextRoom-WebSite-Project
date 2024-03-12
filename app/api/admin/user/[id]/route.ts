import { connectDB } from "@/backend/config/connectDB";
import { deleteUser, getUser, updateUser } from "@/backend/controllers/auth";
import { authorizeRoles, isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {
  params: { id: string };
}

connectDB();

const router = createEdgeRouter<NextRequest, RequestContext>();

router.use(isAuth, authorizeRoles("admin")).get(getUser);
router.use(isAuth, authorizeRoles("admin")).put(updateUser);
router.use(isAuth, authorizeRoles("admin")).delete(deleteUser);

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}

export async function PUT(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}

export async function DELETE(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
