import Card from '@/components/Card';

export default function FeedbackCards({ feedbacks }) {
  // Normalize to array
  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];

  // Reverse the feedbacks array
  const reversedFeedbacks = [...safeFeedbacks].reverse();

  return (
    <>
      <h3 className="text-3xl text-center font-semibold my-5">
        See what the community is saying
      </h3>

      <div className="flex flex-wrap justify-center gap-4">
        {reversedFeedbacks.map((comment, index) => (
          <Card
            key={index}
            username={comment.username}
            message={comment.feedback}
            upvote={comment.upvote}
            downvote={comment.downvote}
            className="bg-neutral text-neutral-content"
            showInput={true}
          />
        ))}
      </div>
    </>
  );
}
