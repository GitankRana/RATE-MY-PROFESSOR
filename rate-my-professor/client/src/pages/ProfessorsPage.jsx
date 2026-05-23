import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingBadge from "../components/RatingBadge";
import SkeletonCard from "../components/SkeletonCard";
import BASE_URL from "../api";

const inputStyle = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #2a2a2a",
  color: "#fff",
  borderRadius: "8px",
  padding: "10px 14px",
  outline: "none",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

export default function ProfessorsPage() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/professors`);
        const data = await res.json();
        setProfessors(data);
      } catch (err) {
        setError("Failed to load professors.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfessors();
  }, []);

  const departments = [...new Set(professors.map((p) => p.department))];
  const universities = [...new Set(professors.map((p) => p.university))];

  const filtered = professors.filter((prof) => {
    const q = search.toLowerCase();
    return (
      (prof.name.toLowerCase().includes(q) ||
        prof.department.toLowerCase().includes(q) ||
        prof.university.toLowerCase().includes(q)) &&
      (selectedDepartment === "" || prof.department === selectedDepartment) &&
      (selectedUniversity === "" || prof.university === selectedUniversity)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "highest") return (b.avgRating ?? -1) - (a.avgRating ?? -1);
    if (sortBy === "lowest") return (a.avgRating ?? 99) - (b.avgRating ?? 99);
    return a.id - b.id;
  });

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="h-8 rounded w-48 mb-8 animate-pulse" style={{ backgroundColor: "#1a1a1a" }} />
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  if (error) return <p className="text-center mt-10" style={{ color: "#e0201c" }}>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-white">All Professors</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, department, university..."
          style={{ ...inputStyle, flex: 1, minWidth: "200px" }}
          onFocus={e => e.target.style.borderColor = "#e0201c"}
          onBlur={e => e.target.style.borderColor = "#2a2a2a"}
        />
        <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} style={selectStyle}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={selectedUniversity} onChange={e => setSelectedUniversity(e.target.value)} style={selectStyle}>
          <option value="">All Universities</option>
          {universities.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
          <option value="default">Sort: Default</option>
          <option value="highest">Rating: High → Low</option>
          <option value="lowest">Rating: Low → High</option>
        </select>
      </div>

      <p className="text-sm mb-4" style={{ color: "#555" }}>
        {sorted.length} professor{sorted.length !== 1 ? "s" : ""} found
      </p>

      {sorted.length === 0 ? (
        <p style={{ color: "#a0a0a0" }}>No professors match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sorted.map((prof) => (
            <div key={prof.id}
              className="rounded-xl p-6 transition"
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
              onMouseOver={e => e.currentTarget.style.borderColor = "#e0201c"}
              onMouseOut={e => e.currentTarget.style.borderColor = "#2a2a2a"}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white">{prof.name}</h2>
                  <p className="text-sm mt-1" style={{ color: "#a0a0a0" }}>
                    {prof.department} — {prof.university}
                  </p>
                  <p className="text-sm mt-2" style={{ color: "#666" }}>{prof.bio}</p>
                </div>
                <div className="text-center ml-6 shrink-0">
                  <RatingBadge rating={prof.avgRating} size="lg" />
                  <div className="text-xs mt-1" style={{ color: "#555" }}>
                    {prof.reviewCount} review{prof.reviewCount !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to={`/professors/${prof.id}`}
                  className="text-sm font-medium hover:underline"
                  style={{ color: "#e0201c" }}>
                  View Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}