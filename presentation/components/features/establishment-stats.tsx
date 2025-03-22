"use client"

import { Card, CardContent } from "@/presentation/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs"
import { ChartContainer, ChartTooltip } from "@/presentation/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const enrollmentData = [
  { year: "2019", count: 8500 },
  { year: "2020", count: 9200 },
  { year: "2021", count: 10100 },
  { year: "2022", count: 11300 },
  { year: "2023", count: 12500 },
]

const distributionData = [
  { name: "Licence", value: 60 },
  { name: "Master", value: 30 },
  { name: "Doctorat", value: 10 },
]

const successRateData = [
  { name: "L1", success: 65, dropout: 35 },
  { name: "L2", success: 75, dropout: 25 },
  { name: "L3", success: 85, dropout: 15 },
  { name: "M1", success: 90, dropout: 10 },
  { name: "M2", success: 95, dropout: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

interface EstablishmentStatsProps {
  establishmentId: string
}

export function EstablishmentStats({ establishmentId }: EstablishmentStatsProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="enrollment">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enrollment">Évolution des effectifs</TabsTrigger>
          <TabsTrigger value="distribution">Répartition par niveau</TabsTrigger>
          <TabsTrigger value="success">Taux de réussite</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollment" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ChartContainer>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
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

              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  L'établissement a connu une croissance constante de ses effectifs étudiants au cours des 5 dernières
                  années, avec une augmentation moyenne de 10% par an.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ChartContainer>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
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
              </ChartContainer>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  La majorité des étudiants (60%) sont inscrits en Licence, suivis par les étudiants en Master (30%) et
                  en Doctorat (10%).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="success" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ChartContainer>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={successRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="success" name="Taux de réussite (%)" fill="var(--primary)" />
                    <Bar dataKey="dropout" name="Taux d'abandon (%)" fill="var(--muted)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Les taux de réussite augmentent progressivement avec le niveau d'études, atteignant 95% en Master 2.
                  Le taux d'abandon est plus élevé en première année de Licence (35%).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-primary">48 000</h3>
            <p className="text-sm text-muted-foreground">Étudiants inscrits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-primary">350</h3>
            <p className="text-sm text-muted-foreground">Formations proposées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-primary">87%</h3>
            <p className="text-sm text-muted-foreground">Taux d'insertion professionnelle</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

