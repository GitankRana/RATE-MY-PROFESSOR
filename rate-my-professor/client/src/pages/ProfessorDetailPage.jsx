import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StarRating from "../components/StarRating";
import TagSelector from "../components/TagSelector";
import RatingBadge from "../components/RatingBadge";
import SkeletonCard from "../components/SkeletonCard";
import BASE_URL from "../api";

function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const textareaStyle = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #2a2a2a",
  color: "#fff",
  borderRadius: "8px",
  padding: "10px 14px",
  width: "100%",
  outline: "none",
  resize: "vertical",
};

export default function ProfessorDetailPage() {
  const { id } = useParams();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editTags, setEditTags] = useState([]);

  const currentUser = getUserFromToken();

  const fetchProfessor = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/professors/${id}`);
      const data = await res.json();
      setProfessor(data);
    } catch (err) {
      setError("Failed to load professor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfessor(); }, [id]);

  const handleSubmitReview = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setSubmitError("You must be logged in to submit a review.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/professors/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comment, tags }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }
      setSubmitSuccess(true);
      setComment(""); setRating(5); setTags([]);
      fetchProfessor();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (reviewId, type) => {
    const token = localStorage.getItem("token");
    if (!token) { alert("You must be logged in to vote."); return; }
    try {
      await fetch(`${BASE_URL}/api/reviews/${reviewId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type }),
      });
      fetchProfessor();
    } catch (err) { console.error("Vote failed", err); }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfessor();
    } catch (err) { console.error("Delete failed", err); }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditTags(review.tags || []);
  };

  const handleSaveEdit = async (reviewId) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: editRating, comment: editComment, tags: editTags }),
      });
      setEditingReviewId(null);
      fetchProfessor();
    } catch (err) { console.error("Edit failed", err); }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="h-4 rounded w-24 mb-6 animate-pulse" style={{ backgroundColor: "#1a1a1a" }} />
      <SkeletonCard />
      <div className="mt-6 grid grid-cols-1 gap-4">
        {[1, 2].map((i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  if (error) return <p className="text-center mt-10" style={{ color: "#e0201c" }}>{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/professors" className="text-sm hover:underline" style={{ color: "#e0201c" }}>
        ← Back to all professors
      </Link>

      {/* Professor info */}
      <div className="mt-6 rounded-xl p-6"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">{professor.name}</h1>
            <p className="mt-1" style={{ color: "#a0a0a0" }}>
              {professor.department} — {professor.university}
            </p>
            <p className="mt-3 text-sm" style={{ color: "#666" }}>{professor.bio}</p>
          </div>
          <div className="text-center ml-6 shrink-0">
            <RatingBadge rating={professor.avgRating} size="lg" />
            <StarRating value={Math.round(professor.avgRating)} readOnly />
            <div className="text-xs mt-1" style={{ color: "#555" }}>
              {professor.reviewCount} review{professor.reviewCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Review form */}
      <div className="mt-8 rounded-xl p-6"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        <h2 className="text-xl font-semibold mb-4 text-white">Leave a Review</h2>

        {submitSuccess && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "#0d2b1a", border: "1px solid #166534", color: "#4ade80" }}>
            ✅ Review submitted!
          </div>
        )}
        {submitError && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "#2a0a0a", border: "1px solid #e0201c", color: "#e0201c" }}>
            {submitError}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: "#a0a0a0" }}>Rating</label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: "#a0a0a0" }}>Tags</label>
          <TagSelector selected={tags} onChange={setTags} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: "#a0a0a0" }}>Comment</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={4}
            style={textareaStyle}
            placeholder="Share your experience..."
            onFocus={e => e.target.style.borderColor = "#e0201c"}
            onBlur={e => e.target.style.borderColor = "#2a2a2a"}
          />
        </div>

        <button
          onClick={handleSubmitReview}
          disabled={submitting}
          className="px-6 py-2 rounded-lg font-medium transition"
          style={{ backgroundColor: "#e0201c", color: "#fff", opacity: submitting ? 0.6 : 1 }}
          onMouseOver={e => { if (!submitting) e.currentTarget.style.backgroundColor = "#c41a17"; }}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#e0201c"}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* Reviews list */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Reviews
          <span className="text-sm font-normal ml-2" style={{ color: "#555" }}>
            ({professor.reviews.length})
          </span>
        </h2>

        {professor.reviews.length === 0 ? (
          <p style={{ color: "#a0a0a0" }}>No reviews yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {professor.reviews.map((review) => (
              <div key={review.id} className="rounded-xl p-5"
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>

                {editingReviewId === review.id ? (
                  <div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-2" style={{ color: "#a0a0a0" }}>Rating</label>
                      <StarRating value={editRating} onChange={setEditRating} />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-2" style={{ color: "#a0a0a0" }}>Tags</label>
                      <TagSelector selected={editTags} onChange={setEditTags} />
                    </div>
                    <textarea
                      value={editComment}
                      onChange={e => setEditComment(e.target.value)}
                      rows={3}
                      style={{ ...textareaStyle, marginBottom: "12px" }}
                      onFocus={e => e.target.style.borderColor = "#e0201c"}
                      onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveEdit(review.id)}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium transition"
                        style={{ backgroundColor: "#e0201c", color: "#fff" }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#c41a17"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = "#e0201c"}
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingReviewId(null)}
                        className="px-4 py-1.5 rounded-lg text-sm transition"
                        style={{ backgroundColor: "#2a2a2a", color: "#a0a0a0" }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#333"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = "#2a2a2a"}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">{review.user.name}</span>
                      <StarRating value={review.rating} readOnly />
                    </div>

                    {review.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {review.tags.map((tag) => (
                          <span key={tag}
                            className="text-xs px-3 py-1 rounded-full"
                            style={{ backgroundColor: "#2a0a0a", color: "#e0201c", border: "1px solid #3a1010" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-3 text-sm" style={{ color: "#a0a0a0" }}>{review.comment}</p>
                    <p className="text-xs mt-2" style={{ color: "#444" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex gap-4 mt-3 pt-3" style={{ borderTop: "1px solid #2a2a2a" }}>
                      <button onClick={() => handleVote(review.id, "LIKE")}
                        className="flex items-center gap-1 text-sm transition"
                        style={{ color: "#4ade80" }}>
                        👍 {review.likes}
                      </button>
                      <button onClick={() => handleVote(review.id, "DISLIKE")}
                        className="flex items-center gap-1 text-sm transition"
                        style={{ color: "#f87171" }}>
                        👎 {review.dislikes}
                      </button>

                      {currentUser && currentUser.id === review.userId && (
                        <div className="ml-auto flex gap-3">
                          <button onClick={() => handleEdit(review)}
                            className="text-xs transition"
                            style={{ color: "#555" }}
                            onMouseOver={e => e.currentTarget.style.color = "#fff"}
                            onMouseOut={e => e.currentTarget.style.color = "#555"}
                          >
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(review.id)}
                            className="text-xs transition"
                            style={{ color: "#555" }}
                            onMouseOver={e => e.currentTarget.style.color = "#e0201c"}
                            onMouseOut={e => e.currentTarget.style.color = "#555"}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}