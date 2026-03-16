/**
 * BoardingPass - A scrapbook-style boarding pass card for each trip
 * Clicking opens the trip checklist
 */
import { Plane, Trash2 } from 'lucide-react';
import { Trip, getCategoryEmoji } from '@/lib/storage';

interface Props {
  trip: Trip;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  rotation?: number;
}

const BoardingPass = ({ trip, onClick, onDelete, rotation = 0 }: Props) => {
  // Calculate packing progress
  const packed = trip.items.filter(i => i.checked).length;
  const total = trip.items.length;
  const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

  // Unique category emojis for the trip
  const categoryEmojis = [...new Set(trip.items.map(i => getCategoryEmoji(i.category)))];

  return (
    <div
      onClick={onClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className="cursor-pointer group relative bg-boarding-pass paper-shadow rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
    >
      {/* Top section */}
      <div className="flex">
        {/* Main info */}
        <div className="flex-1 p-4 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Plane size={14} className="text-boarding-pass-accent" />
            <span className="font-typewriter text-[10px] text-muted-foreground tracking-widest uppercase">Boarding Pass</span>
          </div>
          <h3 className="font-handwritten text-2xl font-bold text-foreground leading-tight">{trip.name}</h3>
          {trip.destination && (
            <p className="font-typewriter text-xs text-muted-foreground mt-0.5">📍 {trip.destination}</p>
          )}
        </div>

        {/* Tear-off stub */}
        <div className="w-20 perforation flex flex-col items-center justify-center p-2 bg-card/40">
          <span className="font-handwritten text-2xl font-bold text-primary">{progress}%</span>
          <span className="font-typewriter text-[9px] text-muted-foreground">packed</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-typewriter text-[10px] text-muted-foreground">{trip.date || 'No date'}</span>
          <span className="text-[10px] text-muted-foreground">•</span>
          <span className="font-typewriter text-[10px] text-muted-foreground">{packed}/{total} items</span>
        </div>
        <div className="flex items-center gap-1">
          {categoryEmojis.slice(0, 4).map((emoji, i) => (
            <span key={i} className="text-xs">{emoji}</span>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Delete button (shown on hover) */}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/10 hover:bg-destructive/20 rounded-full p-1.5"
      >
        <Trash2 size={12} className="text-destructive" />
      </button>
    </div>
  );
};

export default BoardingPass;
