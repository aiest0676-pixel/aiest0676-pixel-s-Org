import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Plus
} from 'lucide-react';
import { NoteItem } from '../types';
import { NoteItemCard } from './NoteItemCard';
import { formatThaiShortDate } from '../utils/dateFormatter';

interface CalendarReviewViewProps {
  notes: NoteItem[];
  onToggleStatus: (id: string) => void;
  onToggleStar: (id: string) => void;
  onSelectNote: (note: NoteItem) => void;
  onAddNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onOpenFullModal: (initialData?: Partial<NoteItem>) => void;
}

export const CalendarReviewView: React.FC<CalendarReviewViewProps> = ({
  notes,
  onToggleStatus,
  onToggleStar,
  onSelectNote,
  onAddNote,
  onOpenFullModal
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 10, 2));
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);
  const [generatedReview, setGeneratedReview] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const notesByDate = React.useMemo(() => {
    const map = new Map<string, NoteItem[]>();
    notes.forEach(note => {
      const dateKey = note.dueDate || note.createdAt.split('T')[0];
      if (dateKey) {
        const existing = map.get(dateKey) || [];
        existing.push(note);
        map.set(dateKey, existing);
      }
    });
    return map;
  }, [notes]);

  const selectedDateNotes = selectedDayStr ? notesByDate.get(selectedDayStr) || [] : [];

  const handleGenerateWeeklyReview = () => {
    const completedTasks = notes.filter(n => n.category === 'งาน' && n.status === 'เสร็จแล้ว');
    const recentNotes = notes.filter(n => n.category === 'โน้ต' || n.category === 'การเรียนรู้');
    const pendingTasks = notes.filter(n => n.category === 'งาน' && n.status !== 'เสร็จแล้ว');

    const reviewContent = `## 🎯 สรุปผลงานและความคืบหน้าประจำสัปดาห์
- จัดการงานสำเร็จทั้งหมด ${completedTasks.length} รายการ:
${completedTasks.map(t => `  ✓ ${t.title} (${t.priority})`).join('\n')}

## 💡 บันทึก & ความรู้ใหม่ที่ได้เรียนรู้
${recentNotes.map(n => `- ${n.title}: ${n.content.slice(0, 80)}...`).join('\n')}

## 🚀 เป้าหมายโฟกัสสัปดาห์ถัดไป
${pendingTasks.length > 0 ? pendingTasks.map(p => `- [ ] ${p.title}`).join('\n') : '- [ ] วางแผนโปรเจกต์ใหม่และจัดระเบียบตารางชีวิต'}`;

    setGeneratedReview(reviewContent);
  };

  const handleSaveReviewAsNote = () => {
    if (!generatedReview) return;
    onAddNote({
      title: `สรุปสัปดาห์ประจำวันที่ ${formatThaiShortDate(new Date().toISOString())}`,
      content: generatedReview,
      category: 'โน้ต',
      priority: 'สูง',
      status: 'เสร็จแล้ว',
      tags: ['สรุปสัปดาห์', 'ทบทวนตนเอง', 'วางแผน'],
      starred: true
    });
    setGeneratedReview(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2a2d2e] dark:text-[#e8e6df]">
            ปฏิทิน & สรุปสัปดาห์ (Review)
          </h2>
          <p className="mt-1 text-xs text-[#85877f]">
            ดูภาพรวมกำหนดส่ง รายการงานตามวัน และสรุปความคืบหน้ารอบสัปดาห์
          </p>
        </div>

        <button
          onClick={handleGenerateWeeklyReview}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>สร้างสรุปสัปดาห์อัตโนมัติ</span>
        </button>
      </div>

      {generatedReview && (
        <div className="p-5 rounded-xl border bg-[#dfeae4]/50 dark:bg-[#26382f]/50 border-[#3b7562]/40 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3b7562]" />
              <h3 className="text-sm font-semibold text-[#2a2d2e] dark:text-[#e8e6df]">
                สรุปสัปดาห์อัตโนมัติ (Generated Weekly Review)
              </h3>
            </div>
            <button
              onClick={() => setGeneratedReview(null)}
              className="text-xs text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] cursor-pointer"
            >
              ปิด
            </button>
          </div>

          <pre className="p-3.5 rounded-lg bg-[#fbfaf6] dark:bg-[#212425] text-xs text-[#2a2d2e] dark:text-[#e8e6df] whitespace-pre-wrap font-sans leading-relaxed border border-[#e4e0d5] dark:border-[#303435]">
            {generatedReview}
          </pre>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleSaveReviewAsNote}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] rounded-lg shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>บันทึกเป็นโน้ตทางการ</span>
            </button>
          </div>
        </div>
      )}

      <div className="p-5 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-bold text-[#2a2d2e] dark:text-[#e8e6df]">
            {thaiMonths[month]} {year + 543}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] rounded-lg border border-[#e4e0d5] dark:border-[#303435] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2.5 py-1 text-xs text-[#85877f] hover:bg-[#f2efe8] dark:hover:bg-[#1b1d1e] rounded-lg border border-[#e4e0d5] dark:border-[#303435] cursor-pointer"
            >
              วันนี้
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] rounded-lg border border-[#e4e0d5] dark:border-[#303435] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#85877f] mb-2">
          <div>อา.</div>
          <div>จ.</div>
          <div>อ.</div>
          <div>พ.</div>
          <div>พฤ.</div>
          <div>ศ.</div>
          <div>ส.</div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 sm:h-20 p-1 rounded-lg opacity-20" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const fullDateKey = `${year}-${monthStr}-${dayStr}`;

            const dayItems = notesByDate.get(fullDateKey) || [];
            const isSelected = selectedDayStr === fullDateKey;

            return (
              <div
                key={fullDateKey}
                onClick={() => setSelectedDayStr(isSelected ? null : fullDateKey)}
                className={`h-16 sm:h-20 p-1.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#3b7562] bg-[#dfeae4]/50 dark:bg-[#26382f]/50'
                    : 'border-[#e4e0d5] dark:border-[#303435] hover:border-[#3b7562]/30 hover:bg-[#f2efe8]/50 dark:hover:bg-[#282c2d]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`tabular-nums font-mono font-medium ${
                      isSelected ? 'text-[#3b7562] dark:text-[#6fae98]' : 'text-[#2a2d2e] dark:text-[#e8e6df]'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayItems.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b7562]" />
                  )}
                </div>

                <div className="space-y-0.5 overflow-hidden">
                  {dayItems.slice(0, 2).map(item => (
                    <div
                      key={item.id}
                      className="truncate text-[10px] text-[#85877f]"
                    >
                      {item.title}
                    </div>
                  ))}
                  {dayItems.length > 2 && (
                    <div className="text-[9px] text-[#3b7562] font-mono">
                      +{dayItems.length - 2} รายการ
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDayStr && (
        <div className="space-y-3 p-5 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2a2d2e] dark:text-[#e8e6df]">
              รายการวันที่ {formatThaiShortDate(selectedDayStr)}
            </h3>
            <button
              onClick={() => onOpenFullModal({ dueDate: selectedDayStr, category: 'งาน' })}
              className="flex items-center gap-1 text-xs text-[#3b7562] dark:text-[#6fae98] hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มงานในวันนี้</span>
            </button>
          </div>

          {selectedDateNotes.length > 0 ? (
            <div className="space-y-2">
              {selectedDateNotes.map(item => (
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
            <p className="text-xs text-[#85877f] italic">ไม่มีรายการที่กำหนดไว้ในวันนี้</p>
          )}
        </div>
      )}
    </div>
  );
};
