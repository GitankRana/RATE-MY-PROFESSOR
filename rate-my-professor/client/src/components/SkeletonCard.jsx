export default function SkeletonCard() {
  return (
    <div className="rounded-xl p-6 animate-pulse"
      style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="h-5 rounded w-48 mb-3" style={{ backgroundColor: "#2a2a2a" }} />
          <div className="h-4 rounded w-36 mb-3" style={{ backgroundColor: "#2a2a2a" }} />
          <div className="h-4 rounded w-full mb-2" style={{ backgroundColor: "#2a2a2a" }} />
          <div className="h-4 rounded w-3/4" style={{ backgroundColor: "#2a2a2a" }} />
        </div>
        <div className="ml-6 h-12 w-16 rounded-lg shrink-0" style={{ backgroundColor: "#2a2a2a" }} />
      </div>
      <div className="h-4 rounded w-24 mt-4" style={{ backgroundColor: "#2a2a2a" }} />
    </div>
  );
}