/**
 * LocalStorage helpers for Smart Packing List
 * Manages template items and trip data persistence
 */

// --- Types ---
export interface TemplateItem {
  id: string;
  name: string;
  category: 'clothes' | 'electronics' | 'documents' | 'toiletries' | 'other';
}

export interface TripItem extends TemplateItem {
  checked: boolean;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  date: string;
  items: TripItem[];
  createdAt: string;
}

// --- Storage Keys ---
const TEMPLATE_KEY = 'smart-packing-template';
const TRIPS_KEY = 'smart-packing-trips';

// --- Default template ---
const DEFAULT_TEMPLATE: TemplateItem[] = [
  { id: '1', name: 'Passport', category: 'documents' },
  { id: '2', name: 'Phone Charger', category: 'electronics' },
  { id: '3', name: 'T-Shirts', category: 'clothes' },
  { id: '4', name: 'Toothbrush', category: 'toiletries' },
  { id: '5', name: 'Underwear', category: 'clothes' },
  { id: '6', name: 'Headphones', category: 'electronics' },
];

// --- Helpers ---
export const generateId = () => Math.random().toString(36).substring(2, 9);

// --- Template CRUD ---
export function getTemplate(): TemplateItem[] {
  const data = localStorage.getItem(TEMPLATE_KEY);
  return data ? JSON.parse(data) : DEFAULT_TEMPLATE;
}

export function saveTemplate(items: TemplateItem[]) {
  localStorage.setItem(TEMPLATE_KEY, JSON.stringify(items));
}

// --- Trips CRUD ---
export function getTrips(): Trip[] {
  const data = localStorage.getItem(TRIPS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTrips(trips: Trip[]) {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

export function createTrip(name: string, destination: string, date: string, template: TemplateItem[]): Trip {
  const trip: Trip = {
    id: generateId(),
    name,
    destination,
    date,
    createdAt: new Date().toISOString(),
    items: template.map(item => ({ ...item, checked: false })),
  };
  const trips = getTrips();
  trips.push(trip);
  saveTrips(trips);
  return trip;
}

export function updateTrip(updatedTrip: Trip) {
  const trips = getTrips().map(t => t.id === updatedTrip.id ? updatedTrip : t);
  saveTrips(trips);
}

export function deleteTrip(tripId: string) {
  const trips = getTrips().filter(t => t.id !== tripId);
  saveTrips(trips);
}

// --- Category config ---
export const CATEGORIES = [
  { value: 'clothes' as const, label: 'Clothes', emoji: '👕' },
  { value: 'electronics' as const, label: 'Electronics', emoji: '🔌' },
  { value: 'documents' as const, label: 'Documents', emoji: '📄' },
  { value: 'toiletries' as const, label: 'Toiletries', emoji: '🧴' },
  { value: 'other' as const, label: 'Other', emoji: '📦' },
];

export function getCategoryEmoji(category: string): string {
  return CATEGORIES.find(c => c.value === category)?.emoji || '📦';
}
