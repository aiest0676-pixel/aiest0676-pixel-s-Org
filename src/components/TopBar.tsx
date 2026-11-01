import React from 'react';
import { Search, Plus, Menu, X } from 'lucide-react';
import { ViewTab } from '../types';

interface TopBarProps {
  currentTab: ViewTab;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenQuickAdd: () => void;
  onOpenSearchModal: () => void;
  onToggleMobileMenu: () => void;
  isMobileOpen: boolean;
}

const TAB_TITLES: Record<ViewTab, { title: string; subtitle: string }> = {
  overview: { title: 'ภาพรวมชีวิต', subtitle: 'ศูนย์กลางสรุปข้อมูล งานสำคัญ และบันทึกล่าสุด' },
  tasks: { title: 'รายการงาน & แผนปฏิบัติ', subtitle: 'จัดการงานที่ต้องทำ ติดตามสถานะ และกำหนดส่ง' },
  notes: { title: 'คลังโน้ต & บันทึกความคิด', subtitle: 'จดบันทึก รวบรวมไอเดีย และความรู้สำคัญ' },
  learning: { title: 'การเรียนรู้ & พัฒนาตนเอง', subtitle: 'สรุปหนังสือ คอร์สเรียน และบทเรียนชีวิต' },
  wishlist: { title: 'Wishlist & สิ่งที่อยากได้', subtitle: 'เป้าหมายการซื้อของ และสิ่งที่ต้องการในอนาคต' },
  calendar: { title: 'ปฏิทิน & สรุปสัปดาห์', subtitle: 'ทบทวนความคืบหน้ารอบสัปดาห์ และวางแผนถัดไป' }
};

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  searchQuery,
  onSearchChange,
  onOpenQuickAdd,
  onOpenSearchModal,
  onToggleMobileMenu,
  isMobileOpen
}) => {
  const tabInfo = TAB_TITLES[currentTab];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b transition-colors bg-[#fbfaf6]/90 dark:bg-[#212425]/90 backdrop-blur-md border-[#e4e0d5] dark:border-[#303435]">
      {/* Zone 1: Mobile toggle + Breadcrumb / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 -ml-1 text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] rounded-lg md:hidden cursor-pointer"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="truncate">
          <div className="flex items-center gap-2 text-xs text-[#85877f]">
            <span>MY LIFE OS</span>
            <span>/</span>
            <span className="text-[#2a2d2e] dark:text-[#e8e6df] font-medium">
              {tabInfo.title}
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Live Search with Cmd+K hint */}
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block w-48 lg:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85877f]" />
          <input
            type="text"
            placeholder="ค้นหาโน้ต, งาน, แท็ก..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-12 py-1.5 text-xs rounded-lg transition-all bg-[#f2efe8] dark:bg-[#1b1d1e] border border-transparent focus:border-[#3b7562] text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none"
          />
          <button
            onClick={onOpenSearchModal}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#85877f] bg-[#fbfaf6] dark:bg-[#212425] rounded border border-[#e4e0d5] dark:border-[#303435]"
          >
            ⌘K
          </button>
        </div>

        {/* Mobile search trigger */}
        <button
          onClick={onOpenSearchModal}
          className="p-2 text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] sm:hidden cursor-pointer"
          aria-label="ค้นหา"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Zone 3: Primary CTA */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">จดโน้ตด่วน</span>
          <span className="sm:hidden">จด</span>
        </button>
      </div>
    </header>
  );
};
