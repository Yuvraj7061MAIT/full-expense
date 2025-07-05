"use client";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function Chart({ expenses }: { expenses: any[] }) {
  const categoryMap: Record<string, number> = {};
  const dateMap: Record<string, number> = {};

  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    const d = new Date(e.date).toISOString().slice(0, 10);
    dateMap[d] = (dateMap[d] || 0) + e.amount;
  });

  const sortedDates = Object.keys(dateMap).sort();

  return (
    <div className="grid md:grid-cols-2 gap-8 p-4 w-full">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
        <Pie
          data={{
            labels: Object.keys(categoryMap),
            datasets: [
              {
                data: Object.values(categoryMap),
                backgroundColor: [
                  "#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa"
                ]
              }
            ]
          }}
        />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Spending Over Time</h3>
        <Line
          data={{
            labels: sortedDates,
            datasets: [
              {
                label: "₹ Spent",
                data: sortedDates.map(date => dateMap[date]),
                fill: false,
                borderColor: "#3b82f6"
              }
            ]
          }}
        />
      </div>
    </div>
  );
}
