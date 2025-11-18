import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Keep this list in sync with middleware.ts's ADMIN_USER_IDS when debugging.
const ADMIN_USER_IDS = [
  //"user_35f7uaMn9wVbfVvKMs0f5qlkggG",
  "user_34Qbtnh4X9AysmuJ9ExoxjZOESw",
  "user_35fCFwodslsEUu3aVJEZUVYkXfz",
  "user_35fBxExtXbbKRitefXI7P5CXSM0",
  "user_35fIfKmiVCvPYC74Z2rzcQim6y6",
];

export async function GET() {
  const authResult = await auth();
  const anyAuth = authResult as any;
  const userId = anyAuth?.userId ?? anyAuth?.user?.id ?? null;

  const isAdmin = !!(userId && ADMIN_USER_IDS.includes(userId));

  return NextResponse.json({ userId, isAdmin });
}
