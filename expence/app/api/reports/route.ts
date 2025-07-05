
import { db } from "@/app/lib/drizzle/client";
import { monthlyReports } from "@/app/lib/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reports = await db
    .select()
    .from(monthlyReports)
    .where(eq(monthlyReports.userId, userId))
    .orderBy(desc(monthlyReports.month))
    .limit(3);

  return NextResponse.json(reports);
}
