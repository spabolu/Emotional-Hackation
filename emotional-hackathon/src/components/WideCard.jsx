import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

export default function WideCard({
  username,
  message,
  upvote = 0,
  downvote = 0,
  className = "",
  showInput = false,
  onClick, // Click handler
}) {
  return (
    <div
      onClick={onClick} // Making the card clickable
      className={`card w-auto max-w-2xl m-0.2 cursor-pointer transition duration-300 ease-in-out transform hover:scale-95 hover:shadow-lg ${className}`}
    >
      <div className="card-body items-center text-center">
        <iframe src={username} width="60%" height="500px" />
        {/* <h2 className="card-title">{username}</h2> */}
        <p className="pt-2">{message}</p>
        <div className="card-actions justify-between mt-3">
          <button className="btn btn-primary">
            <ThumbsUpIcon /> {upvote}
          </button>
          <button className="btn btn-ghost">
            <ThumbsDownIcon /> {downvote}
          </button>
        </div>
        {showInput && (
          <input
            type="text"
            placeholder="Comment: "
            className="input input-bordered input-md w-full max-w-xs mt-2"
          />
        )}
      </div>
    </div>
  );
}
