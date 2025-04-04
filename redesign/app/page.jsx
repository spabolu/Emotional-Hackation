"use client";

import { CalendarCheck, BookOpen, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import StreakCounter from "@/components/streak-counter";
import MoodSection from "@/components/mood-section";
import JournalSection from "@/components/journal-section";
import DiscoverSection from "@/components/discover-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-100 to-emerald-100 mx-auto">
      <Navbar />
      <main className="px-4 py-12">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-fuchsia-900">
            Welcome to MindfulMe
          </h1>
          <p className="text-xl text-emerald-800 max-w-2xl">
            Your safe space to reflect, track your mood, and connect with others
            on their mindfulness journey.
          </p>
          <StreakCounter />
        </div>

        <Tabs defaultValue="mood" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/60">
            <TabsTrigger
              value="mood"
              className="flex items-center gap-2 data-[state=active]:bg-fuchsia-100 data-[state=active]:text-fuchsia-900 cursor-pointer"
            >
              <CalendarCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Mood Tracking</span>
              <span className="sm:hidden">Mood</span>
            </TabsTrigger>
            <TabsTrigger
              value="journal"
              className="flex items-center gap-2 data-[state=active]:bg-fuchsia-100 data-[state=active]:text-fuchsia-900 cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span>Journal</span>
            </TabsTrigger>
            <TabsTrigger
              value="discover"
              className="flex items-center gap-2 data-[state=active]:bg-fuchsia-100 data-[state=active]:text-fuchsia-900 cursor-pointer"
            >
              <Users className="h-4 w-4" />
              <span>Discover</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="mt-0">
            <MoodSection />
          </TabsContent>

          <TabsContent value="journal" className="mt-0">
            <JournalSection />
          </TabsContent>

          <TabsContent value="discover" className="mt-0">
            <DiscoverSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
