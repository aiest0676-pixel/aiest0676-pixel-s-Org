import React from 'react';
import { Check, Star, Calendar, CheckSquare, Image as ImageIcon } from 'lucide-react';
import { NoteItem } from '../types';
import { formatThaiShortDate, formatUpdatedLabel } from '../utils/dateFormatter';

interface NoteItemCardProps {
  item: NoteItem;
  onToggleStatus: (id: string) => void;
  onToggleStar: (id: string) => void;
  onClick: (item: NoteItem) => void;
  layout?: 'row' | 'card';
}

export const NoteItemCard: React.FC<NoteItemCardProps> = ({
  item,
  onToggleStatus,
  onToggleStar,
  onClick,
  layout = 'row'
}) => {
  const isDone = item.status === 'เสร็จแล้ว';

  // Priority color styling using requested palette (#b0503e, #a67c2e, #3b7562)
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'ด่วนมาก':
      case 'สูง':
        return 'text-[#b0503e] dark:text-[#d98a76]';
      case 'ปานกลาง':
        return 'text-[#a67c2e] dark:text-[#d1a64f]';
      default:
        return 'text-[#85877f]';
    }
  };

  const completedChecklistCount = item.checklists?.filter(c => c.completed).length || 0;
  const totalChecklists = item.checklists?.length || 0;
  const hasImages = item.images && item.images.length > 0;

  if (layout === 'card') {
    return (
      <div
        onClick={() => onClick(item)}
        className="group relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-150 cursor-pointer bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] hover:border-[#3b7562]/60 hover:shadow-sm"
      >
        <div>
          {/* Top Row: Category kicker & Star toggle */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs text-[#85877f]">
              <span className="font-medium text-[#3b7562] dark:text-[#6fae98]">{item.category}</span>
              <span aria-hidden="true">·</span>
              <span className={getPriorityStyle(item.priority)}>{item.priority}</span>
              {item.dueDate && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 tabular-nums">
                    <Calendar className="w-3 h-3 text-[#85877f]" />
                    {formatThaiShortDate(item.dueDate)}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                onToggleStar(item.id);
              }}
              className="p-1 text-[#85877f] hover:text-amber-500 transition-colors cursor-pointer"
              title={item.starred ? 'ยกเลิกปักหมุด' : 'ปักหมุดรายการนี้'}
            >
              <Star
                className={`w-4 h-4 ${
                  item.starred ? 'fill-amber-400 text-amber-400' : 'text-[#85877f]'
                }`}
              />
            </button>
          </div>

          {/* Title */}
          <h3
            className={`text-base font-semibold leading-snug tracking-tight transition-colors ${
              isDone
                ? 'line-through text-[#85877f]'
                : 'text-[#2a2d2e] dark:text-[#e8e6df] group-hover:text-[#3b7562] dark:group-hover:text-[#6fae98]'
            }`}
          >
            {item.title}
          </h3>

          {/* Content snippet */}
          {item.content && (
            <p className="mt-2 text-xs leading-relaxed text-[#85877f] dark:text-[#8f9189] line-clamp-3">
              {item.content}
            </p>
          )}

          {/* Image thumbnail preview if present */}
          {hasImages && (
            <div className="flex items-center gap-1.5 mt-3">
              <ImageIcon className="w-3.5 h-3.5 text-[#3b7562]" />
              <span className="text-[11px] text-[#85877f]">มีรูปภาพแนบ ({item.images!.length})</span>
            </div>
          )}

          {/* Checklist progress badge if present */}
          {totalChecklists > 0 && (
            <div className="flex items-center gap-1.5 mt-3 text-[11px] text-[#85877f]">
              <CheckSquare className="w-3.5 h-3.5 text-[#3b7562]" />
              <span className="tabular-nums font-mono">
                {completedChecklistCount}/{totalChecklists} รายการย่อย
              </span>
            </div>
          )}

          {/* Price if wishlist */}
          {item.price !== undefined && (
            <div className="mt-3 text-xs font-semibold text-[#3b7562] dark:text-[#6fae98] tabular-nums">
              ฿{item.price.toLocaleString()}
            </div>
          )}
        </div>

        {/* Clean unboxed footer metadata */}
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-4 text-[11px] text-[#85877f] border-t border-[#e4e0d5] dark:border-[#303435]">
          {item.tags.map(tag => (
            <span key={tag} className="text-[#3b7562] dark:text-[#6fae98] bg-[#dfeae4] dark:bg-[#26382f] px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
          <span>{formatUpdatedLabel(item.updatedAt)}</span>
        </div>
      </div>
    );
  }

  // Row layout
  return (
    <div
      onClick={() => onClick(item)}
      className="group relative flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150 cursor-pointer bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435] hover:border-[#3b7562]/60 hover:bg-[#f2efe8]/60 dark:hover:bg-[#282c2d]"
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Toggle Checkbox Button */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onToggleStatus(item.id);
          }}
          className={`flex items-center justify-center w-5 h-5 mt-0.5 rounded-full border transition-all cursor-pointer shrink-0 ${
            isDone
              ? 'bg-[#3b7562] border-[#3b7562] text-white'
              : 'border-[#85877f] hover:border-[#3b7562] bg-transparent'
          }`}
          title={isDone ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
        >
          {isDone && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4
              className={`text-sm font-medium leading-snug transition-colors truncate ${
                isDone
                  ? 'line-through text-[#85877f]'
                  : 'text-[#2a2d2e] dark:text-[#e8e6df] group-hover:text-[#3b7562] dark:group-hover:text-[#6fae98]'
              }`}
            >
              {item.title}
            </h4>
          </div>

          {item.content && (
            <p className="mt-1 text-xs leading-relaxed text-[#85877f] dark:text-[#8f9189] line-clamp-2">
              {item.content}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] text-[#85877f]">
            <span className={getPriorityStyle(item.priority)}>{item.priority}</span>
            <span aria-hidden="true">·</span>
            <span>{item.status}</span>

            {item.dueDate && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{formatThaiShortDate(item.dueDate)}</span>
              </>
            )}

            {hasImages && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-[#3b7562]">
                  <ImageIcon className="w-3 h-3" /> {item.images!.length} รูป
                </span>
              </>
            )}

            {item.tags.map(t => (
              <React.Fragment key={t}>
                <span aria-hidden="true">·</span>
                <span className="text-[#3b7562] dark:text-[#6fae98] font-normal">
                  #{t}
                </span>
              </React.Fragment>
            ))}

            <span aria-hidden="true">·</span>
            <span>{formatUpdatedLabel(item.updatedAt)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={e => {
          e.stopPropagation();
          onToggleStar(item.id);
        }}
        className="p-1 text-[#85877f] hover:text-amber-500 transition-colors cursor-pointer shrink-0 mt-0.5"
        title={item.starred ? 'ยกเลิกปักหมุด' : 'ปักหมุด'}
      >
        <Star
          className={`w-4 h-4 ${
            item.starred ? 'fill-amber-400 text-amber-400' : 'text-[#85877f]'
          }`}
        />
      </button>
    </div>
  );
};
