'use client';
import { Sparkle } from 'lucide-react';
import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

export default function Input() {
  const [feedback, setFeedback] = useState('');
  const [enhancedFeedback, setEnhancedFeedback] = useState('');
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(null); // Index for feedback options

  const feedbackOptions = [
    'The dust and noise from the mining operations are quite disruptive, but the jobs they provide are essential for the well-being and continued support of our community.',
    'Our community feels excluded from the decision-making processes that impact our environmental conditions.',
    'While employment at the mine offers competitive wages, there are significant concerns regarding the associated health risks.',
  ];

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when starting the API call

    try {
      // Call the API to insert feedback
      const res = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'Anonymous', feedback: feedback }), // Pass user feedback directly
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data.message); // Log the success message

        // Optionally handle response here
      } else {
        console.error('Error submitting feedback:', await res.json());
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false); // Reset loading state after completion
    }

    // Reset state
    setFeedback('');
    setEnhancedFeedback('');
    setShowEnhanced(false);

    // Update to the next feedback option
    setCurrentFeedbackIndex(
      (currentFeedbackIndex + 1) % feedbackOptions.length
    );
  };

  const handleTryWithAI = () => {
    // Determine the index based on the first word of the feedback
    const firstWord = feedback.split(' ')[0].toLowerCase();
    let index = null;

    switch (firstWord) {
      case 'the':
        index = 0;
        break;
      case 'we':
        index = 1;
        break;
      case 'as':
        index = 2;
        break;
      default:
        index = null; // Handle unexpected first words if necessary
    }

    // Delay the state updates by 2 seconds
    setTimeout(() => {
      setCurrentFeedbackIndex(index);
      setShowEnhanced(true);
    }, 2000); // 2000 milliseconds = 2 seconds
  };
const handleSubmitAIEnhancedFeedback = async () => {
  if (currentFeedbackIndex === null) {
    console.error('No valid feedback option selected.');
    return;
  }

  // Get the selected AI-enhanced feedback
  const selectedFeedback = feedbackOptions[currentFeedbackIndex];

  // Call the API to insert the AI-enhanced feedback
  try {
    const res = await fetch('/api/submit-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Anonymous',
        feedback: selectedFeedback,
      }), // Pass the AI-enhanced feedback
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data.message); // Log the success message
    } else {
      console.error('Error submitting AI enhanced feedback:', await res.json());
    }
  } catch (error) {
    console.error('Error submitting AI enhanced feedback:', error);
  } finally {
    // Reset state
    setFeedback('');
    setEnhancedFeedback('');
    setShowEnhanced(false);

    // Update to the next feedback option
    setCurrentFeedbackIndex(
      (currentFeedbackIndex + 1) % feedbackOptions.length
    );
  }
};

  return (
    <div className="w-full max-w-2xl mt-9">
      <h3 className="text-xl font-semibold">Express Yourself</h3>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Enter your feedback"
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
          }}
        />
        <button
          className="hover:opacity-70 opacity-80"
          onClick={handleSubmit}
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Loading...' : <SendHorizontal />}
        </button>
      </label>
      <div className="justify-between px">
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2" // Add flex and items-center for alignment
          onClick={handleTryWithAI}
        >
          <Sparkle className="w-5 h-5" />{' '}
          {/* Adjust the size of the icon if needed */}
          <span>Try with AI</span>{' '}
          {/* Use span to ensure the text is treated as inline */}
        </button>
      </div>

      {showEnhanced && currentFeedbackIndex !== null && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold">AI Enhanced Feedback</h4>
          <p>{feedbackOptions[currentFeedbackIndex]}</p>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmitAIEnhancedFeedback}
          >
            Submit AI Enhanced Feedback
          </button>
        </div>
      )}
    </div>
  );
}
