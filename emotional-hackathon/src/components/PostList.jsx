'use client';
// src/components/PostList.jsx

import { useEffect, useState } from 'react';

const PostList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch feedback data when the component mounts
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('api/posts');
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

  useEffect(() => {
    // Fetch solution data when the component mounts
    const fetchSolutions = async () => {
      try {
        const res = await fetch('api/postsSol');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setSolutions(data);
      } catch (error) {
        console.error('Error fetching Solutions:', error);
        setError('Failed to load Solutions.');
      }
    };

    fetchSolutions();
  }, []);

  return (
    <div>
      <h1>Feedbacks</h1>
      {error && <p>{error}</p>}
      <ul>
        {/* <FeedbackCards feedbacks={feedbacks} /> */}
        {feedbacks.map((feedback, index) => (
          <li key={index}>{feedback.feedback}</li>
        ))}
        {solutions.map((solution, index) => (
          <li key={index}>{solution.solution}</li>
        ))}{' '}
      </ul>
    </div>
  );
};

export default PostList;
