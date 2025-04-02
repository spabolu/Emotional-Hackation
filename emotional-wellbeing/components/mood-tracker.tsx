"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

type Mood = "great" | "good" | "okay" | "bad" | "awful" | null
type MoodEntry = {
  date: Date
  mood: Mood
  note: string
}

const MOOD_EMOJIS: Record<string, { emoji: string; color: string }> = {
  great: { emoji: "😄", color: "bg-green-100 hover:bg-green-200" },
  good: { emoji: "🙂", color: "bg-teal-100 hover:bg-teal-200" },
  okay: { emoji: "😐", color: "bg-yellow-100 hover:bg-yellow-200" },
  bad: { emoji: "😔", color: "bg-orange-100 hover:bg-orange-200" },
  awful: { emoji: "😢", color: "bg-red-100 hover:bg-red-200" },
}

export default function MoodTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedMood, setSelectedMood] = useState<Mood>(null)
  const [note, setNote] = useState("")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])

  useEffect(() => {
    const savedEntries = localStorage.getItem("moodEntries")
    if (savedEntries) {
      setMoodEntries(
        JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        })),
      )
    }

    // Check if there's an entry for the selected date
    const todayEntry = findEntryForDate(selectedDate)
    if (todayEntry) {
      setSelectedMood(todayEntry.mood)
      setNote(todayEntry.note)
    } else {
      setSelectedMood(null)
      setNote("")
    }
  }, [selectedDate])

  const findEntryForDate = (date: Date): MoodEntry | undefined => {
    return moodEntries.find((entry) => entry.date.toDateString() === date.toDateString())
  }

  const saveMoodEntry = () => {
    if (!selectedMood) return

    const newEntries = [...moodEntries]
    const existingEntryIndex = newEntries.findIndex(
      (entry) => entry.date.toDateString() === selectedDate.toDateString(),
    )

    if (existingEntryIndex >= 0) {
      newEntries[existingEntryIndex] = {
        date: selectedDate,
        mood: selectedMood,
        note,
      }
    } else {
      newEntries.push({
        date: selectedDate,
        mood: selectedMood,
        note,
      })
    }

    setMoodEntries(newEntries)
    localStorage.setItem("moodEntries", JSON.stringify(newEntries))
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-teal-200 bg-white/80">
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
          <CardDescription>Track your mood to identify patterns over time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            {Object.entries(MOOD_EMOJIS).map(([mood, { emoji, color }]) => (
              <Button
                key={mood}
                variant="outline"
                className={cn(
                  "h-12 w-12 rounded-full text-2xl",
                  color,
                  selectedMood === mood && "ring-2 ring-teal-500 ring-offset-2",
                )}
                onClick={() => setSelectedMood(mood as Mood)}
              >
                {emoji}
              </Button>
            ))}
          </div>

          <Textarea
            placeholder="Add a note about how you're feeling..."
            className="min-h-[100px] resize-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={saveMoodEntry} disabled={!selectedMood}>
            Save Mood
          </Button>
        </CardContent>
      </Card>

      <Card className="border-teal-200 bg-white/80">
        <CardHeader>
          <CardTitle>Mood Calendar</CardTitle>
          <CardDescription>View your mood history and patterns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            modifiers={{
              booked: moodEntries.map((entry) => entry.date),
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
              },
            }}
            components={{
              DayContent: ({ day }) => {
                // Make sure day and day.date exist before trying to use them
                if (!day || !day.date) {
                  return <div className="flex h-full w-full items-center justify-center">{day?.day || ""}</div>
                }

                const entry = moodEntries.find((e) => e.date.toDateString() === day.date.toDateString())

                return (
                  <div className="flex h-full w-full items-center justify-center">
                    {entry ? <span>{MOOD_EMOJIS[entry.mood].emoji}</span> : day.date.getDate()}
                  </div>
                )
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

