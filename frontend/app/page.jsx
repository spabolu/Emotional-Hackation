import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MoodTracker from "@/components/mood-tracker"
import GratitudeTracker from "@/components/gratitude-tracker"
import Journal from "@/components/journal"
import AiTherapist from "@/components/ai-therapist"
import StreakCounter from "@/components/streak-counter"
import { UserNav } from "@/components/user-nav"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100">
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold text-teal-700">MindfulMe</h1>
          <UserNav />
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-teal-900">Welcome back!</h2>
            <p className="text-muted-foreground">Track your emotional journey and build healthy habits.</p>
          </div>
          <StreakCounter />
        </div>

        <Tabs defaultValue="mood" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mood">Mood</TabsTrigger>
            <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="therapist">AI Therapist</TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="space-y-4">
            <MoodTracker />
          </TabsContent>

          <TabsContent value="gratitude" className="space-y-4">
            <GratitudeTracker />
          </TabsContent>

          <TabsContent value="journal" className="space-y-4">
            <Journal />
          </TabsContent>

          <TabsContent value="therapist" className="space-y-4">
            <AiTherapist />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}