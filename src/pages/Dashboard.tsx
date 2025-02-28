import { useState } from 'react';

export default function Dashboard() {
  const [selectedView, setSelectedView] = useState<'matrix' | 'list'>('matrix');

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-beige to-forest-green/10 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-forest-green">Dashboard</h1>
            <p className="text-charcoal/60 mt-1">View and manage your tasks</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedView('matrix')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                selectedView === 'matrix'
                  ? 'bg-forest-green text-white shadow-sm hover:bg-forest-green/90'
                  : 'bg-sage-green/20 text-charcoal hover:bg-sage-green/30'
              }`}
            >
              Matrix View
            </button>
            <button
              onClick={() => setSelectedView('list')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                selectedView === 'list'
                  ? 'bg-forest-green text-white shadow-sm hover:bg-forest-green/90'
                  : 'bg-sage-green/20 text-charcoal hover:bg-sage-green/30'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {selectedView === 'matrix' ? (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-forest-green/20 rounded-lg">
              <p className="text-charcoal/60 text-lg">Matrix view coming soon...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-forest-green/20 rounded-lg">
              <p className="text-charcoal/60 text-lg">List view coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 