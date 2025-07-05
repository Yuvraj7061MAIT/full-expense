'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditExpense() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState({
    amount: '',
    category: '',
    date: '',
    paymentMethod: '',
    notes: '',
  });

  useEffect(() => {
    const fetchExpense = async () => {
      const res = await fetch(`/api/expenses/${id}`);
      if (!res.ok) {
        alert('❌ Failed to load expense data.');
        return;
      }
      const data = await res.json();
      setForm({
        ...data,
        date: data.date?.split('T')[0] || '', // Format ISO date to YYYY-MM-DD
      });
    };

    if (id) fetchExpense();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('❌ Failed to update expense.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Expense</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="category"
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="paymentMethod"
          type="text"
          placeholder="Payment Method"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
}
