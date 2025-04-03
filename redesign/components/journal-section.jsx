import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import JournalEntryList from "@/components/journal-entry-list"

export default function JournalSection() {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-fuchsia-900">Your Journal</h2>
          <p className="text-emerald-800">A safe space for your thoughts, reflections, and personal growth.</p>
        </div>
        <Button className="bg-fuchsia-600 hover:bg-fuchsia-700">
          <Plus className="mr-2 h-4 w-4" /> New Entry
        </Button>
      </div>

      <Card className="bg-white/80 backdrop-blur border-emerald-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-fuchsia-900">Journal Entries</CardTitle>
          <CardDescription className="text-emerald-700">Your personal reflections and thoughts</CardDescription>
        </CardHeader>
        <CardContent>
          <JournalEntryList />
        </CardContent>
      </Card>
    </div>
  )
}

