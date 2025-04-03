"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MoodCalendar from "@/components/mood-calendar";
import MoodCheckIn from "@/components/mood-check-in";
import { format, parseISO } from "date-fns";

export default function MoodSection() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const prevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);

    // If selected date is in a different month, update the calendar view
    const newMonth = parseISO(dateStr);
    if (
      newMonth.getMonth() !== currentMonth.getMonth() ||
      newMonth.getFullYear() !== currentMonth.getFullYear()
    ) {
      setCurrentMonth(newMonth);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 bg-white/80 backdrop-blur border-emerald-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-fuchsia-900">
            {selectedDate === format(new Date(), "yyyy-MM-dd")
              ? "Today's Check-in"
              : `Mood for ${format(parseISO(selectedDate), "MMMM d, yyyy")}`}
          </CardTitle>
          <CardDescription className="text-emerald-700">
            {selectedDate === format(new Date(), "yyyy-MM-dd")
              ? "How are you feeling today?"
              : "Record your mood for a specific date"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MoodCheckIn
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur border-emerald-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-fuchsia-900">
              Mood Calendar
            </CardTitle>
            <CardDescription className="text-emerald-700">
              Select any date to update its mood
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <MoodCalendar onDateSelect={handleDateSelect} />
        </CardContent>
      </Card>
    </div>
  );
}
