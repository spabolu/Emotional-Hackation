import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MoodTracker from '@/components/mood-tracker';
import Journal from '@/components/journal';
import AiTherapist from '@/components/ai-therapist';
import StreakCounter from '@/components/streak-counter';
import { UserNav } from '@/components/user-nav';
// import MoodCalendar from '@/components/mood-calendar';
import { Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100">
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between pl-4">
          <h1 className="text-2xl font-bold text-teal-700">MindfulMe</h1>
          <UserNav />
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pl-4">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold tracking-tight text-teal-900">
              Welcome back!
            </h2>
            <p className="text-muted-foreground">
              Track your emotional journey and build healthy habits.
            </p>
          </div>
          <StreakCounter />
        </div>

        <Tabs defaultValue="check-in" className="space-y-4 pl-4">
          <TabsList className="grid w-full grid-cols-4 justify-center">
            <TabsTrigger value="check-in" className="text-center">
              Check-In
            </TabsTrigger>
            <TabsTrigger value="journal" className="text-center">
              Journal
            </TabsTrigger>
            <TabsTrigger value="discover" className="text-center">
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="check-in" className="space-y-4">
            <MoodTracker />
          </TabsContent>

          <TabsContent value="journal" className="space-y-4">
            <Journal />
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            <AiTherapist />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
