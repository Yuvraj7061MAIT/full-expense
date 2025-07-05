'use client';
import { useEffect, useState } from 'react';

export default function ExpensesList() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    fetch('/api/expenses')
      .then(res => res.json())
      .then(setExpenses);
  }, []);

  const filtered = expenses.filter(e =>
    e.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    setExpenses(expenses.filter(e => e._id !== id));
  };

  const startEditing = (expense: any) => {
    setEditingId(expense._id);
    setEditForm({
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split('T')[0],
      paymentMethod: expense.paymentMethod,
      notes: expense.notes || '',
    });
  };

  const saveEdit = async (id: string) => {
    await fetch(`/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });

    const updated = expenses.map(e => (e._id === id ? { ...e, ...editForm } : e));
    setExpenses(updated);
    setEditingId(null);
  };

  const handleChange = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Expenses</h1>
        <a href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</a>
      </div>

      <input
        placeholder="Search by category"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Payment</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => (
            <tr key={e._id} className="border">
              {editingId === e._id ? (
                <>
                  <td className="p-1 border">
                    <input
                      name="amount"
                      type="number"
                      value={editForm.amount}
                      onChange={handleChange}
                      className="w-full px-1 border rounded"
                    />
                  </td>
                  <td className="p-1 border">
                    <input
                      name="category"
                      value={editForm.category}
                      onChange={handleChange}
                      className="w-full px-1 border rounded"
                    />
                  </td>
                  <td className="p-1 border">
                    <input
                      name="date"
                      type="date"
                      value={editForm.date}
                      onChange={handleChange}
                      className="w-full px-1 border rounded"
                    />
                  </td>
                  <td className="p-1 border">
                    <input
                      name="paymentMethod"
                      value={editForm.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-1 border rounded"
                    />
                  </td>
                  <td className="p-1 border">
                    <button
                      onClick={() => saveEdit(e._id)}
                      className="text-green-600 mr-2"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600"
                    >
                      ❌ Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border">₹{e.amount}</td>
                  <td className="p-2 border">{e.category}</td>
                  <td className="p-2 border">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="p-2 border">{e.paymentMethod}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => startEditing(e)}
                      className="text-blue-600 mr-2"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="text-red-600"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
