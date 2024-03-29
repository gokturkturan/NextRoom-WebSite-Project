import { connectDB } from "@/backend/config/connectDB";
import { getRoomDetails } from "@/backend/controllers/room";
import { createEdgeRouter } from "next-connect";
import { NextRequest } from "next/server";

interface RequestContext {
  params: {
    id: string;
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

connectDB();

router.get(getRoomDetails);

export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
