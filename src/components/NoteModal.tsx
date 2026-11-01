import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Star,
  Check,
  Trash2,
  Calendar,
  Image as ImageIcon,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  CheckSquare,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Send,
  Eye,
  Edit3,
  Square
} from 'lucide-react';
import { NoteItem, ItemCategory, PriorityLevel, ItemStatus, ChecklistItem } from '../types';
import { formatUpdatedLabel, getReadingTime } from '../utils/dateFormatter';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: NoteItem | null;
  onSave: (noteData: Partial<NoteItem>) => void;
  onDelete?: (id: string) => void;
  onToggleStar?: (id: string) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  note,
  onSave,
  onDelete,
  onToggleStar
}) => {
  const isEditingExisting = Boolean(note && note.id);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ItemCategory>('โน้ต');
  const [priority, setPriority] = useState<PriorityLevel>('ปานกลาง');
  const [status, setStatus] = useState<ItemStatus>('ใช้งานอยู่');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [starred, setStarred] = useState(false);
  const [price, setPrice] = useState<string>('');
  const [linkUrl, setLinkUrl] = useState('');
  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // View mode
  const [viewMode, setViewMode] = useState<'edit' | 'read'>('edit');

  // AI Assistant states
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setCategory(note.category || 'โน้ต');
      setPriority(note.priority || 'ปานกลาง');
      setStatus(note.status || 'ใช้งานอยู่');
      setDueDate(note.dueDate || '');
      setTags(note.tags || []);
      setStarred(Boolean(note.starred));
      setPrice(note.price !== undefined ? String(note.price) : '');
      setLinkUrl(note.linkUrl || '');
      setChecklists(note.checklists || []);
      setImages(note.images || []);
      setViewMode(isEditingExisting && !note.title ? 'edit' : 'edit');
    } else {
      setTitle('');
      setContent('');
      setCategory('โน้ต');
      setPriority('ปานกลาง');
      setStatus('ใช้งานอยู่');
      setDueDate('');
      setTags(['โน้ต']);
      setStarred(false);
      setPrice('');
      setLinkUrl('');
      setChecklists([]);
      setImages([]);
      setViewMode('edit');
    }
    setAiResponse(null);
    setShowAiPanel(false);
  }, [note, isEditingExisting, isOpen]);

  if (!isOpen) return null;

  // Formatting helpers for Word/Notion style toolbar
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 50);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = uploadEvent => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAskAI = async (customPrompt?: string) => {
    const promptToSend = customPrompt || aiPrompt;
    if (!promptToSend.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);
    setShowAiPanel(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          noteContent: content,
          noteTitle: title
        })
      });
      const data = await res.json();
      if (data.error) {
        setAiResponse(`เกิดข้อผิดพลาด: ${data.error}`);
      } else {
        setAiResponse(data.text);
      }
    } catch (err: any) {
      setAiResponse(`ไม่สามารถติดต่อเซิร์ฟเวอร์ AI ได้: ${err.message || 'Unknown error'}`);
    } finally {
      setIsAiLoading(false);
      setAiPrompt('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      priority,
      status,
      dueDate: dueDate || undefined,
      tags,
      starred,
      price: price ? parseFloat(price) : undefined,
      linkUrl: linkUrl.trim() || undefined,
      checklists,
      images
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/75 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-4xl max-h-[96vh] rounded-2xl border transition-all bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e0d5] dark:border-[#303435] bg-[#f2efe8] dark:bg-[#1b1d1e]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3b7562] dark:text-[#6fae98]">
              {category}
            </span>
            <span className="text-[#85877f]">·</span>
            <div className="flex items-center p-0.5 rounded-lg bg-[#ece8de] dark:bg-[#2b2f30]">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  viewMode === 'edit'
                    ? 'bg-[#fbfaf6] dark:bg-[#212425] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                    : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
                }`}
              >
                เขียน & แก้ไข
              </button>
              <button
                type="button"
                onClick={() => setViewMode('read')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  viewMode === 'read'
                    ? 'bg-[#fbfaf6] dark:bg-[#212425] text-[#3b7562] dark:text-[#6fae98] shadow-xs'
                    : 'text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
                }`}
              >
                โหมดอ่านสบายตา
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStarred(!starred)}
              className="p-1.5 text-[#85877f] hover:text-amber-500 rounded-lg cursor-pointer"
              title={starred ? 'ยกเลิกปักหมุด' : 'ปักหมุด'}
            >
              <Star className={`w-4 h-4 ${starred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Immersive & Large Note Area */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
          {viewMode === 'read' ? (
            /* --- READER MODE --- */
            <div className="space-y-6 max-w-3xl mx-auto py-4">
              <div className="flex items-center gap-2 text-xs text-[#85877f]">
                <span>ความสำคัญ: {priority}</span>
                <span>·</span>
                <span>สถานะ: {status}</span>
                <span>·</span>
                <span>{getReadingTime(content)}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2a2d2e] dark:text-[#e8e6df] leading-snug">
                {title}
              </h2>
              <div className="text-sm sm:text-base leading-relaxed text-[#2a2d2e] dark:text-[#e8e6df] whitespace-pre-wrap">
                {content || 'ไม่มีเนื้อหา'}
              </div>

              {/* Images preview in read mode */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Attached ${idx}`}
                      className="w-full h-36 object-cover rounded-xl border border-[#e4e0d5] dark:border-[#303435]"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* --- IMMERSIVE EDITOR MODE --- */
            <form id="immersive-note-form" onSubmit={handleSubmit} className="space-y-5">
              {/* Title input (Large & prominent like screenshot) */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="ชื่อโน้ต..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 text-lg sm:text-xl font-bold rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#3b7562]/60 dark:border-[#6fae98]/60 text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none focus:ring-2 focus:ring-[#3b7562]/30"
                />
              </div>

              {/* Status & Tags controls bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-medium text-[#85877f]">สถานะ</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ItemStatus)}
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-[#fbfaf6] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] focus:outline-none cursor-pointer"
                  >
                    <option value="ใช้งานอยู่">ใช้งานอยู่</option>
                    <option value="ยังไม่ทำ">ยังไม่ทำ</option>
                    <option value="กำลังทำ">กำลังทำ</option>
                    <option value="เสร็จแล้ว">เสร็จแล้ว</option>
                    <option value="กำลังเรียน">กำลังเรียน</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-medium text-[#85877f]">แท็ก (คั่นด้วยจุลภาค)</label>
                  <input
                    type="text"
                    placeholder="เช่น งาน, ไอเดีย, สำคัญ"
                    value={tags.join(', ')}
                    onChange={e => setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-[#fbfaf6] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none"
                  />
                </div>
              </div>

              {/* --- WORD / NOTION STYLE FORMATTING TOOLBAR --- */}
              <div className="flex flex-wrap items-center gap-1 p-2 rounded-xl border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435]">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1.5 text-[#2a2d2e] dark:text-[#e8e6df] hover:bg-[#ece8de] dark:hover:bg-[#2b2f30] rounded-md transition-colors cursor-pointer"
                  title="ตัวหนา (Bold)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1.5 text-[#2a2d2e] dark:text-[#e8e6df] hover:bg-[#ece8de] dark:hover:bg-[#2b2f30] rounded-md transition-colors cursor-pointer"
                  title="ตัวเอียง (Italic)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('# ')}
                  className="p-1.5 text-[#2a2d2e] dark:text-[#e8e6df] hover:bg-[#ece8de] dark:hover:bg-[#2b2f30] rounded-md transition-colors cursor-pointer"
                  title="หัวข้อหลัก 1 (Heading 1)"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('## ')}
                  className="p-1.5 text-[#2a2d2e] dark:text-[#e8e6df] hover:bg-[#ece8de] dark:hover:bg-[#2b2f30] rounded-md transition-colors cursor-pointer"
                  title="หัวข้อรอง 2 (Heading 2)"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-1.5 text-[#2a2d2e] dark:text-[#e8e6df] hover:bg-[#ece8de] dark:hover:bg-[#2b2f30] rounded-md transition-colors cursor-pointer"
                  title="รายการ (Bullet list)"
                >
                  <List className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-[#e4e0d5] dark:bg-[#303435] mx-1" />

                {/* Text Color Swatches requested by user */}
                <div className="flex items-center gap-1 px-1">
                  <span className="text-[10px] text-[#85877f]">สี:</span>
                  <button type="button" onClick={() => insertFormatting('`', '`')} className="w-3.5 h-3.5 rounded-full bg-[#3b7562]" title="เขียวมรกต" />
                  <button type="button" onClick={() => insertFormatting('`', '`')} className="w-3.5 h-3.5 rounded-full bg-[#b0503e]" title="แดงอิฐ" />
                  <button type="button" onClick={() => insertFormatting('`', '`')} className="w-3.5 h-3.5 rounded-full bg-[#a67c2e]" title="เหลืองอำพัน" />
                  <button type="button" onClick={() => insertFormatting('`', '`')} className="w-3.5 h-3.5 rounded-full bg-[#3a6ea5]" title="น้ำเงิน" />
                  <button type="button" onClick={() => insertFormatting('`', '`')} className="w-3.5 h-3.5 rounded-full bg-[#7a5aa6]" title="ม่วง" />
                </div>

                <div className="w-px h-5 bg-[#e4e0d5] dark:bg-[#303435] mx-1" />

                {/* Image Attach Button */}
                <label className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#2a2d2e] dark:text-[#e8e6df] bg-[#ece8de] dark:bg-[#2b2f30] hover:bg-[#e4e0d5] dark:hover:bg-[#35393a] rounded-md cursor-pointer transition-colors">
                  <ImageIcon className="w-3.5 h-3.5 text-[#3b7562] dark:text-[#6fae98]" />
                  <span>เพิ่มรูปภาพ</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Large Textarea (Takes up most of the space as requested) */}
              <div>
                <textarea
                  ref={textareaRef}
                  rows={12}
                  placeholder="เริ่มเขียนได้เลย..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-4 text-sm sm:text-base leading-relaxed rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none focus:ring-1 focus:ring-[#3b7562]"
                />
              </div>

              {/* Attached Images Grid */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#85877f]">รูปภาพที่แนบมา ({images.length})</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#e4e0d5] dark:border-[#303435]">
                        <img src={img} alt={`Upload ${idx}`} className="w-full h-24 object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}

          {/* --- AI ASSISTANT PANEL (ตอบคำถามเกี่ยวกับโน้ต) --- */}
          <div className="p-4 rounded-xl border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3b7562] dark:text-[#6fae98]" />
                <span className="text-xs font-semibold text-[#2a2d2e] dark:text-[#e8e6df]">
                  AI ผู้ช่วยอัจฉริยะ (ถามตอบ / สรุป / จัดข้อความ)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="text-xs text-[#3b7562] dark:text-[#6fae98] hover:underline cursor-pointer"
              >
                {showAiPanel ? 'ซ่อน AI' : 'แสดง AI'}
              </button>
            </div>

            {/* AI Preset buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleAskAI('ช่วยสรุปเนื้อหาสำคัญในโน้ตนี้ให้กระชับและอ่านง่าย')}
                disabled={isAiLoading}
                className="px-2.5 py-1 text-xs rounded-md bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98] hover:bg-[#3b7562] hover:text-white transition-colors cursor-pointer"
              >
                ✨ สรุปเนื้อหาสำคัญ
              </button>
              <button
                type="button"
                onClick={() => handleAskAI('ช่วยตรวจทานและจัดรูปแบบข้อความนี้ให้อ่านง่าย เป็นระเบียบ')}
                disabled={isAiLoading}
                className="px-2.5 py-1 text-xs rounded-md bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98] hover:bg-[#3b7562] hover:text-white transition-colors cursor-pointer"
              >
                📝 จัดข้อความให้อ่านง่าย
              </button>
              <button
                type="button"
                onClick={() => handleAskAI('มีข้อเสนอแนะหรือไอเดียเพิ่มเติมอะไรที่น่าสนใจเกี่ยวกับเรื่องนี้บ้าง')}
                disabled={isAiLoading}
                className="px-2.5 py-1 text-xs rounded-md bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98] hover:bg-[#3b7562] hover:text-white transition-colors cursor-pointer"
              >
                💡 ขอคำแนะนำเพิ่มเติม
              </button>
            </div>

            {/* AI Custom Prompt Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="ถาม AI เกี่ยวกับโน้ตนี้..."
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAskAI();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAskAI()}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-white rounded-lg disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>ถาม AI</span>
              </button>
            </div>

            {/* AI Response Display */}
            {(isAiLoading || aiResponse) && (
              <div className="p-3 rounded-lg bg-[#fbfaf6] dark:bg-[#212425] border border-[#e4e0d5] dark:border-[#303435] text-xs leading-relaxed text-[#2a2d2e] dark:text-[#e8e6df] space-y-2">
                {isAiLoading ? (
                  <div className="flex items-center gap-2 text-[#3b7562]">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>AI กำลังประมวลผลคำตอบ...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{aiResponse}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e4e0d5] dark:border-[#303435] bg-[#f2efe8] dark:bg-[#1b1d1e]">
          <div>
            {isEditingExisting && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('คุณแน่ใจว่าต้องการลบโน้ตนี้หรือไม่?')) {
                    onDelete(note!.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#b0503e] hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบรายการนี้</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] rounded-lg cursor-pointer"
            >
              ปิด
            </button>
            <button
              type="submit"
              form="immersive-note-form"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[#46484a] hover:bg-[#323435] text-[#fbfaf6] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>บันทึกโน้ต</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
