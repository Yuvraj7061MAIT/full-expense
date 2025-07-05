"use client";

import dynamic from "next/dynamic";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("./Chart"), { ssr: false });

export default function ChartClient({ expenses }: { expenses: any[] }) {
  return <Chart expenses={expenses} />;
}
