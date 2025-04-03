import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MoodCalendar from "@/components/mood-calendar"
import MoodCheckIn from "@/components/mood-check-in"

export default function MoodSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 bg-white/80 backdrop-blur border-emerald-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-fuchsia-900">Today's Check-in</CardTitle>
          <CardDescription className="text-emerald-700">How are you feeling today?</CardDescription>
        </CardHeader>
        <CardContent>
          <MoodCheckIn />
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur border-emerald-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-fuchsia-900">Mood Calendar</CardTitle>
            <CardDescription className="text-emerald-700">Your emotional journey</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-emerald-800 font-medium mb-2">April 2025</div>
          <MoodCalendar />
        </CardContent>
      </Card>
    </div>
  )
}

