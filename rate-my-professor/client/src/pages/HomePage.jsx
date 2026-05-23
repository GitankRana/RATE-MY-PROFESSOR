import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24 text-center">

      {/* Badge */}
      <div className="inline-block mb-6 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase"
        style={{ backgroundColor: "#1a1a1a", color: "#e0201c", border: "1px solid #2a2a2a" }}>
        Student-Powered Reviews
      </div>

      {/* Hero */}
      <h1 className="text-6xl font-bold mb-6 leading-tight tracking-tight">
        Find the Best
        <span style={{ color: "#e0201c" }}> Professors</span>
      </h1>
      <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#a0a0a0" }}>
        Read honest reviews from real students. Rate your professors and help
        others make better decisions.
      </p>

      <div className="flex gap-4 justify-center flex-wrap">
        <Link to="/professors"
          className="px-8 py-3 rounded-lg text-lg font-medium transition"
          style={{ backgroundColor: "#e0201c", color: "#fff" }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = "#c41a17"}
          onMouseOut={e => e.currentTarget.style.backgroundColor = "#e0201c"}
        >
          Browse Professors
        </Link>
        <Link to="/register"
          className="px-8 py-3 rounded-lg text-lg font-medium transition"
          style={{ border: "1px solid #2a2a2a", color: "#fff" }}
          onMouseOver={e => e.currentTarget.style.borderColor = "#555"}
          onMouseOut={e => e.currentTarget.style.borderColor = "#2a2a2a"}
        >
          Get Started
        </Link>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left">
        {[
          { icon: "⭐", title: "Honest Ratings", desc: "Real reviews from real students. No fake ratings, no bias." },
          { icon: "🔍", title: "Easy to Search", desc: "Filter by department, university, or search by name instantly." },
          { icon: "✍️", title: "Add Professors", desc: "Can't find your professor? Add them and start the conversation." },
        ].map((f) => (
          <div key={f.title}
            className="rounded-xl p-6 transition"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
            onMouseOver={e => e.currentTarget.style.borderColor = "#e0201c"}
            onMouseOut={e => e.currentTarget.style.borderColor = "#2a2a2a"}
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-white">{f.title}</h3>
            <p className="text-sm" style={{ color: "#a0a0a0" }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}