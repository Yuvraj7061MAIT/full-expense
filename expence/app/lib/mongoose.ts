import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "financetracker",
    });
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB error ❌", err);
  }
};