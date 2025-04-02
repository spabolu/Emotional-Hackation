"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Save, CalendarIcon, FileText } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type JournalEntry = {
  id: string
  title: string
  content: string
  date: Date
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<JournalEntry>({
    id: Date.now().toString(),
    title: "",
    content: "",
    date: new Date(),
  })
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries")
    if (savedEntries) {
      setEntries(
        JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        })),
      )
    }

    // Check if there's an entry for the selected date
    const todayEntry = findEntryForDate(selectedDate)
    if (todayEntry) {
      setCurrentEntry(todayEntry)
    } else {
      setCurrentEntry({
        id: Date.now().toString(),
        title: "",
        content: "",
        date: selectedDate,
      })
    }
  }, [selectedDate])

  const findEntryForDate = (date: Date): JournalEntry | undefined => {
    return entries.find((entry) => entry.date.toDateString() === date.toDateString())
  }

  const saveEntry = () => {
    if (!currentEntry.content.trim()) return

    const newEntries = [...entries]
    const existingEntryIndex = newEntries.findIndex(
      (entry) => entry.date.toDateString() === currentEntry.date.toDateString(),
    )

    if (existingEntryIndex >= 0) {
      newEntries[existingEntryIndex] = currentEntry
    } else {
      newEntries.push(currentEntry)
    }

    setEntries(newEntries)
    localStorage.setItem("journalEntries", JSON.stringify(newEntries))
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
  }

  return (
    <Card className="border-teal-200 bg-white/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Journal</CardTitle>
          <CardDescription>Write about your day, thoughts, and feelings.</CardDescription>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              modifiers={{
                booked: entries.map((entry) => entry.date),
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: "bold",
                },
              }}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Entry title"
          value={currentEntry.title}
          onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
          className="text-lg font-medium"
        />
        <Textarea
          placeholder="Write your thoughts here..."
          className="min-h-[300px] resize-none"
          value={currentEntry.content}
          onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          <FileText className="mr-1 inline-block h-4 w-4" />
          {entries.length} {entries.length === 1 ? "entry" : "entries"} total
        </div>
        <Button onClick={saveEntry} className="bg-teal-600 hover:bg-teal-700" disabled={!currentEntry.content.trim()}>
          <Save className="mr-2 h-4 w-4" />
          Save Entry
        </Button>
      </CardFooter>
    </Card>
  )
}

