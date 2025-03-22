"use client"

import { ChartContainer, ChartTooltip, ChartLegend } from "@/presentation/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Mock data for charts
const enrollmentData = [
  { month: "Jan", count: 1200 },
  { month: "Fév", count: 1900 },
  { month: "Mar", count: 3000 },
  { month: "Avr", count: 2800 },
  { month: "Mai", count: 2500 },
  { month: "Juin", count: 3500 },
  { month: "Juil", count: 2100 },
  { month: "Août", count: 1500 },
  { month: "Sep", count: 4500 },
  { month: "Oct", count: 3800 },
  { month: "Nov", count: 2900 },
  { month: "Déc", count: 2300 },
]

const distributionData = [
  { name: "Sciences", value: 35 },
  { name: "Droit", value: 20 },
  { name: "Médecine", value: 15 },
  { name: "Lettres", value: 10 },
  { name: "Économie", value: 20 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

interface DashboardChartProps {
  type: "enrollments" | "distribution"
}

export function DashboardChart({ type }: DashboardChartProps) {
  if (type === "enrollments") {
    return (
      <ChartContainer>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  if (type === "distribution") {
    return (
      <ChartContainer>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip />
          </PieChart>
        </ResponsiveContainer>
        <ChartLegend />
      </ChartContainer>
    )
  }

  return null
}

