
import { connectDB } from "@/app/lib/mongoose";
import { Expense } from "@/app/models/Expense";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectDB();
  const newExpense = await Expense.create({ ...body, userId });
  return NextResponse.json(newExpense);
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const expenses = await Expense.find({ userId }).sort({ date: -1 });
  return NextResponse.json(expenses);
}