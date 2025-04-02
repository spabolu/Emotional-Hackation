"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Heart } from "lucide-react"

export default function GratitudeTracker() {
  const [entries, setEntries] = useState([])
  const [newEntry, setNewEntry] = useState("")

  useEffect(() => {
    const savedEntries = localStorage.getItem("gratitudeEntries")
    if (savedEntries) {
      setEntries(
        JSON.parse(savedEntries).map((entry) => ({
          ...entry,
          date: new Date(entry.date),
        })),
      )
    }
  }, [])

  const addEntry = () => {
    if (!newEntry.trim()) return

    const entry = {
      id: Date.now().toString(),
      text: newEntry,
      date: new Date(),
    }

    const updatedEntries = [entry, ...entries]
    setEntries(updatedEntries)
    localStorage.setItem("gratitudeEntries", JSON.stringify(updatedEntries))
    setNewEntry("")
  }

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem("gratitudeEntries", JSON.stringify(updatedEntries))
  }

  return (
    <Card className="border-teal-200 bg-white/80">
      <CardHeader>
        <CardTitle>Gratitude Journal</CardTitle>
        <CardDescription>Record things you're grateful for to boost your mood and outlook.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="I'm grateful for..."
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEntry()}
          />
          <Button onClick={addEntry} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Start adding things you're grateful for today!</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-teal-100 bg-white p-3"
              >
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span>{entry.text}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{entry.date.toLocaleDateString()}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEntry(entry.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}