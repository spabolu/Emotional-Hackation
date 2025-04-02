// src/components/FeedbackPage.jsx
'use client';

import { useEffect, useState } from 'react';
import FeedbackCards from './FeedbackCards'; // Assuming FeedbackCards is the correct component name

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('/api/posts'); // Adjust the URL if necessary
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setFeedbacks(data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setError('Failed to load feedbacks.');
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      <FeedbackCards feedbacks={feedbacks} />
    </div>
  );
};

export default FeedbackPage;
