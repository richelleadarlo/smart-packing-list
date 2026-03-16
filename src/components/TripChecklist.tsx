/**
 * TripChecklist - Full checklist view for a specific trip
 * Users check/uncheck items, with progress tracking
 */
import { ArrowLeft } from 'lucide-react';
import { Trip, getCategoryEmoji, CATEGORIES } from '@/lib/storage';

interface Props {
  trip: Trip;
  onBack: () => void;
  onToggleItem: (itemId: string) => void;
}

const TripChecklist = ({ trip, onBack, onToggleItem }: Props) => {
  const packed = trip.items.filter(i => i.checked).length;
  const total = trip.items.length;
  const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

  // Group items by category
  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    items: trip.items.filter(i => i.category === cat.value),
  })).filter(g => g.items.length > 0);

  return (
    <div className="max-w-lg mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 font-typewriter text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft size={16} /> back to trips
      </button>

      {/* Trip header — styled like a notebook page */}
      <div className="relative bg-paper paper-shadow rounded-sm p-6 pt-8 mb-6 stamp-rotate-2">
        <div className="washi-tape" />

        <h2 className="font-handwritten text-4xl font-bold text-foreground mb-1">{trip.name}</h2>
        {trip.destination && (
          <p className="font-typewriter text-sm text-muted-foreground">📍 {trip.destination}</p>
        )}
        {trip.date && (
          <p className="font-typewriter text-xs text-muted-foreground mt-1">📅 {trip.date}</p>
        )}

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-handwritten text-lg text-foreground">{packed} of {total} packed</span>
            <span className="font-handwritten text-2xl font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="font-handwritten text-lg text-accent mt-2 text-center">🎉 All packed! Bon voyage!</p>
          )}
        </div>
      </div>

      {/* Checklist grouped by category */}
      {grouped.map(group => (
        <div key={group.value} className="mb-5">
          <h3 className="font-handwritten text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
            <span>{group.emoji}</span> {group.label}
          </h3>
          <ul className="space-y-1.5">
            {group.items.map(item => (
              <li
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`flex items-center gap-3 py-2 px-3 rounded cursor-pointer transition-all duration-200 border border-transparent hover:border-border ${
                  item.checked ? 'bg-secondary/50' : 'bg-paper'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => onToggleItem(item.id)}
                  className="scrapbook-check w-4 h-4 rounded"
                  onClick={e => e.stopPropagation()}
                />
                <span className={`font-typewriter text-sm flex-1 transition-all duration-200 ${
                  item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}>
                  {item.name}
                </span>
                {item.checked && <span className="text-xs">✓</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TripChecklist;
