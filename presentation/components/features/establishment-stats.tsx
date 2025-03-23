"use client";

import {
    Bar,
    BarChart,
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

import { Card, CardContent } from "@/presentation/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
} from "@/presentation/components/ui/chart";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/presentation/components/ui/tabs";

const enrollmentData = [
    { year: "2019", count: 8500 },
    { year: "2020", count: 9200 },
    { year: "2021", count: 10100 },
    { year: "2022", count: 11300 },
    { year: "2023", count: 12500 },
];

const distributionData = [
    { name: "Licence", value: 60 },
    { name: "Master", value: 30 },
    { name: "Doctorat", value: 10 },
];

const successRateData = [
    { name: "L1", success: 65, dropout: 35 },
    { name: "L2", success: 75, dropout: 25 },
    { name: "L3", success: 85, dropout: 15 },
    { name: "M1", success: 90, dropout: 10 },
    { name: "M2", success: 95, dropout: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface EstablishmentStatsProps {
    establishmentId: string;
}

export function EstablishmentStats({
    establishmentId,
}: EstablishmentStatsProps) {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="enrollment">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="enrollment">
                        Évolution des effectifs
                    </TabsTrigger>
                    <TabsTrigger value="distribution">
                        Répartition par niveau
                    </TabsTrigger>
                    <TabsTrigger value="success">Taux de réussite</TabsTrigger>
                </TabsList>

                <TabsContent className="mt-4" value="enrollment">
                    <Card>
                        <CardContent className="pt-6">
                            <ChartContainer>
                                <ResponsiveContainer height={300} width="100%">
                                    <LineChart data={enrollmentData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" />
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

                            <div className="text-muted-foreground mt-4 text-sm">
                                <p>
                                    L'établissement a connu une croissance
                                    constante de ses effectifs étudiants au
                                    cours des 5 dernières années, avec une
                                    augmentation moyenne de 10% par an.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent className="mt-4" value="distribution">
                    <Card>
                        <CardContent className="pt-6">
                            <ChartContainer>
                                <ResponsiveContainer height={300} width="100%">
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
                                            outerRadius={100}
                                        >
                                            {distributionData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <ChartTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>

                            <div className="text-muted-foreground mt-4 text-sm">
                                <p>
                                    La majorité des étudiants (60%) sont
                                    inscrits en Licence, suivis par les
                                    étudiants en Master (30%) et en Doctorat
                                    (10%).
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent className="mt-4" value="success">
                    <Card>
                        <CardContent className="pt-6">
                            <ChartContainer>
                                <ResponsiveContainer height={300} width="100%">
                                    <BarChart data={successRateData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <ChartTooltip />
                                        <Bar
                                            dataKey="success"
                                            fill="var(--primary)"
                                            name="Taux de réussite (%)"
                                        />
                                        <Bar
                                            dataKey="dropout"
                                            fill="var(--muted)"
                                            name="Taux d'abandon (%)"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>

                            <div className="text-muted-foreground mt-4 text-sm">
                                <p>
                                    Les taux de réussite augmentent
                                    progressivement avec le niveau d'études,
                                    atteignant 95% en Master 2. Le taux
                                    d'abandon est plus élevé en première année
                                    de Licence (35%).
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-4 text-center">
                        <h3 className="text-primary text-2xl font-bold">
                            48 000
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Étudiants inscrits
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <h3 className="text-primary text-2xl font-bold">350</h3>
                        <p className="text-muted-foreground text-sm">
                            Formations proposées
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <h3 className="text-primary text-2xl font-bold">87%</h3>
                        <p className="text-muted-foreground text-sm">
                            Taux d'insertion professionnelle
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
