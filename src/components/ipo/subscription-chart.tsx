"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export function SubscriptionChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-muted-foreground">No subscription data available yet.</div>;
  }

  // Get the latest subscription record
  const latest = data[data.length - 1];

  const chartData = [
    { name: "QIB", value: latest.qib || 0 },
    { name: "NII", value: latest.nii || 0 },
    { name: "Retail", value: latest.retail || 0 },
    { name: "Employee", value: latest.employee || 0 },
  ];

  return (
    <div className="h-[250px] w-full mt-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium">Total Subscription</span>
        <span className="text-2xl font-bold text-primary">{latest.total || 0}x</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}x`}
          />
          <Tooltip 
            cursor={{ fill: "rgba(0,0,0,0.1)" }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar 
            dataKey="value" 
            fill="currentColor" 
            className="fill-primary"
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
