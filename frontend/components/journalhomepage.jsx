'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';

export default function JournalHomepage() {
  const [entries, setEntries] = useState([]); // State to store journal entries
  const [loading, setLoading] = useState(true); // State to handle loading state
  const router = useRouter();

  useEffect(() => {
    // Fetch journal entries from the database
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
        // Assuming the API returns an array of journal entries
        setEntries(
          data.journals.map((entry) => ({
            title: entry.title,
            date: new Date(entry.entry_date), // Convert date strings to Date objects
            content: entry.preview, // Use the preview content
          }))
        );
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    fetchEntries();
  }, []);

  const handleCardClick = (entryId) => {
    // Navigate to the journal details page with the entry ID
    router.push(`/journal/${entryId}`);
  };

  const handleAddJournalClick = () => {
    // Navigate to the journal page
    router.push('/journalentry');
  };

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while fetching data
  }

  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, index) => (
          <Card
            key={index} // Use the index as the key since the API doesn't provide unique IDs
            className="cursor-pointer hover:shadow-lg"
            onClick={() => handleCardClick(index)}
          >
            <CardHeader>
              <CardTitle>{entry.title || 'Untitled'}</CardTitle>
              <CardDescription>{format(entry.date, 'PPP')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {entry.content || 'No content available.'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Add Journal Button */}
      <div className="fixed bottom-8 right-8 flex flex-col items-center">
        <button
          onClick={handleAddJournalClick}
          className="flex items-center justify-center w-16 h-16 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
        >
          <span className="text-3xl font-bold">+</span>
        </button>
        <span className="mt-2 text-sm text-muted-foreground">Add Journal</span>
      </div>
    </div>
  );
}