import React from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { NoteItem } from '../types';
import { NoteItemCard } from './NoteItemCard';
import { QuickCaptureBar } from './QuickCaptureBar';

interface WishlistViewProps {
  notes: NoteItem[];
  onToggleStatus: (id: string) => void;
  onToggleStar: (id: string) => void;
  onSelectNote: (note: NoteItem) => void;
  onAddNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onOpenFullModal: (initialData?: Partial<NoteItem>) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  notes,
  onToggleStatus,
  onToggleStar,
  onSelectNote,
  onAddNote,
  onOpenFullModal
}) => {
  const wishlistItems = notes.filter(n => n.category === 'Wishlist');
  const totalBudget = wishlistItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const purchasedItems = wishlistItems.filter(item => item.status === 'เสร็จแล้ว');

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2a2d2e] dark:text-[#e8e6df]">
            Wishlist & รายการของที่อยากได้
          </h2>
          <p className="mt-1 text-xs text-[#85877f]">
            ตั้งเป้าหมายการซื้อของ ควบคุมค่าใช้จ่าย ({wishlistItems.length} รายการ)
          </p>
        </div>

        <button
          onClick={() => onOpenFullModal({ category: 'Wishlist' })}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ เพิ่มของที่อยากได้</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435]">
          <div className="text-xs text-[#85877f]">งบประมาณรวมทั้งหมดที่วางแผนไว้</div>
          <div className="mt-1 text-2xl font-bold font-mono text-[#3b7562] dark:text-[#6fae98] tabular-nums">
            ฿{totalBudget.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435]">
          <div className="text-xs text-[#85877f]">ซื้อแล้วสำเร็จ</div>
          <div className="mt-1 text-2xl font-bold font-mono text-[#2a2d2e] dark:text-[#e8e6df] tabular-nums">
            {purchasedItems.length} / {wishlistItems.length} ชิ้น
          </div>
        </div>
      </div>

      <QuickCaptureBar
        onAddNote={onAddNote}
        onOpenFullModal={onOpenFullModal}
        defaultCategory="Wishlist"
      />

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map(item => (
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
          <ShoppingCart className="w-10 h-10 mx-auto text-[#3b7562]" />
          <p className="mt-3 text-sm font-medium text-[#2a2d2e] dark:text-[#e8e6df]">
            ยังไม่มีรายการของที่อยากได้
          </p>
          <p className="mt-1 text-xs text-[#85877f]">
            จดรายการสิ่งของที่ต้องการพร้อมราคาประเมินเพื่อวางแผนการเงิน
          </p>
          <button
            onClick={() => onOpenFullModal({ category: 'Wishlist' })}
            className="mt-4 px-3.5 py-1.5 text-xs font-medium text-[#3b7562] dark:text-[#6fae98] border border-[#3b7562]/40 rounded-lg cursor-pointer"
          >
            + เพิ่มชิ้นแรก
          </button>
        </div>
      )}
    </div>
  );
};
