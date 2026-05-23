import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      localStorage.setItem("token", data.token);
      navigate("/professors");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    color: "#fff",
    borderRadius: "8px",
    padding: "10px 14px",
    width: "100%",
    outline: "none",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl p-8"
        style={{ backgroundColor: "#111", border: "1px solid #1f1f1f" }}>

        <h1 className="text-3xl font-bold mb-2 text-white">Create account</h1>
        <p className="text-sm mb-8" style={{ color: "#a0a0a0" }}>Join and start reviewing professors</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "#2a0a0a", border: "1px solid #e0201c", color: "#e0201c" }}>
            {error}
          </div>
        )}

        {[
          { label: "Name", value: name, set: setName, type: "text", placeholder: "Your name" },
          { label: "Email", value: email, set: setEmail, type: "email", placeholder: "you@example.com" },
          { label: "Password", value: password, set: setPassword, type: "password", placeholder: "••••••••" },
        ].map((field) => (
          <div key={field.label} className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "#a0a0a0" }}>{field.label}</label>
            <input type={field.type} value={field.value}
              onChange={e => field.set(e.target.value)}
              style={inputStyle} placeholder={field.placeholder}
              onFocus={e => e.target.style.borderColor = "#e0201c"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>
        ))}

        <div className="mt-6">
          <button onClick={handleRegister} disabled={loading}
            className="w-full py-3 rounded-lg font-medium transition"
            style={{ backgroundColor: "#e0201c", color: "#fff", opacity: loading ? 0.6 : 1 }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.backgroundColor = "#c41a17"; }}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#e0201c"}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>

        <p className="text-sm mt-6 text-center" style={{ color: "#a0a0a0" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#e0201c" }} className="hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}