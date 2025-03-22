"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartLegend, ChartTitle } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Mock data for statistics
const enrollmentData = [
  { name: "Sciences", value: 35000 },
  { name: "Droit", value: 25000 },
  { name: "Médecine", value: 18000 },
  { name: "Lettres", value: 22000 },
  { name: "Économie", value: 30000 },
]

const regionData = [
  { name: "Île-de-France", value: 120 },
  { name: "Auvergne-Rhône-Alpes", value: 85 },
  { name: "Nouvelle-Aquitaine", value: 65 },
  { name: "Occitanie", value: 60 },
  { name: "Hauts-de-France", value: 55 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function Stats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
        <CardDescription>Chiffres clés de l'enseignement supérieur</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="enrollment">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enrollment">Étudiants par domaine</TabsTrigger>
            <TabsTrigger value="regions">Établissements par région</TabsTrigger>
          </TabsList>
          <TabsContent value="enrollment" className="h-[300px] mt-4">
            <ChartContainer>
              <ChartTitle>Répartition des étudiants par domaine d'études</ChartTitle>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={enrollmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {enrollmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
              <ChartLegend />
            </ChartContainer>
          </TabsContent>
          <TabsContent value="regions" className="h-[300px] mt-4">
            <ChartContainer>
              <ChartTitle>Nombre d'établissements par région</ChartTitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={regionData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <ChartTooltip />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

