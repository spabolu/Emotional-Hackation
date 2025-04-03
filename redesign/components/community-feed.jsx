import { Heart, MessageCircle, Share2, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function CommunityFeed() {
  // Mock data for community posts
  const posts = [
    {
      id: 1,
      user: {
        name: "Emma Wilson",
        username: "mindful_emma",
        avatar: "",
      },
      content:
        "Just completed a 30-day meditation challenge and I'm amazed at how much clearer my thoughts are. Has anyone else experienced significant changes from consistent meditation?",
      likes: 24,
      comments: 8,
      tags: ["meditation", "mindfulness", "30daychallenge"],
    },
    {
      id: 2,
      user: {
        name: "Alex Rivera",
        username: "alex_mindspace",
        avatar: "",
      },
      content:
        "Today's journal prompt: What are three things that brought you joy this week? Sharing mine: 1) Morning walks in the park, 2) Finishing a book I've been reading for months, 3) A heartfelt conversation with an old friend.",
      likes: 42,
      comments: 15,
      tags: ["journalprompt", "gratitude", "reflection"],
    },
    {
      id: 3,
      user: {
        name: "Jordan Taylor",
        username: "calm_jordan",
        avatar: "",
      },
      content:
        "I've been using the mood tracking feature for 2 months now, and it's helped me identify that my anxiety peaks mid-week. Now I can prepare better self-care routines for Wednesdays and Thursdays. Anyone else discover patterns from their mood tracking?",
      likes: 36,
      comments: 12,
      tags: ["moodtracking", "selfcare", "anxiety"],
    },
  ]

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="bg-white/80 backdrop-blur border-emerald-200 shadow-sm">
          <CardHeader className="flex flex-row items-start gap-4 pb-2">
            <Avatar>
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback className="bg-fuchsia-100 text-fuchsia-700">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-fuchsia-900">{post.user.name}</div>
              <div className="text-sm text-emerald-700">@{post.user.username}</div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-emerald-800">{post.content}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-white/80 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-fuchsia-100 pt-4">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-fuchsia-700 hover:bg-fuchsia-100">
                <Heart className="mr-1 h-4 w-4" /> {post.likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-fuchsia-700 hover:bg-fuchsia-100">
                <MessageCircle className="mr-1 h-4 w-4" /> {post.comments}
              </Button>
              <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-fuchsia-700 hover:bg-fuchsia-100">
                <Share2 className="mr-1 h-4 w-4" /> Share
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

