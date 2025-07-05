'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddExpense() {
  const router = useRouter();
  const [form, setForm] = useState({
    amount: '',
    category: '',
    date: '',
    paymentMethod: '',
    notes: '',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Failed to add expense.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#1e293b] p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">➕ Add Expense</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="amount"
            type="number"
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full bg-[#334155] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="category"
            type="text"
            placeholder="Category (e.g. Food, Rent)"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full bg-[#334155] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full bg-[#334155] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="paymentMethod"
            type="text"
            placeholder="Payment Method (e.g. UPI, Cash)"
            value={form.paymentMethod}
            onChange={handleChange}
            required
            className="w-full bg-[#334155] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full bg-[#334155] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg font-semibold"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
