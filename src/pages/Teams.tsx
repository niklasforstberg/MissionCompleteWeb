export default function Teams() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-forest-green">Teams</h1>
        <button className="bg-forest-green text-white px-4 py-2 rounded hover:bg-opacity-90">
          Create Team
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-forest-green mb-2">
              Team {i}
            </h2>
            <p className="text-charcoal mb-4">
              This is a placeholder description for Team {i}.
            </p>
            <div className="flex justify-between items-center text-sm text-sage-green">
              <span>12 Players</span>
              <span>5 Active Challenges</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 