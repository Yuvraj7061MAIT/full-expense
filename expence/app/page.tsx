"use client";

import React from "react";
import { Navbar } from "./components/Navbar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Home = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      alert("Please sign up or log in to continue.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-28 px-6 bg-[#0f172a]">
        <div className="max-w-2xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Finance Tracker+
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            Track expenses. Set smart budgets. Get personalized tips based on last month's spending.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition font-medium"
          >
            🚀 Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          ✨ What You Can Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Track Expenses",
              desc: "Log your daily expenses with date, category, and payment method.",
            },
            {
              title: "Set Budgets",
              desc: "Define monthly spending limits and get alerts when they’re crossed.",
            },
            {
              title: "View Reports",
              desc: "Visualize your spending trends with charts and top categories.",
            },
            {
              title: "Smart Suggestions",
              desc: "Get tips based on your last month's spending patterns.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 p-6 rounded-2xl shadow-md text-center transition-all duration-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-400">
                {item.title}
              </h3>
              <p className="text-white/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-6 text-center mt-10 shadow-inner">
        <p className="text-sm">
          © {new Date().getFullYear()} Finance Tracker+. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
