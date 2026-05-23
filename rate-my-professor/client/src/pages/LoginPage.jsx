import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
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

        <h1 className="text-3xl font-bold mb-2 text-white">Welcome back</h1>
        <p className="text-sm mb-8" style={{ color: "#a0a0a0" }}>Login to your account</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "#2a0a0a", border: "1px solid #e0201c", color: "#e0201c" }}>
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: "#a0a0a0" }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            style={inputStyle} placeholder="you@example.com"
            onFocus={e => e.target.style.borderColor = "#e0201c"}
            onBlur={e => e.target.style.borderColor = "#2a2a2a"}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: "#a0a0a0" }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            style={inputStyle} placeholder="••••••••"
            onFocus={e => e.target.style.borderColor = "#e0201c"}
            onBlur={e => e.target.style.borderColor = "#2a2a2a"}
          />
        </div>

        <button onClick={handleLogin} disabled={loading}
          className="w-full py-3 rounded-lg font-medium transition"
          style={{ backgroundColor: "#e0201c", color: "#fff", opacity: loading ? 0.6 : 1 }}
          onMouseOver={e => { if (!loading) e.currentTarget.style.backgroundColor = "#c41a17"; }}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#e0201c"}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-6 text-center" style={{ color: "#a0a0a0" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#e0201c" }} className="hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}