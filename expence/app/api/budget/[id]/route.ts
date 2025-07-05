import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import { Budget } from "@/app/models/Budget";

export async function PUT(req: Request, { params }: any) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { category, limitAmount } = await req.json();
  await connectDB();
  const updated = await Budget.findOneAndUpdate(
    { _id: params.id, userId },
    { category, limitAmount },
    { new: true }
  );
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  await Budget.deleteOne({ _id: params.id, userId });
  return NextResponse.json({ success: true });
}
