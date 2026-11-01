import React, { useState } from 'react';
import { LayoutGrid, List, Plus, Search, Star, SortAsc } from 'lucide-react';
import { NoteItem } from '../types';
import { NoteItemCard } from './NoteItemCard';
import { QuickCaptureBar } from './QuickCaptureBar';

interface NotesViewProps {
  notes: NoteItem[];
  allTags: string[];
  onToggleStatus: (id: string) => void;
  onToggleStar: (id: string) => void;
  onSelectNote: (note: NoteItem) => void;
  onAddNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onOpenFullModal: (initialData?: Partial<NoteItem>) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  allTags,
  onToggleStatus,
  onToggleStar,
  onSelectNote,
  onAddNote,
  onOpenFullModal
}) => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'created'>('updated');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [search, setSearch] = useState('');

  const noteItems = notes.filter(n => n.category === 'โน้ต' || n.category === 'ไอเดีย');

  const filtered = noteItems
    .filter(item => {
      if (onlyStarred && !item.starred) return false;
      if (selectedTag && !item.tags.includes(selectedTag)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q) ||
          item.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.title.localeCompare(b.title, 'th');
    });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2a2d2e] dark:text-[#e8e6df]">
            คลังโน้ต & บันทึกความคิด
          </h2>
          <p className="mt-1 text-xs text-[#85877f]">
            ทั้งหมด {noteItems.length} รายการ · บันทึกไอเดีย โปรเจกต์ และความคิดสร้างสรรค์
          </p>
        </div>

        <button
          onClick={() => onOpenFullModal({ category: 'โน้ต' })}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ จดโน้ตใหม่</span>
        </button>
      </div>

      <QuickCaptureBar
        onAddNote={onAddNote}
        onOpenFullModal={onOpenFullModal}
        defaultCategory="โน้ต"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435]">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#85877f]" />
          <input
            type="text"
            placeholder="ค้นหาในคลังโน้ต..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <button
            onClick={() => setOnlyStarred(!onlyStarred)}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              onlyStarred
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                : 'text-[#85877f] border-[#e4e0d5] dark:border-[#303435] hover:bg-[#f2efe8] dark:hover:bg-[#1b1d1e]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyStarred ? 'fill-amber-400' : ''}`} />
            <span>ปักหมุด</span>
          </button>

          <div className="flex items-center gap-1 text-xs text-[#85877f]">
            <SortAsc className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              aria-label="เรียงลำดับ"
              className="px-2 py-1.5 text-xs rounded-lg border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] focus:outline-none cursor-pointer"
            >
              <option value="updated">แก้ไขล่าสุด</option>
              <option value="created">สร้างล่าสุด</option>
              <option value="title">ชื่อ (ก-ฮ / A-Z)</option>
            </select>
          </div>

          <div className="flex items-center p-0.5 rounded-lg border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435]">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                layout === 'grid'
                  ? 'bg-[#fbfaf6] dark:bg-[#212425] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                  : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
              }`}
              title="แบบการ์ด (Grid)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                layout === 'list'
                  ? 'bg-[#fbfaf6] dark:bg-[#212425] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                  : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
              }`}
              title="แบบรายการ (List)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[#85877f] mr-1">แท็ก:</span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              selectedTag === null
                ? 'bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98] font-medium'
                : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
            }`}
          >
            ทั้งหมด
          </button>
          {allTags.map(tag => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98] font-medium'
                    : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length > 0 ? (
        layout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => (
              <NoteItemCard
                key={item.id}
                item={item}
                layout="card"
                onToggleStatus={onToggleStatus}
                onToggleStar={onToggleStar}
                onClick={onSelectNote}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(item => (
              <NoteItemCard
                key={item.id}
                item={item}
                layout="row"
                onToggleStatus={onToggleStatus}
                onToggleStar={onToggleStar}
                onClick={onSelectNote}
              />
            ))}
          </div>
        )
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-[#e4e0d5] dark:border-[#303435] bg-[#fbfaf6]/40 dark:bg-[#212425]/40">
          <p className="text-sm font-medium text-[#2a2d2e] dark:text-[#e8e6df]">
            ไม่พบบันทึกที่ตรงกับเงื่อนไข
          </p>
          <p className="mt-1 text-xs text-[#85877f]">
            ลองปรับเปลี่ยนคำค้นหา หรือกดปุ่มด้านล่างเพื่อจดบันทึกใหม่
          </p>
          <button
            onClick={() => onOpenFullModal({ category: 'โน้ต' })}
            className="mt-4 px-3.5 py-1.5 text-xs font-medium text-[#3b7562] dark:text-[#6fae98] border border-[#3b7562]/40 rounded-lg cursor-pointer"
          >
            + จดโน้ตใหม่
          </button>
        </div>
      )}
    </div>
  );
};
