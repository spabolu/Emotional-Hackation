'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import ArticleCards from './ArticleCards';

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User Response:', userResponse);
    // Add logic to send the response to a backend or process it further
    setUserResponse(''); // Clear the input after submission

    // Navigate to the /about page
    router.push('/about');
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div>
      <div className="my-6">
        <h3 className="text-3xl text-center font-semibold">Journal</h3>
        <p className="text-center text-gray-500">{currentDate}</p>
        <p className="text-center max-w-xl mx-auto mt-4"></p>
      </div>

      <div className="my-6 max-w-xl mx-auto">
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Write your thoughts here..."
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>

      <ArticleCards articleData={articles} />
    </div>
  );
};

export default ArticlePage;
