import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for recent activity
const activities = [
  {
    id: "1",
    user: {
      name: "Sophie Randria",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Admin",
    },
    action: "a ajouté un nouvel établissement",
    target: "INSCAE",
    time: "Il y a 10 minutes",
  },
  {
    id: "2",
    user: {
      name: "Thomas ESMIA",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Admin Établissement",
    },
    action: "a mis à jour les informations de",
    target: "ESMIA",
    time: "Il y a 45 minutes",
  },
  {
    id: "3",
    user: {
      name: "Emma IEP",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "SuperAdmin",
    },
    action: "a ajouté un nouvel utilisateur",
    target: "Aurnela RAKOTO",
    time: "Il y a 2 heures",
  },
  {
    id: "4",
    user: {
      name: "Lucas Andria",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Admin Établissement",
    },
    action: "a ajouté une nouvelle formation",
    target: "Master en Gestion de Projet",
    time: "Il y a 3 heures",
  },
  {
    id: "5",
    user: {
      name: "Julie Rasoa",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Admin",
    },
    action: "a modifié les permissions de",
    target: "3 utilisateurs",
    time: "Il y a 5 heures",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{activity.user.name}</span>
              <Badge variant="outline" className="text-xs">
                {activity.user.role}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {activity.action} <span className="font-medium text-foreground">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

