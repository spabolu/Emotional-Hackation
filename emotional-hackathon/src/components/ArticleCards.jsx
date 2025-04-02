import WideCard from '@/components/WideCard';

export default function ArticleCards({ articleData }) {
  const safeArticleData = Array.isArray(articleData) ? articleData : [];

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {safeArticleData.length > 0 ? (
          safeArticleData.map((article, index) => (
            <a
              key={index}
              href={article.Link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WideCard
                username={article.Link}
                message={article.Summary}
                className="bg-neutral text-neutral-content"
                showInput={false}
              />
            </a>
          ))
        ) : (
          <p className="text-center text-gray-500">No articles found.</p>
        )}
      </div>
    </>
  );
}
``