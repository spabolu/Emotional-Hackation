import { User, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PopularUsers() {
  // Mock data for popular users
  const users = [
    {
      id: 1,
      name: "Emma Wilson",
      username: "mindful_emma",
      avatar: "",
      bio: "Meditation teacher & mental health advocate. Sharing daily mindfulness tips and journaling prompts.",
      followers: 1243,
    },
    {
      id: 2,
      name: "Alex Rivera",
      username: "alex_mindspace",
      avatar: "",
      bio: "Psychologist specializing in CBT. I write about emotional intelligence and self-reflection techniques.",
      followers: 986,
    },
    {
      id: 3,
      name: "Jordan Taylor",
      username: "calm_jordan",
      avatar: "",
      bio: "Anxiety warrior sharing my journey through journaling and mood tracking. 365-day streak and counting!",
      followers: 754,
    },
    {
      id: 4,
      name: "Sam Johnson",
      username: "mindful_sam",
      avatar: "",
      bio: "Wellness coach and author. I believe in the power of daily reflection and gratitude practices.",
      followers: 1892,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="bg-white/80 backdrop-blur border-emerald-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border border-fuchsia-200">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-fuchsia-100 text-fuchsia-700">
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-fuchsia-900">{user.name}</div>
                    <div className="text-sm text-emerald-700">@{user.username}</div>
                  </div>
                  <Button size="sm" className="bg-fuchsia-600 hover:bg-fuchsia-700">
                    <UserPlus className="mr-1 h-4 w-4" /> Follow
                  </Button>
                </div>
                <p className="text-emerald-800 text-sm mt-2">{user.bio}</p>
                <div className="text-sm text-emerald-700 mt-2">
                  <span className="font-medium text-fuchsia-900">{user.followers.toLocaleString()}</span> followers
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

