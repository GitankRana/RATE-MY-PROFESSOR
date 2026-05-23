export default function RatingBadge({ rating, size = "md" }) {
  const num = rating ? parseFloat(rating) : null;

  const color =
    num >= 4 ? { backgroundColor: "#0d2b1a", color: "#4ade80", border: "1px solid #166534" }
    : num >= 3 ? { backgroundColor: "#2b2200", color: "#facc15", border: "1px solid #854d0e" }
    : num >= 1 ? { backgroundColor: "#2a0a0a", color: "#f87171", border: "1px solid #991b1b" }
    : { backgroundColor: "#1a1a1a", color: "#555", border: "1px solid #2a2a2a" };

  const sizeClass = size === "lg" ? "text-2xl px-4 py-1.5" : "text-sm px-2.5 py-0.5";

  return (
    <span className={`font-bold rounded-lg ${sizeClass}`} style={color}>
      {num ? num.toFixed(1) : "N/A"}
    </span>
  );
}