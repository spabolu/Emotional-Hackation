import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function SolutionModal({
  problemPreview = '',
  problem = '',
  solutionPreview = '',
  solution = '',
  upvote = 0,
  downvote = 0,
  closeModal, // Function to close the modal
  onVote, // Function to handle vote updates
}) {
  const [currentUpvote, setCurrentUpvote] = useState(upvote);
  const [currentDownvote, setCurrentDownvote] = useState(downvote);
  const dialogRef = useRef(null);

  useEffect(() => {
    setCurrentUpvote(upvote);
    setCurrentDownvote(downvote);
  }, [upvote, downvote]);

  useEffect(() => {
    const dialog = dialogRef.current;

    const handleClose = (e) => {
      // Ensure that clicks outside the modal content close the modal
      if (e.target === dialog) {
        closeModal();
      }
    };

    dialog?.addEventListener('click', handleClose);

    return () => {
      dialog?.removeEventListener('click', handleClose);
    };
  }, [closeModal]);

  const handleVoteClick = async (e, type) => {
    e.stopPropagation(); // Prevent click event from bubbling up to the modal
    if (type === 'upvote') {
      setCurrentUpvote((prev) => prev + 1);
    } else if (type === 'downvote') {
      setCurrentDownvote((prev) => prev + 1);
    }

    // Call the onVote function to update the backend
    try {
      await onVote(type);
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  return (
    <dialog ref={dialogRef} open className="modal max-w-6xl mx-auto p-0">
      <div className="modal-box max-w-5xl w-full border-4 border-blue-700 shadow-lg bg-gray-200">
        <h3 className="font-bold text-lg">{problemPreview}</h3>
        <p className="py-2">{problem}</p>
        <h4 className="font-semibold">Solution:</h4>
        <p className="py-4">{solutionPreview}</p>
        <p className="py-4">{solution}</p>
        <div className="flex justify-between mt-3">
          <button
            className="btn btn-primary"
            onClick={(e) => handleVoteClick(e, 'upvote')}
          >
            <ThumbsUpIcon /> {currentUpvote}
          </button>
          <button
            className="btn btn-ghost"
            onClick={(e) => handleVoteClick(e, 'downvote')}
          >
            <ThumbsDownIcon /> {currentDownvote}
          </button>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
