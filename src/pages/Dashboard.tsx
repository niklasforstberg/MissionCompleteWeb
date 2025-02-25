import { useState } from 'react';

export default function Dashboard() {
  const [selectedView, setSelectedView] = useState<'matrix' | 'list'>('matrix');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-forest-green">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView('matrix')}
            className={`px-4 py-2 rounded ${
              selectedView === 'matrix'
                ? 'bg-forest-green text-white'
                : 'bg-sage-green text-charcoal'
            }`}
          >
            Matrix View
          </button>
          <button
            onClick={() => setSelectedView('list')}
            className={`px-4 py-2 rounded ${
              selectedView === 'list'
                ? 'bg-forest-green text-white'
                : 'bg-sage-green text-charcoal'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {selectedView === 'matrix' ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-charcoal">Matrix view coming soon...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-charcoal">List view coming soon...</p>
        </div>
      )}
    </div>
  );
} 