import { connectDB } from "@/backend/config/connectDB";
import { deleteBooking } from "@/backend/controllers/booking";
import { authorizeRoles, isAuth } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {
  params: { id: string };
}

connectDB();

const router = createEdgeRouter<NextRequest, RequestContext>();

router.use(isAuth, authorizeRoles("admin")).delete(deleteBooking);

export async function DELETE(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
