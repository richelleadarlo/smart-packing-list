/**
 * NewTripDialog - Modal for creating a new trip
 */
import { useState } from 'react';
import { X, Plane } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, destination: string, date: string) => void;
}

const NewTripDialog = ({ open, onClose, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), destination.trim(), date);
    setName('');
    setDestination('');
    setDate('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-paper paper-shadow rounded-sm p-6 pt-8 w-full max-w-md stamp-rotate-1"
      >
        <div className="washi-tape" />

        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Plane size={20} className="text-primary" />
          <h2 className="font-handwritten text-3xl font-bold text-foreground">New Trip</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-typewriter text-xs text-muted-foreground block mb-1">Trip Name *</label>
            <input
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm font-typewriter outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              placeholder="e.g. Japan Trip"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="font-typewriter text-xs text-muted-foreground block mb-1">Destination</label>
            <input
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm font-typewriter outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              placeholder="e.g. Tokyo, Japan"
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
          </div>
          <div>
            <label className="font-typewriter text-xs text-muted-foreground block mb-1">Date</label>
            <input
              type="date"
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm font-typewriter outline-none focus:ring-1 focus:ring-primary text-foreground"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground rounded px-4 py-2.5 font-typewriter text-sm hover:opacity-90 transition-opacity mt-2"
          >
            ✈️ Start Packing!
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTripDialog;
