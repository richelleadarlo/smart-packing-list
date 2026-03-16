/**
 * Smart Packing List — Main page
 * Scrapbook-inspired design with boarding pass trip cards
 */
import { useState, useEffect, useCallback } from 'react';
import { PlaneTakeoff, Plus } from 'lucide-react';
import TemplateEditor from '@/components/TemplateEditor';
import BoardingPass from '@/components/BoardingPass';
import TripChecklist from '@/components/TripChecklist';
import NewTripDialog from '@/components/NewTripDialog';
import {
  TemplateItem, Trip,
  getTemplate, saveTemplate,
  getTrips, createTrip, updateTrip, deleteTrip,
} from '@/lib/storage';

const Index = () => {
  // --- State ---
  const [template, setTemplate] = useState<TemplateItem[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showNewTrip, setShowNewTrip] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setTemplate(getTemplate());
    setTrips(getTrips());
  }, []);

  // Save template whenever it changes
  const handleTemplateChange = useCallback((items: TemplateItem[]) => {
    setTemplate(items);
    saveTemplate(items);
  }, []);

  // Create a new trip from the template
  const handleCreateTrip = useCallback((name: string, destination: string, date: string) => {
    const trip = createTrip(name, destination, date, template);
    setTrips(prev => [...prev, trip]);
    setShowNewTrip(false);
  }, [template]);

  // Toggle a checklist item
  const handleToggleItem = useCallback((itemId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== selectedTripId) return trip;
      const updated = {
        ...trip,
        items: trip.items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      };
      updateTrip(updated);
      return updated;
    }));
  }, [selectedTripId]);

  // Delete a trip
  const handleDeleteTrip = useCallback((tripId: string) => {
    deleteTrip(tripId);
    setTrips(prev => prev.filter(t => t.id !== tripId));
    if (selectedTripId === tripId) setSelectedTripId(null);
  }, [selectedTripId]);

  // The selected trip object
  const selectedTrip = trips.find(t => t.id === selectedTripId);

  // Small rotation for boarding passes to feel organic
  const rotations = [-1.5, 0.8, -0.5, 1.2, -0.8, 0.5];

  return (
    <div className="min-h-screen scrapbook-bg">
      {/* Header */}
      <header className="text-center pt-8 pb-6 px-4">
        <div className="flex items-center justify-center gap-3 mb-1">
          <PlaneTakeoff size={28} className="text-primary" />
          <h1 className="font-handwritten text-5xl font-bold text-foreground">
            Smart Packing List
          </h1>
        </div>
        <p className="font-typewriter text-sm text-muted-foreground">
          your scrapbook travel companion ✈️
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/* If a trip is selected, show its checklist */}
        {selectedTrip ? (
          <TripChecklist
            trip={selectedTrip}
            onBack={() => setSelectedTripId(null)}
            onToggleItem={handleToggleItem}
          />
        ) : (
          <>
            {/* Template Section */}
            <section className="mb-10">
              <TemplateEditor items={template} onChange={handleTemplateChange} />
            </section>

            {/* Trips Section */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-handwritten text-3xl font-bold text-foreground">
                  🗺️ My Trips
                </h2>
                <button
                  onClick={() => setShowNewTrip(true)}
                  className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded px-4 py-2 font-typewriter text-sm hover:opacity-90 transition-opacity"
                >
                  <Plus size={16} /> Start New Trip
                </button>
              </div>

              {trips.length === 0 ? (
                <div className="text-center py-12 bg-paper paper-shadow rounded-sm stamp-rotate-2">
                  <p className="font-handwritten text-2xl text-muted-foreground mb-2">No trips yet!</p>
                  <p className="font-typewriter text-sm text-muted-foreground">
                    Click "Start New Trip" to duplicate your template
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {trips.map((trip, i) => (
                    <BoardingPass
                      key={trip.id}
                      trip={trip}
                      rotation={rotations[i % rotations.length]}
                      onClick={() => setSelectedTripId(trip.id)}
                      onDelete={(e) => {
                        e.stopPropagation();
                        handleDeleteTrip(trip.id);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* New Trip Dialog */}
      <NewTripDialog
        open={showNewTrip}
        onClose={() => setShowNewTrip(false)}
        onCreate={handleCreateTrip}
      />
    </div>
  );
};

export default Index;
