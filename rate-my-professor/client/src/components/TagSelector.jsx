const AVAILABLE_TAGS = [
  "Tough Grader",
  "Very Helpful",
  "Engaging",
  "Clear Explanations",
  "Lots of Homework",
  "Easy A",
  "Inspirational",
  "Skip Class? You'll Fail",
  "Caring",
  "Boring Lectures",
];

export default function TagSelector({ selected, onChange }) {
  const toggle = (tag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {AVAILABLE_TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggle(tag)}
          className={`text-xs px-3 py-1 rounded-full border transition ${
            selected.includes(tag)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}