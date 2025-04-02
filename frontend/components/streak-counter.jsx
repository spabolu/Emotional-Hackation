"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Flame } from "lucide-react"

export default function StreakCounter() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // In a real app, this would be fetched from a database
    const savedStreak = localStorage.getItem("streak")
    const lastVisit = localStorage.getItem("lastVisit")
    const today = new Date().toDateString()

    if (savedStreak) {
      const streakCount = Number.parseInt(savedStreak, 10)

      if (lastVisit === today) {
        // Already visited today
        setStreak(streakCount)
      } else if (lastVisit === new Date(Date.now() - 86400000).toDateString()) {
        // Visited yesterday, increment streak
        const newStreak = streakCount + 1
        setStreak(newStreak)
        localStorage.setItem("streak", newStreak.toString())
        localStorage.setItem("lastVisit", today)
      } else if (lastVisit) {
        // Missed a day, reset streak
        setStreak(1)
        localStorage.setItem("streak", "1")
        localStorage.setItem("lastVisit", today)
      }
    } else {
      // First visit
      setStreak(1)
      localStorage.setItem("streak", "1")
      localStorage.setItem("lastVisit", today)
    }
  }, [])

  return (
    <Card className="border-teal-200 bg-white/50 backdrop-blur-sm">
      <CardContent className="flex items-center gap-2 p-4">
        <Flame className="h-5 w-5 text-orange-500" />
        <div>
          <p className="text-sm font-medium">Current Streak</p>
          <p className="text-2xl font-bold">
            {streak} {streak === 1 ? "day" : "days"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}