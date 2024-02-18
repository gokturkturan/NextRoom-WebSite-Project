import { connectDB } from "@/backend/config/connectDB";
import { allRooms } from "@/backend/controllers/room";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {
  params: { id: string };
}

connectDB();

const router = createEdgeRouter<NextRequest, RequestContext>();

router.get(allRooms);

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
