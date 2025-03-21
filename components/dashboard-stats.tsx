import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Building, GraduationCap, Users, UserPlus } from "lucide-react"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Établissements</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,248</div>
          <p className="text-xs text-muted-foreground">+12 depuis le mois dernier</p>
          <div className="mt-4 h-1 w-full rounded-full bg-muted">
            <div className="h-1 w-[75%] rounded-full bg-primary"></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Formations</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12,546</div>
          <p className="text-xs text-muted-foreground">+124 depuis le mois dernier</p>
          <div className="mt-4 h-1 w-full rounded-full bg-muted">
            <div className="h-1 w-[65%] rounded-full bg-primary"></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45,623</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">+12.5%</span>
            <span className="ml-1">depuis le mois dernier</span>
          </div>
          <div className="mt-4 h-1 w-full rounded-full bg-muted">
            <div className="h-1 w-[85%] rounded-full bg-primary"></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nouveaux inscrits</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,893</div>
          <p className="text-xs text-muted-foreground">+10.2% depuis la semaine dernière</p>
          <div className="mt-4 h-1 w-full rounded-full bg-muted">
            <div className="h-1 w-[45%] rounded-full bg-primary"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

