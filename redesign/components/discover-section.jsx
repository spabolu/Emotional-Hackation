import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CommunityFeed from "@/components/community-feed"
import PopularUsers from "@/components/popular-users"

export default function DiscoverSection() {
  return (
    <div>
      <div className="max-w-3xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
          <Input
            placeholder="Search for topics, tags, or users..."
            className="pl-10 bg-white/80 border-fuchsia-200 focus:border-fuchsia-400 focus:ring-fuchsia-400"
          />
        </div>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6 bg-white/60">
          <TabsTrigger
            value="feed"
            className="data-[state=active]:bg-fuchsia-100 data-[state=active]:text-fuchsia-900"
          >
            Community Feed
          </TabsTrigger>
          <TabsTrigger
            value="people"
            className="data-[state=active]:bg-fuchsia-100 data-[state=active]:text-fuchsia-900"
          >
            People to Follow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-0">
          <CommunityFeed />
        </TabsContent>

        <TabsContent value="people" className="mt-0">
          <PopularUsers />
        </TabsContent>
      </Tabs>
    </div>
  )
}

