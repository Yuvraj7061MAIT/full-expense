# 💸 Smart Expense Tracker

A modern full-stack Expense Tracking web app with **Smart Budgeting**, **Data Insights**. Built using **Next.js**, **MongoDB**, **PostgreSQL + Drizzle ORM**, **Flask**, and **Clerk Authentication**.

---

## 📸 Preview

![dashboard](https://github.com/user-attachments/assets/2d90dfc0-917d-4509-996b-8791f17f7d26)

![image](https://github.com/user-attachments/assets/ba7cb0fe-1d1d-4ff4-aaf6-8c2dd234b9fa)
![image](https://github.com/user-attachments/assets/a4cb0999-162f-4b97-ae84-602bf651497f)


![image](https://github.com/user-attachments/assets/6c1b2b6a-9e25-4ea6-a10f-0c34fbba02fc)

![image](https://github.com/user-attachments/assets/0fe31bc5-fc33-4e82-a09c-f0ca1df1f744)

![image](https://github.com/user-attachments/assets/8a2a6763-43c5-496b-b664-3dc2791a62b0)


---

## 🧠 Features

- 🔐 Secure authentication using Clerk
- 📊 Dynamic dashboard with charts and category breakdown
- 💰 Budget setting per category/month
- 🧾 Add, view, and filter expenses
- 🧠 Flask API for smart savings tips
- 🧮 Monthly reports generation stored in PostgreSQL (NeonDB)
- 📈 Separate report page for monthly summaries

---

## 🔧 Tech Stack

| Frontend       | Backend        | Databases         |                | Auth    |
|----------------|----------------|-------------------|----------------|---------|
| Next.js 15     | Next.js        | MongoDB (Mongoose)| Python (Flask) | Clerk   |
| Tailwind CSS   | API Routes     | PostgreSQL (Neon) | Pandas, Sklearn|         |
| React Charts   |                | Drizzle ORM       |                |         |

---

## 📁 Folder Structure

```

/app
/api/reports/generate      # API to save reports to PostgreSQL
/dashboard/page.tsx        # Dashboard UI & logic
/reports/page.tsx          # Report display page
/components/dashboard      # Reusable UI components (e.g., ChartClient)
/models                    # Mongoose models (Expense, Budget)
/lib                       # Mongoose & Drizzle config
/public                      # Static assets

````

---

## 📦 Setup Instructions

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/smart-expense-tracker.git
cd smart-expense-tracker
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file with:

```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=


    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/


    MONGODB_URI=



    DATABASE_URL=


```

### 4️⃣ Run Flask (separate terminal)

```bash
cd smart-flask-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

This starts the ML server at: `http://localhost:5001`

### 5️⃣ Run Next.js App

```bash
npm run dev
```

App will be available at `http://localhost:3000`

---

## 📊 Dashboard Features

* View monthly expenses
* Filter by month
* Smart budget alerts
* Add new expenses and budgets
* Real-time suggestions from ML
* View top categories and payment methods

---

## 📈 Reports Page

* View last 3 months’ budget and expense comparisons
* See over-budget alerts
* Top category spend per month
* Option to **Generate Report** → Saves summary to PostgreSQL

---

## 🧠 Smart Tips 

* Receives expense data
* Generates:

  * Smart tips to reduce spend
  * Predicted next month’s spending
* Returns insights to display on dashboard

---

## 🛢️ PostgreSQL Schema (`monthly_reports`)

```ts
userId: text
month: text
totalSpent: integer
topCategory: text
overBudgetCategories: json
```

Data is inserted by `/api/reports/generate` endpoint.

---

## ✨ Author

**Yuvraj Singh**
[Portfolio](https://portfolio-yuvraj-yuvraj7061maits-projects.vercel.app/) | [GitHub](https://github.com/Yuvraj7061MAIT) | [LinkedIn](https://www.linkedin.com/in/yuvraj-singh-ml/)

