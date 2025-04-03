'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation
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
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Save, CalendarIcon, FileText, ArrowLeft } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import AiTherapist from '@/components/ai-therapist'; // Import AiTherapist
import { UserNav } from '@/components/user-nav';

export default function Journal() {
  const [entries, setEntries] = useState([]); // State to store journal entries
  const [currentEntry, setCurrentEntry] = useState({
    id: Date.now().toString(),
    title: '',
    content: '',
    date: new Date(),
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAiTherapist, setShowAiTherapist] = useState(false); // State to control AI Therapist visibility
  const [threadId, setThreadId] = useState('thread_1ZtkgumkEA1re5OIdxfw0TRc'); // Added to track the thread ID
  const [showDialog, setShowDialog] = useState(false); // State to control popup visibility
  const [AiSummaryConsent, setAiSummaryConsent] = useState(null); // State for user consent
  const router = useRouter();

  useEffect(() => {
    // Fetch all journal entries from the API
    const fetchEntries = async () => {
      try {
        const userId = 1; // Replace with the actual user ID
        const response = await fetch(
          `http://127.0.0.1:5000/fetch_journals/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch journal entries');
        }

        const data = await response.json();
        setEntries(
          data.journals.map((entry) => ({
            id: entry.id || Date.now().toString(), // Ensure each entry has a unique ID
            title: entry.title,
            content: entry.preview,
            date: new Date(entry.entry_date),
          }))
        );
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      }
    };

    fetchEntries();
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

    // Prepare data to send to the API
    const data = {
      user_id: 1, // Replace with the actual user ID
      title: currentEntry.title,
      content: currentEntry.content,
      entry_date: currentEntry.date.toISOString(),
    };

    try {
      // Send data to the API endpoint
      const headers = {
        'Content-Type': 'application/json',
      };

      if (threadId) {
        headers['X-Thread-ID'] = threadId;
      }

      const response = await fetch('http://127.0.0.1:5000/add_journal_entry', {
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

      // Refresh the entries after saving
      const updatedEntries = await fetch(
        `http://127.0.0.1:5000/fetch_journals/1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (updatedEntries.ok) {
        const updatedData = await updatedEntries.json();
        setEntries(
          updatedData.journals.map((entry) => ({
            id: entry.id || Date.now().toString(),
            title: entry.title,
            content: entry.preview,
            date: new Date(entry.entry_date),
          }))
        );
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const handleBackClick = () => {
    setShowDialog(true); // Show the popup dialog
  };

  const handleConsent = (consent) => {
    setAiSummaryConsent(consent); // Set the consent value
    console.log(consent);
    setShowDialog(false); // Close the dialog
    router.push('/'); // Redirect to the homepage
  };

  return (
    <div>
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between pl-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-teal-700">Journal</h1>
          </div>
          <UserNav />
        </div>
      </header>
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
      {/* Conditionally render AiTherapist */}
      {showAiTherapist && <AiTherapist />}

      {/* Popup Dialog */}
      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Can we confidentially use this data to connect others?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => handleConsent(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Of Course!
              </Button>
                No Thank You
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
