// src/components/FeedbackPage.jsx
"use client";

import { useEffect, useState } from "react";
import ArticleCards from "./ArticleCards";

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/postsArticles");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setError("Failed to load feedbacks.");
      }
    };
    fetchArticles();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      <div className="my-6">
        <h3 className="text-3xl text-center font-semibold">
          AI Explains News & Research
        </h3>
        <p className="text-center max-w-xl mx-auto">
          View published articles relevant to mining activites and their impact
          on local communities and the environment. AI provides an snapshot of
          these articles to help understand the content.
        </p>
      </div>
      <ArticleCards articleData={articles} />
    </div>
  );
};

export default ArticlePage;
