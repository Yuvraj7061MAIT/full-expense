'use client';

import { useEffect, useState } from 'react';

export default function BudgetPage() {
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    setMonth(currentMonth);
    fetchBudget(currentMonth);
  }, []);

  const fetchBudget = async (monthStr: string) => {
    try {
      const res = await fetch(`/api/budget?month=${monthStr}`);
      if (!res.ok) {
        const text = await res.text();
        console.error("API error:", text);
        setAmount('');
        return;
      }

      const data = await res.json();
      setAmount(data?.limitAmount?.toString() || '');
    } catch (err) {
      console.error("Budget fetch failed", err);
      setError('Failed to fetch budget.');
      setAmount('');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limitAmount: Number(amount), month }),
      });

      if (!res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          console.error("POST error:", data?.error || text);
          setError(data?.error || 'Failed to save budget.');
        } catch (e) {
          console.error("POST error:", text);
          setError('Failed to save budget.');
        }
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("POST failed", err);
      setError('An error occurred while saving.');
    }
  };

  const handleMonthChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
    setSaved(false);
    setError('');
    fetchBudget(selectedMonth);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#1e293b] p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">💰 Set Monthly Budget</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold">Select Month</label>
            <input
              type="month"
              value={month}
              onChange={handleMonthChange}
              className="w-full bg-[#334155] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Limit Amount (₹)</label>
            <input
              type="number"
              placeholder="Enter monthly budget"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#334155] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg font-semibold"
          >
            Save Budget
          </button>

          {saved && <p className="text-green-400 mt-3 text-sm">✅ Budget saved for {month}</p>}
          {error && <p className="text-red-500 mt-3 text-sm">❌ {error}</p>}
        </form>
      </div>
    </div>
  );
}
