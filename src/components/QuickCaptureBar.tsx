import React, { useState } from 'react';
import { Calendar, Check, ArrowRight, Maximize2 } from 'lucide-react';
import { ItemCategory, PriorityLevel, NoteItem } from '../types';

interface QuickCaptureBarProps {
  onAddNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onOpenFullModal: (initialData?: Partial<NoteItem>) => void;
  defaultCategory?: ItemCategory;
}

export const QuickCaptureBar: React.FC<QuickCaptureBarProps> = ({
  onAddNote,
  onOpenFullModal,
  defaultCategory = 'โน้ต'
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ItemCategory>(defaultCategory);
  const [priority, setPriority] = useState<PriorityLevel>('ปานกลาง');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    onAddNote({
      title: title.trim(),
      content: content.trim(),
      category,
      priority,
      status: category === 'การเรียนรู้' ? 'กำลังเรียน' : category === 'งาน' ? 'ยังไม่ทำ' : 'ใช้งานอยู่',
      dueDate: dueDate || undefined,
      tags: [category.toLowerCase()],
      starred: false,
      checklists: []
    });

    setTitle('');
    setContent('');
    setDueDate('');
    setIsExpanded(false);

    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 mb-6 transition-all rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#85877f]">
          <span className="w-2 h-2 rounded-full bg-[#3b7562]" />
          <span>จดบันทึกด่วน (Quick Capture)</span>
          {isSavedFeedback && (
            <span className="flex items-center gap-1 text-[#3b7562] dark:text-[#6fae98] font-medium animate-fade-in">
              <Check className="w-3.5 h-3.5" /> บันทึกเรียบร้อย!
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            onOpenFullModal({
              title,
              content,
              category,
              priority,
              dueDate
            })
          }
          className="flex items-center gap-1 text-xs text-[#85877f] hover:text-[#3b7562] dark:hover:text-[#6fae98] transition-colors cursor-pointer"
          title="เปิดโหมดเขียนเต็มจอ"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">เปิดโปรแกรมแก้ไขแบบเต็ม</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="พิมพ์สิ่งที่คิด โน้ต หรือสิ่งที่ต้องทำ... (กด Enter เพื่อบันทึกทันที)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none focus:border-[#3b7562] transition-colors"
          />
        </div>

        {isExpanded && (
          <div className="space-y-3 pt-1 animate-fade-in">
            <textarea
              placeholder="รายละเอียดเพิ่มเติม (ถ้ามี เช่น ไอเดียสั้นๆ, ลิงก์...)"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 text-xs rounded-lg border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none focus:border-[#3b7562] resize-none transition-colors"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#e4e0d5] dark:border-[#303435]">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ItemCategory)}
                  aria-label="เลือกหมวดหมู่"
                  className="px-2.5 py-1 text-xs rounded-md border bg-[#fbfaf6] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] focus:outline-none cursor-pointer"
                >
                  <option value="โน้ต">โน้ต (Notes)</option>
                  <option value="งาน">งาน (Tasks)</option>
                  <option value="การเรียนรู้">การเรียนรู้ (Learning)</option>
                  <option value="Wishlist">Wishlist</option>
                  <option value="ไอเดีย">ไอเดีย (Ideas)</option>
                </select>

                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as PriorityLevel)}
                  aria-label="เลือกลำดับความสำคัญ"
                  className="px-2.5 py-1 text-xs rounded-md border bg-[#fbfaf6] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] focus:outline-none cursor-pointer"
                >
                  <option value="ปานกลาง">ความสำคัญ: ปานกลาง</option>
                  <option value="สูง">ความสำคัญ: สูง</option>
                  <option value="ด่วนมาก">ความสำคัญ: ด่วนมาก 🔥</option>
                  <option value="ต่ำ">ความสำคัญ: ต่ำ</option>
                </select>

                <div className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border bg-[#fbfaf6] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df]">
                  <Calendar className="w-3 h-3 text-[#85877f]" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    aria-label="กำหนดส่ง"
                    className="bg-transparent text-xs text-[#2a2d2e] dark:text-[#e8e6df] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-3 py-1.5 text-xs text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <span>บันทึก</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
