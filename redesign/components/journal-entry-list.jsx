"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import JournalEntryDetail from "@/components/journal-entry-detail"

export default function JournalEntryList() {
  const [entries, setEntries] = useState([]) // State to store journal entries
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [loading, setLoading] = useState(true) // State for loading
  const [error, setError] = useState(null) // State for error handling

  // Fetch journal entries from the API
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const userId = 1 // Replace with the actual user ID
        const response = await fetch(`http://127.0.0.1:5000/fetch_journals/${userId}`)
        if (!response.ok) {
          throw new Error(`Error fetching journals: ${response.statusText}`)
        }
        const data = await response.json()
        setEntries(data.journals) // Update state with fetched entries
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false) // Stop loading
      }
    }

    fetchEntries()
  }, [])

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

  if (loading) {
    return <p>Loading journal entries...</p>
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }

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
                  <span>{entry.entry_date}</span>
                  <Badge variant="secondary" className={getMoodColor(entry.mood || "neutral")}>
                    {entry.mood || "Neutral"}
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
            <p className="text-emerald-800 mt-2 line-clamp-2">{entry.content}</p>
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