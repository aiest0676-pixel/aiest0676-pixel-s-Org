import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { NoteItem } from '../types';
import { NoteItemCard } from './NoteItemCard';
import { QuickCaptureBar } from './QuickCaptureBar';

interface LearningViewProps {
  notes: NoteItem[];
  onToggleStatus: (id: string) => void;
  onToggleStar: (id: string) => void;
  onSelectNote: (note: NoteItem) => void;
  onAddNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onOpenFullModal: (initialData?: Partial<NoteItem>) => void;
}

export const LearningView: React.FC<LearningViewProps> = ({
  notes,
  onToggleStatus,
  onToggleStar,
  onSelectNote,
  onAddNote,
  onOpenFullModal
}) => {
  const learningItems = notes.filter(n => n.category === 'การเรียนรู้');

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2a2d2e] dark:text-[#e8e6df]">
            คลังความรู้ & การพัฒนาตนเอง
          </h2>
          <p className="mt-1 text-xs text-[#85877f]">
            บันทึกสาระสำคัญจากหนังสือ คอร์สเรียน และบทเรียนชีวิต ({learningItems.length} หัวข้อ)
          </p>
        </div>

        <button
          onClick={() => onOpenFullModal({ category: 'การเรียนรู้' })}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ จดสรุปความรู้ใหม่</span>
        </button>
      </div>

      <QuickCaptureBar
        onAddNote={onAddNote}
        onOpenFullModal={onOpenFullModal}
        defaultCategory="การเรียนรู้"
      />

      {learningItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningItems.map(item => (
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
        <div className="p-12 text-center rounded-xl border border-dashed border-[#e4e0d5] dark:border-[#303435] bg-[#fbfaf6]/40 dark:bg-[#212425]/40">
          <BookOpen className="w-10 h-10 mx-auto text-[#3b7562]" />
          <p className="mt-3 text-sm font-medium text-[#2a2d2e] dark:text-[#e8e6df]">
            ยังไม่มีบันทึกการเรียนรู้
          </p>
          <p className="mt-1 text-xs text-[#85877f]">
            เริ่มต้นบันทึกสิ่งที่ได้เรียนรู้จากหนังสือ พอดแคสต์ หรือคอร์สที่กำลังเรียน
          </p>
          <button
            onClick={() => onOpenFullModal({ category: 'การเรียนรู้' })}
            className="mt-4 px-3.5 py-1.5 text-xs font-medium text-[#3b7562] dark:text-[#6fae98] border border-[#3b7562]/40 rounded-lg cursor-pointer"
          >
            + บันทึกความรู้แรก
          </button>
        </div>
      )}
    </div>
  );
};
