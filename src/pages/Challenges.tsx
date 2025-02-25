export default function Challenges() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-forest-green">Challenges</h1>
        <button className="bg-forest-green text-white px-4 py-2 rounded hover:bg-opacity-90">
          Create Challenge
        </button>
      </div>

      <div className="grid gap-4">
        {/* Placeholder challenges */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold text-forest-green">
                Challenge {i}
              </h2>
              <p className="text-charcoal">
                This is a placeholder description for Challenge {i}.
              </p>
              <div className="flex gap-4 mt-2 text-sm text-sage-green">
                <span>Type: Cardio</span>
                <span>Frequency: Daily</span>
                <span>Team: Team {i}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-forest-green hover:text-opacity-80">
                Edit
              </button>
              <button className="text-red-600 hover:text-opacity-80">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 