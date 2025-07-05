// app/api/budget/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import { Budget } from "@/app/models/Budget";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { limitAmount, month } = await req.json();
    if (!limitAmount || !month) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const result = await Budget.findOneAndUpdate(
      { userId, month },
      { limitAmount },
      { new: true, upsert: true }
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/budget error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Add this:
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    if (!month) return NextResponse.json({ error: "Month is required" }, { status: 400 });

    await connectDB();

    const budget = await Budget.findOne({ userId, month });
    return NextResponse.json(budget || {});
  } catch (err) {
    console.error("GET /api/budget error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
