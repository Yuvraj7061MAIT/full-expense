"use client";

export default function GenerateReportButton() {
  return (
    <button
      onClick={async () => {
        const res = await fetch("/api/reports/generate", {
          method: "POST",
        });

        if (res.ok) {
          alert("✅ Report generated!");
        } else {
          alert("❌ Failed to generate report.");
        }
      }}
      className="bg-indigo-600 px-4 py-2 rounded text-white"
    >
      📥 Generate Report
    </button>
  );
}
