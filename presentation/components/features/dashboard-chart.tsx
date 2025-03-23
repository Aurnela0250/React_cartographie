"use client";

import {
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartTooltip,
} from "@/presentation/components/ui/chart";

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
];

const distributionData = [
    { name: "Sciences", value: 35 },
    { name: "Droit", value: 20 },
    { name: "Médecine", value: 15 },
    { name: "Lettres", value: 10 },
    { name: "Économie", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface DashboardChartProps {
    type: "enrollments" | "distribution";
}

export function DashboardChart({ type }: DashboardChartProps) {
    if (type === "enrollments") {
        return (
            <ChartContainer>
                <ResponsiveContainer height={250} width="100%">
                    <LineChart data={enrollmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip />
                        <Line
                            activeDot={{ r: 6 }}
                            dataKey="count"
                            dot={{ r: 4 }}
                            stroke="var(--primary)"
                            strokeWidth={2}
                            type="monotone"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        );
    }

    if (type === "distribution") {
        return (
            <ChartContainer>
                <ResponsiveContainer height={250} width="100%">
                    <PieChart>
                        <Pie
                            cx="50%"
                            cy="50%"
                            data={distributionData}
                            dataKey="value"
                            fill="#8884d8"
                            label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                            outerRadius={80}
                        >
                            {distributionData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <ChartTooltip />
                    </PieChart>
                </ResponsiveContainer>
                <ChartLegend />
            </ChartContainer>
        );
    }

    return null;
}
