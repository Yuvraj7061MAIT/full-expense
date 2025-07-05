import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/app/lib/mongoose";
import { Expense } from "@/app/models/Expense";
import { Budget } from "@/app/models/Budget";
import { db } from "@/app/lib/drizzle/client";
import { monthlyReports } from "@/app/lib/drizzle/schema";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const monthStr = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}`;

    const budget = await Budget.findOne({ userId, month: monthStr });
    const allExpenses = await Expense.find({ userId });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const expensesInMonth = allExpenses.filter((e) => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    });

    const totalSpent = expensesInMonth.reduce((sum, e) => sum + e.amount, 0);

    const categoryMap: Record<string, number> = {};
    for (const e of expensesInMonth) {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    }

    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const overBudgetCategories = Object.entries(categoryMap)
      .filter(([cat, amount]) => {
        const b = Array.isArray(budget)
          ? budget.find((b) => b.category === cat)
          : budget?.category === cat
            ? budget
            : null;
        return b && amount > b.limitAmount;
      })
      .map(([cat]) => cat);

    // Push to Neon  Drizzle
    await db.insert(monthlyReports).values({
      userId,
      month: monthStr,
      totalSpent,
      topCategory,
      overBudgetCategories,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error in /api/reports/generate:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
