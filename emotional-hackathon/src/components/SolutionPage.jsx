'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import Solutions from './Solutions';
import SolutionModal from './SolutionModal';

const SolutionPage = () => {
  const [solutions, setSolutions] = useState([]);
  const [error, setError] = useState('');
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const res = await fetch('/api/postsSol');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setSolutions(data);
      } catch (error) {
        console.error('Error fetching solutions:', error);
        setError('Failed to load solutions.');
      }
    };
    fetchSolutions();
  }, []);

  const handleCardClick = (solution) => {
    setSelectedSolution(solution);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSolution(null);
  };

  const handleVote = async (type) => {
    const url = type === 'upvote' ? '/api/upvote' : '/api/downvote';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedSolution.id }), // Assuming `id` is available in selectedSolution
      });
      if (!res.ok) throw new Error('Failed to update vote');
      // Update the UI with the new vote count
      setSolutions((prevSolutions) =>
        prevSolutions.map((sol) =>
          sol.id === selectedSolution.id
            ? { ...sol, [type]: sol[type] + 1 }
            : sol
        )
      );
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <Solutions solutionsVal={solutions} onCardClick={handleCardClick} />
      {isModalOpen && selectedSolution && (
        <SolutionModal
          problemPreview={selectedSolution.problempreview}
          problem={selectedSolution.problem}
          solutionPreview={selectedSolution.solutionpreview}
          solution={selectedSolution.solution}
          upvote={selectedSolution.upvote}
          downvote={selectedSolution.downvote}
          closeModal={closeModal}
          onVote={handleVote} // Pass the handleVote function to the modal
        />
      )}
    </div>
  );
};

export default SolutionPage;
