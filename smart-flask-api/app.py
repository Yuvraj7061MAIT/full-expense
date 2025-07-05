from flask import Flask, request, jsonify
import pandas as pd
from datetime import datetime, timedelta, timezone
import traceback

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze_expenses():
    try:
        data = request.json
        print("📥 Received JSON:", data)

        # Validate input
        if not data or not isinstance(data, list):
            print("❌ Invalid input: Not a list or empty")
            return jsonify({"tips": ["⚠️ Invalid or empty data received."], "predicted_next_budget": 0}), 400

        # Load into DataFrame
        df = pd.DataFrame(data)
        print("🧾 DataFrame created:\n", df.head())

        # Check required columns
        required_cols = {"category", "amount", "date"}
        if not required_cols.issubset(df.columns):
            print("❌ Missing columns")
            return jsonify({"tips": ["⚠️ Data missing required fields."], "predicted_next_budget": 0}), 400

        # Clean and convert data
        df["date"] = pd.to_datetime(df["date"], errors="coerce", utc=True)
        df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
        df["category"] = df["category"].str.strip().str.title()  # Normalize category name
        df.dropna(subset=["category", "amount", "date"], inplace=True)

        if df.empty:
            print("⚠️ Cleaned DataFrame is empty")
            return jsonify({"tips": ["⚠️ No valid expense records to analyze."], "predicted_next_budget": 0})

        # Filter last 30 days
        cutoff = datetime.now(timezone.utc) - timedelta(days=30)
        recent_expenses = df[df["date"] >= cutoff]
        print("📆 Filtered recent expenses:\n", recent_expenses)

        if recent_expenses.empty:
            return jsonify({"tips": ["ℹ️ No expenses in the last 30 days."], "predicted_next_budget": 0})

        # Analyze spending
        category_summary = recent_expenses.groupby("category")["amount"].sum().sort_values(ascending=False)
        print("📊 Category Summary:\n", category_summary)

        # Suggestion logic
        tips = []
        adjustable = ["Food", "Travel", "Entertainment", "Shopping", "Misc", "Groceries", "Friends"]
        fixed = ["Rent", "EMI", "Insurance", "Tuition", "Loan", "School Fees"]
        total = recent_expenses["amount"].sum()
        predicted = total

        for category, amount in category_summary.items():
            if category in adjustable:
                percent = 15 if amount >= 1000 else 10
                reduction = amount * (percent / 100)
                predicted -= reduction
                tips.append(f"💡 Reduce {category} by {percent}% to save ₹{int(reduction)}")
            elif category in fixed:
                tips.append(f"🔒 {category} is fixed. Focus on reducing flexible expenses.")
            else:
                # Unknown or custom category
                if amount >= 1000:
                    reduction = amount * 0.10
                    predicted -= reduction
                    tips.append(f"💡 Consider reducing {category} by 10% to save ₹{int(reduction)}")

        return jsonify({
            "tips": tips if tips else ["✅ Spending looks good. No major tips."],
            "predicted_next_budget": round(predicted)
        })

    except Exception:
        print("🔥 FULL ERROR TRACE:")
        print(traceback.format_exc())
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
