import Card from '@/components/Card';

export default function Solutions({ solutionsVal = [], onCardClick }) {
  const safeSolutions = Array.isArray(solutionsVal) ? solutionsVal : [];

  return (
    <>
      <h3 className="text-3xl font-semibold py-6 text-center">
        Top AI Solutions This Week
      </h3>
      <div className="max-w-7xl overflow-x-auto no-scrollbar text-center">
        <div className="flex space-x-4">
          {safeSolutions.length > 0 ? (
            safeSolutions.map((solution, index) => (
              <div key={index} onClick={() => onCardClick(solution)}>
                <Card
                  username={solution.problempreview}
                  message={solution.solutionpreview}
                  upvote={solution.upvote}
                  downvote={solution.downvote}
                  className="bg-neutral text-neutral-content"
                  showInput={false}
                />
              </div>
            ))
          ) : (
            <p className="w-full text-center text-gray-500 py-4">
              No solutions available.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
