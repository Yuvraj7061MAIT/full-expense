import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/app/lib/mongoose";
import { Expense } from "@/app/models/Expense";
import { Budget } from "@/app/models/Budget";
import ChartClient from "@/app/components/dashboard/ChartClient";
import Link from "next/link";

const Dashboard = async ({ searchParams }: any) => {
  const { userId } = await auth();
  if (!userId) redirect("/");

  await connectDB();

  const now = new Date();
  const rawMonth = typeof searchParams?.month === "string" ? searchParams.month : undefined;
  const [year, month] = rawMonth?.split("-").map(Number) || [now.getFullYear(), now.getMonth() + 1]; 
  const start = new Date(year!, month! - 1, 1);
  const end = new Date(year!, month!, 0, 23, 59, 59);

  const selectedMonth = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}`;

  const expenses = await Expense.find({
    userId,
    date: { $gte: start, $lte: end },
  }).sort({ date: -1 });

  const budget = await Budget.findOne({ userId, month: selectedMonth });
  const budgets = await Budget.find({ userId });

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categorySpent: Record<string, number> = {};
  const paymentMethods: Record<string, number> = {};
  const alerts: string[] = [];

  if (budget) {
    const percent = (totalSpent / budget.limitAmount) * 100;
    if (percent >= 100)
      alerts.push(`🚨 Budget exceeded! You spent ₹${totalSpent} of ₹${budget.limitAmount}`);
    else if (percent >= 80)
      alerts.push(`⚠️ 80% budget used. You've spent ₹${totalSpent} of ₹${budget.limitAmount}`);
  }

  for (const e of expenses) {
    categorySpent[e.category] = (categorySpent[e.category] || 0) + e.amount;
    paymentMethods[e.paymentMethod] = (paymentMethods[e.paymentMethod] || 0) + 1;
  }

  for (const b of budgets) {
    const spent = categorySpent[b.category] || 0;
    const percent = (spent / b.limitAmount) * 100;
    if (percent >= 100) alerts.push(`🚨 Budget exceeded in ${b.category}`);
    else if (percent >= 80) alerts.push(`⚠️ 80% budget reached in ${b.category}`);
  }

  const topCategory = Object.entries(categorySpent).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  const topPaymentMethods = Object.entries(paymentMethods)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([method]) => method);

  let suggestions: string[] = [];
  let predictedNextBudget: number | null = null;

  try {
    const res = await fetch("http://localhost:5001/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        expenses.map((e) => ({
          category: e.category,
          amount: e.amount,
          date: new Date(e.date).toISOString(),
        }))
      ),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);

    const data = await res.json();
    if (Array.isArray(data.tips)) suggestions = data.tips;
    if (typeof data.predicted_next_budget === "number")
      predictedNextBudget = data.predicted_next_budget;
  } catch (err) {
    console.error("❌ Error fetching tips:", err);
    suggestions = ["⚠️ Unable to retrieve smart tips at this time."];
    predictedNextBudget = null;
  }

  return (
    <div className="min-h-screen p-8 bg-[#0d1117] text-white">
      <div className="max-w-6xl mx-auto bg-[#161b22] p-10 rounded-3xl shadow-xl space-y-10 border border-gray-700">
        {/* Header */}
        <div className="flex flex-wrap gap-3">
          <Link href="/expenses/add" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full font-medium">
            ➕ Add Expense
          </Link>
          <Link href="/budget" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-full font-medium">
            💰 Set Budget
          </Link>
          <Link href="/expenses" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full font-medium">
            📄 View All Expenses
          </Link>
          <Link href="/reports" className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-full font-medium">
            📈 View Reports
          </Link>
        </div>

        {/* Month Selector */}
        <form method="get" className="flex gap-4 items-center">
          <label className="text-white/80 font-medium">Month:</label>
          <input
            type="month"
            name="month"
            defaultValue={selectedMonth}
            className="bg-[#0d1117] text-white border border-gray-600 rounded px-3 py-1 focus:ring focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded font-semibold">
            Go
          </button>
        </form>

        {/* Summary */}
        <div className="space-y-1 text-white/90">
          <p>Total Spent: <span className="text-white font-semibold">₹{totalSpent}</span></p>
          <p>Top Category: <span className="text-white font-semibold">{topCategory}</span></p>
          <p>Top 3 Payment Methods: <span className="text-white font-semibold">{topPaymentMethods.join(", ")}</span></p>
        </div>

        {/* Budget Alerts */}
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-red-400">🚨 Budget Alerts</h2>
          {alerts.length > 0 ? (
            <ul className="list-disc list-inside bg-red-500/10 p-4 rounded-lg border border-red-500/30 text-red-300">
              {alerts.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          ) : (
            <p className="text-green-400 font-medium">✅ You are within your budget.</p>
          )}
        </div>

        {/* Smart Tips */}
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-cyan-400">💡 Smart Tips</h2>
          {suggestions.length > 0 ? (
            <>
              <ul className="list-disc list-inside bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/30 text-cyan-100">
                {suggestions.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
              {predictedNextBudget !== null && (
                <p className="mt-4 text-cyan-300">
                  📉 If you apply these tips, your estimated next month’s spending could be <strong>₹{predictedNextBudget}</strong>
                </p>
              )}
            </>
          ) : (
            <p>No suggestions at the moment.</p>
          )}
        </div>

        {/* Chart */}
        <div className="bg-[#0d1117] border border-gray-700 rounded-xl p-6 shadow-inner">
          <ChartClient
            expenses={expenses.map((e) => ({
              _id: e._id.toString(),
              amount: e.amount,
              category: e.category,
              date: e.date.toISOString(),
              paymentMethod: e.paymentMethod,
              notes: e.notes,
              userId: e.userId.toString(),
            }))}
          />
        </div>

        {/* Recent Expenses */}
        <div className="bg-[#0d1117] border border-gray-700 rounded-xl p-6 shadow-inner">
          <h2 className="text-xl font-semibold mb-4 text-white">🧾 Recent Expenses</h2>
          <ul className="divide-y divide-gray-700">
            {expenses.slice(0, 5).map((e) => (
              <li key={e._id} className="py-3 flex justify-between text-sm text-gray-300">
                <span>{e.category} – ₹{e.amount}</span>
                <span>{new Date(e.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
