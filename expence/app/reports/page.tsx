import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/app/lib/mongoose";
import { Budget } from "@/app/models/Budget";
import { Expense } from "@/app/models/Expense";
import GenerateReportButton from "./GenerateReportButton";

const ReportsPage = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  await connectDB();

  const budgets = await Budget.find({ userId }).sort({ month: -1 }).limit(3);
  const allExpenses = await Expense.find({ userId });

  const reports = budgets
    .map((budget) => {
      const { month, limitAmount } = budget;
      if (!month) return null; // prevent crashing

      const [year, mon] = month.split("-").map(Number);
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 0, 23, 59, 59);

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

      return {
        month,
        limitAmount,
        totalSpent,
        topCategory,
        overBudget: totalSpent > limitAmount,
      };
    })
    .filter(Boolean); // remove null reports

  return (
    <div className="min-h-screen p-8 bg-[#0d1117] text-white">
      <div className="max-w-4xl mx-auto bg-[#161b22] p-10 rounded-3xl shadow-xl border border-gray-700 space-y-8">
        <h1 className="text-3xl font-bold mb-6">📈 Monthly Reports</h1>
        <GenerateReportButton />

        {reports.length > 0 ? (
          reports.map((r, i) => {
            if (!r) return null;
            return (
              <div key={i} className="bg-[#0d1117] p-5 rounded-xl border border-gray-600">
                <h2 className="text-xl font-semibold text-cyan-400 mb-2">{r.month}</h2>
                <p>💰 Budget Limit: ₹{r.limitAmount}</p>
                <p>💸 Total Spent: ₹{r.totalSpent}</p>
                <p>📊 Top Category: {r.topCategory}</p>
                <p>
                  {r.overBudget ? (
                    <span className="text-red-500 font-bold">🚨 Over Budget</span>
                  ) : (
                    <span className="text-green-400 font-bold">✅ Within Budget</span>
                  )}
                </p>
              </div>
            );
          })
        ) : (
          <p>No budget reports found.</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
