/**
 * TemplateEditor - Manages the reusable packing list template
 * Users can add, edit, and delete items with categories
 */
import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { TemplateItem, CATEGORIES, getCategoryEmoji, generateId } from '@/lib/storage';

interface Props {
  items: TemplateItem[];
  onChange: (items: TemplateItem[]) => void;
}

const TemplateEditor = ({ items, onChange }: Props) => {
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<TemplateItem['category']>('other');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Add a new item to the template
  const handleAdd = () => {
    if (!newName.trim()) return;
    const newItem: TemplateItem = {
      id: generateId(),
      name: newName.trim(),
      category: newCategory,
    };
    onChange([...items, newItem]);
    setNewName('');
  };

  // Delete an item
  const handleDelete = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  // Start editing
  const startEdit = (item: TemplateItem) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  // Save edit
  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    onChange(items.map(item => item.id === id ? { ...item, name: editName.trim() } : item));
    setEditingId(null);
  };

  return (
    <div className="relative bg-paper paper-shadow rounded-sm p-6 pt-8 stamp-rotate-3">
      {/* Washi tape decoration */}
      <div className="washi-tape" />

      <h2 className="font-handwritten text-3xl font-bold text-foreground mb-1">
        ✂️ My Packing Template
      </h2>
      <p className="font-typewriter text-xs text-muted-foreground mb-4">
        your reusable packing list — edit anytime
      </p>

      {/* Item list */}
      <ul className="space-y-2 mb-4">
        {items.map(item => (
          <li key={item.id} className="flex items-center gap-2 py-1.5 px-2 rounded bg-card/60 border border-border/50">
            <span className="text-sm">{getCategoryEmoji(item.category)}</span>
            {editingId === item.id ? (
              <>
                <input
                  className="flex-1 bg-transparent border-b border-primary text-sm font-typewriter outline-none text-foreground"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit(item.id)}
                  autoFocus
                />
                <button onClick={() => saveEdit(item.id)} className="text-accent hover:scale-110 transition-transform"><Check size={16} /></button>
                <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:scale-110 transition-transform"><X size={16} /></button>
              </>
            ) : (
              <>
                <span className="flex-1 font-typewriter text-sm text-foreground">{item.name}</span>
                <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-typewriter">{item.category}</span>
                <button onClick={() => startEdit(item)} className="text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Add new item form */}
      <div className="flex gap-2 items-end flex-wrap">
        <input
          className="flex-1 min-w-[140px] bg-card border border-border rounded px-3 py-2 text-sm font-typewriter outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          placeholder="Add new item..."
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <select
          className="bg-card border border-border rounded px-2 py-2 text-sm font-typewriter text-foreground"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value as TemplateItem['category'])}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="bg-primary text-primary-foreground rounded px-3 py-2 text-sm font-typewriter hover:opacity-90 transition-opacity flex items-center gap-1"
        >
          <Plus size={16} /> Add
        </button>
      </div>
    </div>
  );
};

export default TemplateEditor;
