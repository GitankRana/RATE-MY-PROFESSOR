import { Link, useNavigate } from "react-router-dom";

function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ borderBottom: "1px solid #1f1f1f", backgroundColor: "#0a0a0a" }}
      className="px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm">
      <Link to="/" className="text-xl font-bold tracking-tight" style={{ color: "#e0201c" }}>
        RateMyProfessor
      </Link>

      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <Link to="/professors"
              className="text-sm transition px-3 py-1.5 rounded-lg"
              style={{ color: "#a0a0a0" }}
              onMouseOver={e => e.target.style.color = "#fff"}
              onMouseOut={e => e.target.style.color = "#a0a0a0"}
            >
              Professors
            </Link>
            <Link to="/professors/add"
              className="text-sm px-4 py-2 rounded-lg font-medium transition"
              style={{ backgroundColor: "#e0201c", color: "#fff" }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "#c41a17"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "#e0201c"}
            >
              + Add Professor
            </Link>
            <Link to="/profile"
              className="text-sm px-3 py-1.5 rounded-lg transition"
              style={{ color: "#a0a0a0", border: "1px solid #2a2a2a" }}
              onMouseOver={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#555"; }}
              onMouseOut={e => { e.currentTarget.style.color = "#a0a0a0"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
            >
              Hi, {user.name} 👋
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded-lg transition"
              style={{ color: "#a0a0a0", border: "1px solid #2a2a2a" }}
              onMouseOver={e => { e.currentTarget.style.color = "#e0201c"; e.currentTarget.style.borderColor = "#e0201c"; }}
              onMouseOut={e => { e.currentTarget.style.color = "#a0a0a0"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"
              className="text-sm px-3 py-1.5 rounded-lg transition"
              style={{ color: "#a0a0a0" }}
              onMouseOver={e => e.target.style.color = "#fff"}
              onMouseOut={e => e.target.style.color = "#a0a0a0"}
            >
              Login
            </Link>
            <Link to="/register"
              className="text-sm px-4 py-2 rounded-lg font-medium transition"
              style={{ backgroundColor: "#e0201c", color: "#fff" }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "#c41a17"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = "#e0201c"}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}