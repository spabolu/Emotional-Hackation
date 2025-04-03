'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function JournalDetails({ params }) {
  const { id } = params; // Get the journal entry ID from the URL
  const [entry, setEntry] = useState(null); // State to store the journal entry
  const [loading, setLoading] = useState(true); // State to handle loading state
  const router = useRouter();

  useEffect(() => {
    // Fetch the specific journal entry from the database
    const fetchEntry = async () => {
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
          throw new Error('Failed to fetch journal entry');
        }

        const data = await response.json();
        // Find the specific journal entry by ID
        const foundEntry = data.journals[id]; // Assuming `id` is the index of the journal
        if (foundEntry) {
          setEntry({
            title: foundEntry.title,
            date: new Date(foundEntry.entry_date), // Convert date strings to Date objects
            content: foundEntry.preview, // Use the full content
          });
        } else {
          throw new Error('Journal entry not found');
        }
      } catch (error) {
        console.error('Error fetching journal entry:', error);
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    fetchEntry();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while fetching data
  }

  if (!entry) {
    return <p>Journal entry not found.</p>; // Show an error message if the entry is not found
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{entry.title || 'Untitled'}</CardTitle>
          <CardDescription>{format(entry.date, 'PPP')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{entry.content}</p>
        </CardContent>
      </Card>
      <Button
        onClick={() => router.back()}
        className="mt-4 bg-teal-600 hover:bg-teal-700"
      >
        Back to Journals
      </Button>
    </div>
  );
}