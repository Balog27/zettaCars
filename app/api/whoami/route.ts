import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // auth() may be async in this environment; await it to get the shape { userId }
  const authResult = await auth();
  // auth() types vary across environments; cast to any and normalize defensively
  const anyAuth = authResult as any;
  const userId = anyAuth?.userId ?? anyAuth?.user?.id ?? null;

  return NextResponse.json({ userId });
}
