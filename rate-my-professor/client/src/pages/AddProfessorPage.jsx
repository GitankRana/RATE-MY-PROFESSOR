import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

const inputStyle = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #2a2a2a",
  color: "#fff",
  borderRadius: "8px",
  padding: "10px 14px",
  width: "100%",
  outline: "none",
};

export default function AddProfessorPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [university, setUniversity] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    try {
      const res = await fetch(`${BASE_URL}/api/professors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, department, university, bio }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add professor");
      navigate(`/professors/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Name *", value: name, set: setName, type: "text", placeholder: "Dr. John Smith" },
    { label: "Department *", value: department, set: setDepartment, type: "text", placeholder: "Computer Science" },
    { label: "University *", value: university, set: setUniversity, type: "text", placeholder: "MIT" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl p-8"
        style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}>

        <h1 className="text-3xl font-bold mb-2 text-white">Add a Professor</h1>
        <p className="text-sm mb-8" style={{ color: "#a0a0a0" }}>
          Can't find your professor? Add them to the database.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "#2a0a0a", border: "1px solid #e0201c", color: "#e0201c" }}>
            {error}
          </div>
        )}

        {fields.map((f) => (
          <div key={f.label} className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "#a0a0a0" }}>
              {f.label}
            </label>
            <input
              type={f.type}
              value={f.value}
              onChange={e => f.set(e.target.value)}
              style={inputStyle}
              placeholder={f.placeholder}
              onFocus={e => e.target.style.borderColor = "#e0201c"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: "#a0a0a0" }}>
            Bio (optional)
          </label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Brief description of the professor..."
            onFocus={e => e.target.style.borderColor = "#e0201c"}
            onBlur={e => e.target.style.borderColor = "#2a2a2a"}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium transition"
          style={{ backgroundColor: "#e0201c", color: "#fff", opacity: loading ? 0.6 : 1 }}
          onMouseOver={e => { if (!loading) e.currentTarget.style.backgroundColor = "#c41a17"; }}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#e0201c"}
        >
          {loading ? "Adding..." : "Add Professor"}
        </button>
      </div>
    </div>
  );
}