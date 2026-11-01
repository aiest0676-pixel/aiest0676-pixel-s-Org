import React, { useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { NoteItem } from '../types';
import { NoteItemCard } from './NoteItemCard';
import { QuickCaptureBar } from './QuickCaptureBar';

interface TasksViewProps {
  notes: NoteItem[];
  onToggleStatus: (id: string) => void;
  onToggleStar: (id: string) => void;
  onSelectNote: (note: NoteItem) => void;
  onAddNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onOpenFullModal: (initialData?: Partial<NoteItem>) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  notes,
  onToggleStatus,
  onToggleStar,
  onSelectNote,
  onAddNote,
  onOpenFullModal
}) => {
  const [filter, setFilter] = useState<'pending' | 'completed' | 'all' | 'high'>('pending');

  const taskItems = notes.filter(n => n.category === 'งาน');
  const pendingCount = taskItems.filter(n => n.status !== 'เสร็จแล้ว').length;
  const completedCount = taskItems.filter(n => n.status === 'เสร็จแล้ว').length;

  const filteredTasks = taskItems.filter(item => {
    if (filter === 'pending') return item.status !== 'เสร็จแล้ว';
    if (filter === 'completed') return item.status === 'เสร็จแล้ว';
    if (filter === 'high') return item.priority === 'สูง' || item.priority === 'ด่วนมาก';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2a2d2e] dark:text-[#e8e6df]">
            รายการงาน & สิ่งที่ต้องทำ
          </h2>
          <p className="mt-1 text-xs text-[#85877f]">
            ค้างอยู่ {pendingCount} งาน · สำเร็จแล้ว {completedCount} งาน
          </p>
        </div>

        <button
          onClick={() => onOpenFullModal({ category: 'งาน' })}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ สร้างงานใหม่</span>
        </button>
      </div>

      <QuickCaptureBar
        onAddNote={onAddNote}
        onOpenFullModal={onOpenFullModal}
        defaultCategory="งาน"
      />

      <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435]">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
            }`}
          >
            งานที่ค้างอยู่ ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
            }`}
          >
            งานทั้งหมด ({taskItems.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'completed'
                ? 'bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
            }`}
          >
            เสร็จแล้ว ({completedCount})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'high'
                ? 'bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
            }`}
          >
            ด่วน & สำคัญ
          </button>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="space-y-2.5">
          {filteredTasks.map(item => (
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
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-[#e4e0d5] dark:border-[#303435] bg-[#fbfaf6]/40 dark:bg-[#212425]/40">
          <CheckCircle2 className="w-10 h-10 mx-auto text-[#3b7562]" />
          <p className="mt-3 text-sm font-medium text-[#2a2d2e] dark:text-[#e8e6df]">
            {filter === 'pending'
              ? 'ไม่มีงานค้างอยู่ในขณะนี้! คุณเคลียร์งานทั้งหมดเรียบร้อยแล้ว'
              : 'ไม่พบงานที่ตรงกับตัวกรองนี้'}
          </p>
          <p className="mt-1 text-xs text-[#85877f]">
            เพิ่มงานใหม่ได้ทันทีเพื่อวางแผนล่วงหน้า
          </p>
          <button
            onClick={() => onOpenFullModal({ category: 'งาน' })}
            className="mt-4 px-3.5 py-1.5 text-xs font-medium text-[#3b7562] dark:text-[#6fae98] border border-[#3b7562]/40 rounded-lg cursor-pointer"
          >
            + สร้างงานใหม่
          </button>
        </div>
      )}
    </div>
  );
};
