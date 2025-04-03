"use client"

import { useState } from "react"
import { CalendarIcon, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import JournalEntryDetail from "@/components/journal-entry-detail"

export default function JournalEntryList() {
  const [selectedEntryId, setSelectedEntryId] = useState(null)

  // Mock data for journal entries
  const entries = [
    {
      id: 1,
      title: "Finding peace in daily routines",
      excerpt:
        "Today I realized how much comfort I find in my morning routine. The simple act of brewing tea and watching the sunrise has become a sacred ritual that grounds me for the day ahead.",
      content:
        "Today I realized how much comfort I find in my morning routine. The simple act of brewing tea and watching the sunrise has become a sacred ritual that grounds me for the day ahead.\n\nThere's something magical about those quiet moments before the world wakes up. I've been feeling overwhelmed lately with work deadlines and social obligations, but this morning ritual has been my anchor. It's a small act of self-care that reminds me to breathe and be present.\n\nI want to explore more mindful routines I can incorporate throughout my day. Maybe a short meditation during lunch break or a brief walk outside before dinner. These small moments of peace might be the key to maintaining balance.",
      date: "April 2, 2025",
      mood: "Grateful",
      tags: ["reflection", "mindfulness", "routine"],
    },
    {
      id: 2,
      title: "Overcoming challenges at work",
      excerpt:
        "The project deadline is approaching and I've been feeling the pressure. Today I implemented a new strategy to break down the work into smaller tasks, which has helped reduce my anxiety.",
      content:
        "The project deadline is approaching and I've been feeling the pressure. Today I implemented a new strategy to break down the work into smaller tasks, which has helped reduce my anxiety.\n\nInstead of looking at the entire project as one overwhelming mountain to climb, I've created a list of small, manageable steps. Each completed task gives me a sense of accomplishment and progress. I've also started using the Pomodoro technique - 25 minutes of focused work followed by a 5-minute break.\n\nMy colleague noticed I seemed calmer today and asked what changed. Explaining my approach to her actually helped me articulate why it was working for me. Sometimes just talking about our strategies makes them more concrete and effective.\n\nI still have concerns about meeting the deadline, but I feel more in control now. Tomorrow I'll continue with this approach and see if I can make even more progress.",
      date: "March 30, 2025",
      mood: "Anxious",
      tags: ["work", "stress-management", "productivity"],
    },
    {
      id: 3,
      title: "Weekend hike reflections",
      excerpt:
        "Spent the day hiking at the national park. The fresh air and connection with nature was exactly what I needed to reset my mind and gain perspective on recent events.",
      content:
        "Spent the day hiking at the national park. The fresh air and connection with nature was exactly what I needed to reset my mind and gain perspective on recent events.\n\nThe trail was challenging in parts, but each difficult section rewarded me with an incredible view. It made me think about how life's challenges often work the same way - we struggle through difficult periods but emerge with new perspectives and strengths.\n\nI took some time at the summit to just sit and breathe. No phone, no distractions, just being present with the landscape around me. I felt so small against the backdrop of the mountains, but in a comforting way. My problems seemed to shrink in proportion.\n\nI want to make these nature excursions a regular part of my routine. Maybe once every two weeks I can explore a new trail or revisit a favorite one. The physical exercise combined with the mental clarity is such a powerful combination.",
      date: "March 28, 2025",
      mood: "Happy",
      tags: ["nature", "exercise", "mindfulness"],
    },
    {
      id: 4,
      title: "Late night thoughts",
      excerpt:
        "Couldn't sleep tonight as my mind kept racing with ideas for the upcoming presentation. Decided to journal instead of fighting insomnia, and ended up with some great insights.",
      content:
        "Couldn't sleep tonight as my mind kept racing with ideas for the upcoming presentation. Decided to journal instead of fighting insomnia, and ended up with some great insights.\n\nIt's 2:30 AM and I've been tossing and turning for hours. Rather than continuing to fight it, I decided to get up and channel this mental energy into something productive. As I started writing down my thoughts about the presentation, connections started forming that I hadn't seen before.\n\nThere's something about the quiet of night that seems to unlock a different kind of thinking. Without the distractions of the day, my mind can wander and make unexpected associations. I've outlined a completely new approach to the presentation that feels much stronger than my original concept.\n\nI'm going to be tired tomorrow, but I think it will be worth it. Sometimes insomnia can be a gift if we use it right. I'll review these notes in the morning and see if they still make sense in the light of day.",
      date: "March 25, 2025",
      mood: "Tired",
      tags: ["insomnia", "creativity", "work"],
    },
  ]

  const getMoodColor = (mood) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "sad":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "neutral":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      case "excited":
        return "bg-pink-100 text-pink-800 hover:bg-pink-200"
      case "anxious":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "relaxed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "tired":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      case "grateful":
        return "bg-teal-100 text-teal-800 hover:bg-teal-200"
      default:
        return "bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200"
    }
  }

  const openEntry = (id) => {
    setSelectedEntryId(id)
  }

  const navigateToEntry = (id) => {
    setSelectedEntryId(id)
  }

  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId)

  return (
    <>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            className="border border-fuchsia-200 rounded-lg p-4 bg-white/60 hover:bg-white/90 transition-colors cursor-pointer"
            onClick={() => openEntry(entry.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-fuchsia-900">{entry.title}</h3>
                <div className="flex items-center gap-2 text-sm text-emerald-700 mt-1">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{entry.date}</span>
                  <Badge variant="secondary" className={getMoodColor(entry.mood)}>
                    {entry.mood}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-emerald-700 hover:text-fuchsia-700 hover:bg-fuchsia-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-emerald-800 mt-2 line-clamp-2">{entry.excerpt}</p>
            <div className="flex gap-2 mt-3">
              {entry.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-white/80 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedEntry && (
        <JournalEntryDetail
          entry={selectedEntry}
          entries={entries}
          onClose={() => setSelectedEntryId(null)}
          getMoodColor={getMoodColor}
          onNavigate={navigateToEntry}
        />
      )}
    </>
  )
}

