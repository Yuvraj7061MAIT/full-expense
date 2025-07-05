// import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { connectDB } from "@/app/lib/mongoose";
// import { Expense } from "@/app/models/Expense";
// import { Budget } from "@/app/models/Budget";

// export async function GET(req: Request) {
//   const { userId } = await auth();
//   if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   await connectDB();

//   const { searchParams } = new URL(req.url);
//   const month = searchParams.get("month");

//   const [year, monthIndex] = month?.split("-").map(Number) || [];
//   const start = new Date(year, monthIndex - 1, 1);
//   const end = new Date(year, monthIndex, 0, 23, 59, 59);

//   const expenses = await Expense.find({
//     userId,
//     date: { $gte: start, $lte: end },
//   }).sort({ date: -1 });

//   const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

//   const budgets = await Budget.find({ userId });
//   const budget = budgets[0]; // one budget for whole month
//   const alerts: string[] = [];

//   if (budget) {
//     const percent = (totalSpent / budget.limitAmount) * 100;
//     if (percent >= 100) alerts.push(`🚨 Budget exceeded! You spent ₹${totalSpent} of ₹${budget.limitAmount}`);
//     else if (percent >= 80) alerts.push(`⚠️ 80% budget used. You've spent ₹${totalSpent} of ₹${budget.limitAmount}`);
//   }

//   const categorySpent: Record<string, number> = {};
//   const paymentMethods: Record<string, number> = {};

//   for (const e of expenses) {
//     categorySpent[e.category] = (categorySpent[e.category] || 0) + e.amount;
//     paymentMethods[e.paymentMethod] = (paymentMethods[e.paymentMethod] || 0) + 1;
//   }

//   const topCategory =
//     Object.entries(categorySpent).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

//   const topPaymentMethods = Object.entries(paymentMethods)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 3)
//     .map(([method]) => method);

//   return NextResponse.json({
//   expenses,
//   totalSpent,
//   topCategory,
//   topPaymentMethods,
//   alerts,
//   });
// }


// app/api/dashboard/route.ts
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ message: 'Placeholder response' });
}
