import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, Plus } from 'lucide-react';
import { NoteItem } from '../types';
import { formatThaiShortDate } from '../utils/dateFormatter';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NoteItem[];
  onSelectNote: (note: NoteItem) => void;
  onOpenQuickAddWithTitle: (title: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  notes,
  onSelectNote,
  onOpenQuickAddWithTitle
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredNotes = notes.filter(n => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q)) ||
      n.category.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredNotes.length + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (filteredNotes.length + 1)) % (filteredNotes.length + 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredNotes.length) {
        onSelectNote(filteredNotes[selectedIndex]);
        onClose();
      } else if (query.trim()) {
        onOpenQuickAddWithTitle(query.trim());
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-xl rounded-2xl border shadow-2xl bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-[#e4e0d5] dark:border-[#303435]">
          <Search className="w-5 h-5 text-[#3b7562] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="พิมพ์เพื่อค้นหาโน้ต, งาน, แท็ก หรือพิมพ์สิ่งที่อยากจด..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full text-sm bg-transparent text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredNotes.length > 0 ? (
            <div className="space-y-1">
              {filteredNotes.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectNote(item);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98]'
                        : 'text-[#2a2d2e] dark:text-[#e8e6df] hover:bg-[#f2efe8] dark:hover:bg-[#2b2f30]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[#85877f] font-mono text-[11px] shrink-0">
                        {item.category}
                      </span>
                      <span className="font-medium truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#85877f] shrink-0">
                      {item.dueDate && <span>{formatThaiShortDate(item.dueDate)}</span>}
                      {item.starred && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#85877f]">
              ไม่พบบันทึกที่ตรงกับ &ldquo;{query}&rdquo;
            </div>
          )}

          {query.trim() && (
            <div
              onClick={() => {
                onOpenQuickAddWithTitle(query.trim());
                onClose();
              }}
              className={`flex items-center justify-between p-2.5 mt-2 rounded-lg text-xs cursor-pointer border border-dashed border-[#3b7562]/60 ${
                selectedIndex === filteredNotes.length
                  ? 'bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98]'
                  : 'text-[#3b7562] dark:text-[#6fae98]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>สร้างโน้ตใหม่: &ldquo;{query}&rdquo;</span>
              </div>
              <span className="font-mono text-[10px] opacity-70">Enter</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-[#e4e0d5] dark:border-[#303435] text-[10px] text-[#85877f] bg-[#f2efe8] dark:bg-[#1b1d1e]">
          <span>กด ↑ ↓ เพื่อเลื่อน · Enter เพื่อเปิด</span>
          <span>ESC เพื่อปิด</span>
        </div>
      </div>
    </div>
  );
};
