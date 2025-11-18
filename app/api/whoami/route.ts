import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  // Await auth() and normalize shape defensively — cast to any because types
  // vary between signed-in and signed-out shapes in Clerk helper.
  const authResult = await auth();
  const anyAuth = authResult as any;
  const userId = anyAuth?.userId ?? anyAuth?.user?.id ?? null;

  return NextResponse.json({ userId });
}
