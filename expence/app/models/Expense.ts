import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  date: Date,
  paymentMethod: String,
  notes: String,
  userId: String,
});

export const Expense = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);