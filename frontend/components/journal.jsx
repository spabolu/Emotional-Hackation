'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Save, CalendarIcon, FileText } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import AiTherapist from '@/components/ai-therapist'; // Import AiTherapist

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    id: Date.now().toString(),
    title: '',
    content: '',
    date: new Date(),
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAiTherapist, setShowAiTherapist] = useState(false); // State to control AI Therapist visibility
  const [threadId, setThreadId] = useState(''); // Added to track the thread ID

  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(
        JSON.parse(savedEntries).map((entry) => ({
          ...entry,
          date: new Date(entry.date),
        }))
      );
    }

    // Check if there's an entry for the selected date
    const todayEntry = findEntryForDate(selectedDate);
    if (todayEntry) {
      setCurrentEntry(todayEntry);
    } else {
      setCurrentEntry({
        id: Date.now().toString(),
        title: '',
        content: '',
        date: selectedDate,
      });
    }
  }, [selectedDate]);

  const findEntryForDate = (date) => {
    return entries.find(
      (entry) => entry.date.toDateString() === date.toDateString()
    );
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const saveEntry = async () => {
    if (!currentEntry.content.trim()) return;

    const newEntries = [...entries];
    const existingEntryIndex = newEntries.findIndex(
      (entry) => entry.date.toDateString() === currentEntry.date.toDateString()
    );

    if (existingEntryIndex >= 0) {
      newEntries[existingEntryIndex] = currentEntry;
    } else {
      newEntries.push(currentEntry);
    }

    setEntries(newEntries);
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));

    // Prepare data to send to the API with the new structure
    const data = {
      entry: currentEntry.content, // Changed to match expected API format
    };

    try {
      // Send data to the new API endpoint with thread_id in header if available
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (threadId) {
        headers['X-Thread-ID'] = threadId;
      }

      const response = await fetch('http://127.0.0.1:5000/journal-entry', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save journal entry');
      }

      const responseData = await response.json();
      
      // Save the thread ID for future conversations
      if (responseData.thread_id) {
        setThreadId(responseData.thread_id);
      }

      console.log('Journal entry saved successfully');
      setShowAiTherapist(true); // Show AI Therapist after saving the entry
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  return (
    <div>
      <Card className="border-teal-200 bg-white/80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Journal</CardTitle>
            <CardDescription>
              Write about your day, thoughts, and feelings...
            </CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect} // Use handleDateSelect here
                initialFocus
                modifiers={{
                  booked: entries.map((entry) => entry.date),
                }}
                modifiersStyles={{
                  booked: {
                    fontWeight: 'bold',
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
            onChange={(e) =>
              setCurrentEntry({ ...currentEntry, title: e.target.value })
            }
            className="text-lg font-medium"
          />
          <Textarea
            placeholder="Write your thoughts here..."
            className="min-h-[300px] resize-none"
            value={currentEntry.content}
            onChange={(e) =>
              setCurrentEntry({ ...currentEntry, content: e.target.value })
            }
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            <FileText className="mr-1 inline-block h-4 w-4" />
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} total
          </div>
          <Button
            onClick={saveEntry}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!currentEntry.content.trim()}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Entry
          </Button>
        </CardFooter>
      </Card>
      {/* Pass threadId and journalEntry to AiTherapist */}
      {showAiTherapist && (
        <AiTherapist 
          threadId={threadId} 
          setThreadId={setThreadId}
          journalEntry={currentEntry.content}
        />
      )}
    </div>
  );
}
