"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState(null)

  const moods = [
    { name: "Happy", emoji: "😊" },
    { name: "Sad", emoji: "😔" },
    { name: "Neutral", emoji: "😐" },
    { name: "Excited", emoji: "😃" },
    { name: "Anxious", emoji: "😰" },
    { name: "Relaxed", emoji: "😌" },
    { name: "Tired", emoji: "😴" },
    { name: "Grateful", emoji: "🙏" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-fuchsia-900 mb-2">Select your mood</h3>
        <p className="text-emerald-700">How are you feeling right now?</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {moods.map((mood) => (
          <Button
            key={mood.name}
            variant="outline"
            className={`flex flex-col h-auto py-3 ${
              selectedMood === mood.name ? "bg-fuchsia-100 border-fuchsia-400" : "bg-white/60 hover:bg-fuchsia-50"
            }`}
            onClick={() => setSelectedMood(mood.name)}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span className="text-xs">{mood.name}</span>
          </Button>
        ))}
      </div>

      <Card className="p-4 bg-white/60 border-fuchsia-200">
        <h3 className="text-md font-medium text-fuchsia-900 mb-2">What's contributing to your mood?</h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Share your thoughts and feelings..."
            className="resize-none bg-white/80 border-fuchsia-200 focus:border-fuchsia-400 focus:ring-fuchsia-400"
            rows={4}
          />

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-emerald-800">Activities today (optional)</h4>
            <div className="flex flex-wrap gap-2">
              {["Exercise", "Meditation", "Reading", "Work", "Social", "Nature", "Rest", "Creative"].map((activity) => (
                <Button
                  key={activity}
                  variant="outline"
                  size="sm"
                  className="bg-white/60 text-emerald-700 hover:bg-fuchsia-50 hover:text-fuchsia-700"
                >
                  {activity}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Button className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 py-6">Submit Check-in</Button>
    </div>
  )
}

