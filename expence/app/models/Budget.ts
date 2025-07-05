import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  limitAmount: { type: Number, required: true },
  month: { type: String, required: true }
});

export const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
