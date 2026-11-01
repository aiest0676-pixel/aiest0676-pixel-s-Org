import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen,
  Plus,
  ArrowRight,
  Sparkles,
  Filter,
  Star
} from 'lucide-react';
import { NoteItem } from '../types';
import { NoteItemCard } from './NoteItemCard';
import { QuickCaptureBar } from './QuickCaptureBar';
import { formatThaiFullDate } from '../utils/dateFormatter';

interface OverviewViewProps {
  notes: NoteItem[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    totalAll: number;
    taskPercentage: number;
  };
  onToggleStatus: (id: string) => void;
  onToggleStar: (id: string) => void;
  onSelectNote: (note: NoteItem) => void;
  onAddNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onOpenFullModal: (initialData?: Partial<NoteItem>) => void;
  onGoToTab: (tab: 'tasks' | 'notes' | 'learning' | 'wishlist') => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  notes,
  stats,
  onToggleStatus,
  onToggleStar,
  onSelectNote,
  onAddNote,
  onOpenFullModal,
  onGoToTab
}) => {
  const [taskFilter, setTaskFilter] = useState<'pending' | 'all' | 'completed'>('pending');
  const [recentFilter, setRecentFilter] = useState<'all' | 'notes' | 'starred'>('all');

  const allTasks = notes.filter(n => n.category === 'งาน');
  const filteredTasks = allTasks.filter(task => {
    if (taskFilter === 'pending') return task.status !== 'เสร็จแล้ว';
    if (taskFilter === 'completed') return task.status === 'เสร็จแล้ว';
    return true;
  });

  const recentItems = notes
    .filter(item => {
      if (recentFilter === 'starred') return item.starred;
      if (recentFilter === 'notes') return item.category === 'โน้ต';
      return true;
    })
    .slice(0, 8);

  const pinnedItems = notes.filter(n => n.starred);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2a2d2e] dark:text-[#e8e6df]">
            ภาพรวมชีวิต
          </h2>
          <p className="mt-1 text-sm text-[#85877f]">
            {formatThaiFullDate(new Date())}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenFullModal({ category: 'งาน' })}
            className="px-3.5 py-1.5 text-xs font-medium text-[#2a2d2e] dark:text-[#e8e6df] hover:bg-[#ece8de] dark:hover:bg-[#2b2f30] rounded-lg border border-[#e4e0d5] dark:border-[#303435] transition-colors cursor-pointer"
          >
            + สร้างงาน
          </button>
          <button
            onClick={() => onOpenFullModal({ category: 'โน้ต' })}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ จดโน้ตใหม่</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Stat Counters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold tabular-nums font-mono text-[#2a2d2e] dark:text-[#e8e6df]">
            {stats.pendingTasks}
          </div>
          <div className="mt-1 text-xs text-[#85877f]">งานที่ยังไม่เสร็จ</div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold tabular-nums font-mono text-[#3b7562] dark:text-[#6fae98]">
            {stats.completedTasks}
          </div>
          <div className="mt-1 text-xs text-[#85877f]">งานที่เสร็จแล้ว</div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] shadow-xs">
          <div
            className={`text-2xl sm:text-3xl font-bold tabular-nums font-mono ${
              stats.overdueTasks > 0 ? 'text-[#b0503e] dark:text-[#d98a76]' : 'text-[#2a2d2e] dark:text-[#e8e6df]'
            }`}
          >
            {stats.overdueTasks}
          </div>
          <div className="mt-1 text-xs text-[#85877f]">งานเลยกำหนด</div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] shadow-xs">
          <div className="text-2xl sm:text-3xl font-bold tabular-nums font-mono text-[#2a2d2e] dark:text-[#e8e6df]">
            {stats.totalAll}
          </div>
          <div className="mt-1 text-xs text-[#85877f]">รายการทั้งหมด</div>
        </div>
      </div>

      {/* 3. Progress Bar Component */}
      <div className="p-4 sm:p-5 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-[#2a2d2e] dark:text-[#e8e6df]">
            ความคืบหน้าของงาน
          </h3>
          <span className="text-xs font-medium tabular-nums text-[#3b7562] dark:text-[#6fae98] font-mono">
            {stats.taskPercentage}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full overflow-hidden bg-[#e4e0d5] dark:bg-[#303435]">
          <div
            className="h-full bg-[#3b7562] dark:bg-[#6fae98] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${stats.taskPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px] text-[#85877f]">
          <span>
            เสร็จแล้ว {stats.completedTasks} จาก {stats.totalTasks} งาน ({stats.taskPercentage}%)
          </span>
          {stats.taskPercentage === 100 && stats.totalTasks > 0 && (
            <span className="text-[#3b7562] dark:text-[#6fae98] font-medium">ยอดเยี่ยมมาก! งานทั้งหมดเสร็จสิ้นแล้ว 🎉</span>
          )}
        </div>
      </div>

      {/* 4. Instant Quick Capture Bar */}
      <QuickCaptureBar
        onAddNote={onAddNote}
        onOpenFullModal={onOpenFullModal}
        defaultCategory="โน้ต"
      />

      {/* 5. Pinned Items Quick Strip */}
      {pinnedItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold text-[#85877f] uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>ปักหมุดไว้ (Pinned Notes)</span>
            </h3>
            <span className="text-xs text-[#85877f]">{pinnedItems.length} รายการ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pinnedItems.map(item => (
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
        </div>
      )}

      {/* 6. Two-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#2a2d2e] dark:text-[#e8e6df]">
                งานที่ควรทำต่อ
              </h3>
              <span className="text-xs font-mono tabular-nums text-[#85877f]">
                ({filteredTasks.length})
              </span>
            </div>

            <div className="flex items-center p-0.5 rounded-lg border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435]">
              <button
                onClick={() => setTaskFilter('pending')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  taskFilter === 'pending'
                    ? 'bg-[#fbfaf6] dark:bg-[#212425] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                    : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
                }`}
              >
                ค้างอยู่
              </button>
              <button
                onClick={() => setTaskFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  taskFilter === 'all'
                    ? 'bg-[#fbfaf6] dark:bg-[#212425] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                    : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setTaskFilter('completed')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  taskFilter === 'completed'
                    ? 'bg-[#fbfaf6] dark:bg-[#212425] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                    : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
                }`}
              >
                เสร็จแล้ว
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
            <div className="p-8 text-center rounded-xl border border-dashed border-[#e4e0d5] dark:border-[#303435] bg-[#fbfaf6]/40 dark:bg-[#212425]/40">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[#3b7562]" />
              <p className="mt-2 text-sm font-medium text-[#2a2d2e] dark:text-[#e8e6df]">
                ไม่มีงานค้างอยู่ในขณะนี้
              </p>
              <p className="mt-1 text-xs text-[#85877f]">
                เคลียร์งานครบเรียบร้อย สามารถกดสร้างงานใหม่ได้ตลอดเวลา
              </p>
              <button
                onClick={() => onOpenFullModal({ category: 'งาน' })}
                className="mt-4 px-3.5 py-1.5 text-xs font-medium text-[#3b7562] dark:text-[#6fae98] border border-[#3b7562]/40 rounded-lg cursor-pointer"
              >
                + เพิ่มงานใหม่
              </button>
            </div>
          )}

          <div className="pt-1">
            <button
              onClick={() => onGoToTab('tasks')}
              className="flex items-center gap-1.5 text-xs font-medium text-[#3b7562] dark:text-[#6fae98] hover:underline cursor-pointer"
            >
              <span>ดูตารางงานทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#2a2d2e] dark:text-[#e8e6df]">
                เพิ่มล่าสุด
              </h3>
              <span className="text-xs font-mono tabular-nums text-[#85877f]">
                ({recentItems.length})
              </span>
            </div>

            <div className="flex items-center p-0.5 rounded-lg border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435]">
              <button
                onClick={() => setRecentFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  recentFilter === 'all'
                    ? 'bg-[#fbfaf6] dark:bg-[#212425] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                    : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setRecentFilter('notes')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  recentFilter === 'notes'
                    ? 'bg-[#fbfaf6] dark:bg-[#212425] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                    : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
                }`}
              >
                เฉพาะโน้ต
              </button>
              <button
                onClick={() => setRecentFilter('starred')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  recentFilter === 'starred'
                    ? 'bg-[#fbfaf6] dark:bg-[#212425] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                    : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
                }`}
              >
                ปักหมุด
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {recentItems.map(item => (
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

          <div className="pt-1">
            <button
              onClick={() => onGoToTab('notes')}
              className="flex items-center gap-1.5 text-xs font-medium text-[#3b7562] dark:text-[#6fae98] hover:underline cursor-pointer"
            >
              <span>ดูคลังบันทึกทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
