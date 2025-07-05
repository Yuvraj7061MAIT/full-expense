import { connectDB } from "@/app/lib/mongoose";
import { Expense } from "@/app/models/Expense";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: any) {
  await connectDB();
  const updated = await Expense.findByIdAndUpdate(params.id, await req.json(), { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  await connectDB();
  await Expense.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
