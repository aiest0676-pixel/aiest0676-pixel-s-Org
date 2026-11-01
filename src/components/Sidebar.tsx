import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  GraduationCap,
  Bookmark,
  Calendar,
  Sun,
  Moon,
  CloudCheck,
  Plus,
  RotateCcw,
  Edit2,
  Check,
  LogOut
} from 'lucide-react';
import { ViewTab } from '../types';
import { UserProfile } from '../hooks/useNotesStorage';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  counts: {
    overview: number;
    tasks: number;
    notes: number;
    learning: number;
    wishlist: number;
  };
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  profile: UserProfile;
  onUpdateProfileName: (name: string) => void;
  onOpenQuickAdd: () => void;
  onResetData: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  counts,
  theme,
  onToggleTheme,
  profile,
  onUpdateProfileName,
  onOpenQuickAdd,
  onResetData,
  onLogout,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateProfileName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const navItems = [
    { id: 'overview' as ViewTab, label: 'ภาพรวม', icon: LayoutDashboard, count: counts.overview },
    { id: 'tasks' as ViewTab, label: 'งาน', icon: CheckSquare, count: counts.tasks },
    { id: 'notes' as ViewTab, label: 'โน้ต', icon: FileText, count: counts.notes },
    { id: 'learning' as ViewTab, label: 'การเรียนรู้', icon: GraduationCap, count: counts.learning },
    { id: 'wishlist' as ViewTab, label: 'Wishlist', icon: Bookmark, count: counts.wishlist },
    { id: 'calendar' as ViewTab, label: 'ปฏิทิน & สรุปสัปดาห์', icon: Calendar, count: undefined }
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df]`}
      >
        <div className="p-6 pb-4 border-b border-[#e4e0d5] dark:border-[#303435]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold tracking-wider uppercase text-[#2a2d2e] dark:text-[#e8e6df]">
                MY LIFE OS
              </h1>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-[#3b7562] dark:text-[#6fae98]">
                <span className="flex items-center gap-1">
                  <CloudCheck className="w-3.5 h-3.5" />
                  {profile.isSynced ? 'ซิงค์แล้ว' : 'ออฟไลน์'}
                </span>
                <span className="text-[#85877f]">·</span>
                {isEditingName ? (
                  <form onSubmit={handleSaveName} className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      className="w-20 px-1 py-0.5 text-xs bg-white dark:bg-black/40 border border-[#3b7562] rounded text-[#2a2d2e] dark:text-[#e8e6df]"
                      autoFocus
                    />
                    <button type="submit" className="text-[#3b7562] dark:text-[#6fae98]">
                      <Check className="w-3 h-3" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setNameInput(profile.name);
                      setIsEditingName(true);
                    }}
                    className="flex items-center gap-1 text-[#85877f] dark:text-[#8f9189] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] transition-colors group"
                    title="คลิกเพื่อแก้ไขชื่อ"
                  >
                    <span>{profile.name}</span>
                    <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onOpenQuickAdd();
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center justify-center w-full gap-2 px-3 py-2.5 mt-4 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] rounded-lg shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ จดบันทึก / สร้างงานใหม่</span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#dfeae4] dark:bg-[#26382f] text-[#3b7562] dark:text-[#6fae98] font-semibold shadow-xs'
                    : 'text-[#85877f] dark:text-[#8f9189] hover:bg-[#e4e0d5]/50 dark:hover:bg-[#232728] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#3b7562] dark:text-[#6fae98]' : 'text-[#85877f] dark:text-[#8f9189]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`text-xs tabular-nums font-mono ${
                      isActive ? 'text-[#3b7562] dark:text-[#6fae98] font-semibold' : 'text-[#85877f]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#e4e0d5] dark:border-[#303435] space-y-2">
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 text-xs font-medium bg-[#ece8de] dark:bg-[#2b2f30] hover:bg-[#e4e0d5] dark:hover:bg-[#35393a] text-[#2a2d2e] dark:text-[#e8e6df] border border-[#e4e0d5] dark:border-[#303435] rounded-lg transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>โหมดสว่าง (Light Mode)</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#3b7562]" />
                <span>โหมดมืด (Dark Mode)</span>
              </>
            )}
          </button>

          <button
            onClick={onLogout}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 text-xs font-medium bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-[#b0503e] rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('ต้องการรีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้นหรือไม่?')) {
                onResetData();
              }
            }}
            className="flex items-center justify-center w-full gap-1.5 py-1.5 text-[11px] text-[#85877f] hover:text-[#2a2d2e] dark:hover:text-[#e8e6df] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>คืนค่าข้อมูลตัวอย่าง</span>
          </button>
        </div>
      </aside>
    </>
  );
};
