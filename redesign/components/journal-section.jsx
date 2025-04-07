"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JournalEntryList from "@/components/journal-entry-list";
import NewJournalEntry from "@/components/new-journal-entry";

export default function JournalSection() {
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-fuchsia-900">
            Your Journal
          </h2>
          <p className="text-emerald-800">
            A safe space for your thoughts, reflections, and personal growth.
          </p>
        </div>
        <Button
          className="bg-fuchsia-600 hover:bg-fuchsia-700 cursor-pointer text-white"
          onClick={() => setIsNewEntryOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New Entry
        </Button>
      </div>

      <div className="flex items-center justify-between bg-white/80 backdrop-blur border-emerald-200 shadow-sm mb-6 p-4 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold text-fuchsia-900">
            Mental Health Resources
          </h3>
          <p className="text-sm text-emerald-700">
            Explore ASU's mental health resources for additional support.
          </p>
        </div>
        <Button
          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white ml-4"
          onClick={() =>
            window.open(  
              'https://eoss.asu.edu/counseling/mental-health-resources',
              '_blank'
            )
          }
        >
          Visit Resources
        </Button>
      </div>

      <Card className="bg-white/80 backdrop-blur border-emerald-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-fuchsia-900">
            Journal Entries
          </CardTitle>
          <CardDescription className="text-emerald-700">
            Your personal reflections and thoughts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JournalEntryList />
        </CardContent>
      </Card>

      {isNewEntryOpen && (
        <NewJournalEntry onClose={() => setIsNewEntryOpen(false)} />
      )}
    </div>
  );
}