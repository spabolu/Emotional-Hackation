"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Heart } from "lucide-react"

export default function GratitudeTracker() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [dailyMessage, setDailyMessage] = useState('');

  // Hardcoded array of positive questions
  const positiveQuestions = [
    'Tell me something good that happened today.',
    'What made you smile today?',
    'What is one thing you are grateful for right now?',
    'What is a small victory you achieved today?',
    'Who is someone you appreciate and why?',
    'What is a positive memory from today?',
    'What is something you are looking forward to?',
    'What is one thing you love about yourself?',
    'What is a kind act you witnessed or performed today?',
    'What is something that made you laugh today?',
    'What is a challenge you overcame recently?',
    'What is a place that makes you feel happy or calm?',
    'What is a skill or talent you are proud of?',
    'What is something you learned today?',
    'What is a goal you are excited to work on?',
    'What is a favorite moment from your week so far?',
    'What is something beautiful you noticed today?',
    'What is a way you showed kindness to yourself today?',
    'What is something you are proud of accomplishing?',
    'What is a favorite activity that brings you joy?',
  ];

  useEffect(() => {
    // Select a random positive question
    const randomQuestion =
      positiveQuestions[Math.floor(Math.random() * positiveQuestions.length)];
    setDailyMessage(randomQuestion);
  }, []);

  useEffect(() => {
    const savedEntries = localStorage.getItem('gratitudeEntries');
    if (savedEntries) {
      setEntries(
        JSON.parse(savedEntries).map((entry) => ({
          ...entry,
          date: new Date(entry.date),
        }))
      );
    }
  }, []);

  const addEntry = () => {
    if (!newEntry.trim()) return;

    const entry = {
      id: Date.now().toString(),
      text: newEntry,
      date: new Date(),
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('gratitudeEntries', JSON.stringify(updatedEntries));
    setNewEntry('');
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('gratitudeEntries', JSON.stringify(updatedEntries));
  };

  return (
    <Card className="border-teal-200 bg-white/80">
      <CardHeader>
        <CardTitle>Gratitude Journal</CardTitle>
        <CardDescription>{dailyMessage}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="I'm grateful for..."
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
          />
          <Button onClick={addEntry} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Start adding things you're grateful for today!
            </p>
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
                  <span className="text-xs text-muted-foreground">
                    {entry.date.toLocaleDateString()}
                  </span>
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
  );
}