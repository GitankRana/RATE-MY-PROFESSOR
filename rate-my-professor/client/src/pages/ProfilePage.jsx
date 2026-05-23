import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const token = localStorage.getItem("token");

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, []);

  const fetchMyReviews = async () => {
    try {
      const res = await fetch("/api/reviews/mine", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setError("Failed to load your reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyReviews(); }, []);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch {
      alert("Failed to delete review.");
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="rounded-2xl p-6 mb-8 animate-pulse"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full" style={{ backgroundColor: "#2a2a2a" }} />
          <div>
            <div className="h-5 rounded w-32 mb-2" style={{ backgroundColor: "#2a2a2a" }} />
            <div className="h-4 rounded w-24" style={{ backgroundColor: "#2a2a2a" }} />
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return <p className="text-center mt-10" style={{ color: "#e0201c" }}>{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Profile header */}
      <div className="rounded-2xl p-6 mb-8"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: "#2a0a0a", color: "#e0201c", border: "2px solid #e0201c" }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-sm" style={{ color: "#555" }}>Member</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-6 pt-6" style={{ borderTop: "1px solid #2a2a2a" }}>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#e0201c" }}>{reviews.length}</p>
            <p className="text-sm" style={{ color: "#555" }}>Reviews Written</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#e0201c" }}>{avgRating ?? "—"}</p>
            <p className="text-sm" style={{ color: "#555" }}>Avg Rating Given</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <h2 className="text-xl font-semibold text-white mb-4">Your Reviews</h2>

      {reviews.length === 0 ? (
        <div className="text-center py-12" style={{ color: "#555" }}>
          <p>You haven't written any reviews yet.</p>
          <Link to="/professors" className="hover:underline mt-2 inline-block" style={{ color: "#e0201c" }}>
            Browse professors →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl p-5"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>

              <Link to={`/professors/${review.professor.id}`}
                className="font-semibold hover:underline text-lg"
                style={{ color: "#e0201c" }}>
                {review.professor.name}
              </Link>
              <p className="text-sm mb-3" style={{ color: "#555" }}>
                {review.professor.department} · {review.professor.university}
              </p>

              {/* Stars */}
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} style={{ color: star <= review.rating ? "#facc15" : "#2a2a2a" }}>★</span>
                ))}
                <span className="text-sm ml-2" style={{ color: "#555" }}>{review.rating}/5</span>
              </div>

              <p className="text-sm" style={{ color: "#a0a0a0" }}>{review.comment}</p>

              {review.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {review.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#2a0a0a", color: "#e0201c", border: "1px solid #3a1010" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-4 pt-3 text-sm" style={{ borderTop: "1px solid #2a2a2a" }}>
                <Link to={`/professors/${review.professor.id}`}
                  className="hover:underline" style={{ color: "#a0a0a0" }}>
                  View Professor
                </Link>
                <button onClick={() => handleDelete(review.id)}
                  className="hover:underline transition"
                  style={{ color: "#555" }}
                  onMouseOver={e => e.currentTarget.style.color = "#e0201c"}
                  onMouseOut={e => e.currentTarget.style.color = "#555"}
                >
                  Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}