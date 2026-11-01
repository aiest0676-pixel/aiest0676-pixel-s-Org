/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNotesStorage } from './hooks/useNotesStorage';
import { ViewTab, NoteItem } from './types';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { TasksView } from './components/TasksView';
import { NotesView } from './components/NotesView';
import { LearningView } from './components/LearningView';
import { WishlistView } from './components/WishlistView';
import { CalendarReviewView } from './components/CalendarReviewView';
import { NoteModal } from './components/NoteModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const {
    notes,
    theme,
    toggleTheme,
    profile,
    isLoggedIn,
    loginUser,
    logoutUser,
    updateProfileName,
    addNote,
    updateNote,
    deleteNote,
    toggleStar,
    toggleStatus,
    toggleChecklist,
    resetToDefault,
    stats,
    allTags
  } = useNotesStorage();

  const [currentTab, setCurrentTab] = useState<ViewTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleOpenQuickAdd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenNote = (note: NoteItem) => {
    setSelectedNote(note);
    setIsNoteModalOpen(true);
  };

  const handleOpenQuickAdd = (initialData?: Partial<NoteItem>) => {
    if (initialData) {
      setSelectedNote({
        id: '',
        title: initialData.title || '',
        content: initialData.content || '',
        category: initialData.category || 'โน้ต',
        priority: initialData.priority || 'ปานกลาง',
        status: initialData.status || 'ใช้งานอยู่',
        dueDate: initialData.dueDate,
        tags: initialData.tags || [],
        starred: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        checklists: []
      });
    } else {
      setSelectedNote(null);
    }
    setIsNoteModalOpen(true);
  };

  const handleSaveModalNote = (noteData: Partial<NoteItem>) => {
    if (selectedNote && selectedNote.id) {
      updateNote(selectedNote.id, noteData);
    } else {
      addNote({
        title: noteData.title || 'ไม่มีชื่อ',
        content: noteData.content || '',
        category: noteData.category || 'โน้ต',
        priority: noteData.priority || 'ปานกลาง',
        status: noteData.status || 'ใช้งานอยู่',
        dueDate: noteData.dueDate,
        tags: noteData.tags || [],
        starred: Boolean(noteData.starred),
        price: noteData.price,
        linkUrl: noteData.linkUrl,
        checklists: noteData.checklists,
        images: noteData.images
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-[#17191a] text-[#2a2d2e] dark:text-[#e8e6df] font-sans selection:bg-[#3b7562]/20 selection:text-[#3b7562]">
      {/* Login Modal if not authenticated */}
      <LoginModal isOpen={!isLoggedIn} onLogin={loginUser} />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        counts={stats.countByCategory}
        theme={theme}
        onToggleTheme={toggleTheme}
        profile={profile}
        onUpdateProfileName={updateProfileName}
        onOpenQuickAdd={() => handleOpenQuickAdd()}
        onResetData={resetToDefault}
        onLogout={logoutUser}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all">
        <TopBar
          currentTab={currentTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenQuickAdd={() => handleOpenQuickAdd()}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileNavOpen(prev => !prev)}
          isMobileOpen={isMobileNavOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'overview' && (
            <OverviewView
              notes={notes}
              stats={stats}
              onToggleStatus={toggleStatus}
              onToggleStar={toggleStar}
              onSelectNote={handleOpenNote}
              onAddNote={addNote}
              onOpenFullModal={handleOpenQuickAdd}
              onGoToTab={tab => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksView
              notes={notes}
              onToggleStatus={toggleStatus}
              onToggleStar={toggleStar}
              onSelectNote={handleOpenNote}
              onAddNote={addNote}
              onOpenFullModal={handleOpenQuickAdd}
            />
          )}

          {currentTab === 'notes' && (
            <NotesView
              notes={notes}
              allTags={allTags}
              onToggleStatus={toggleStatus}
              onToggleStar={toggleStar}
              onSelectNote={handleOpenNote}
              onAddNote={addNote}
              onOpenFullModal={handleOpenQuickAdd}
            />
          )}

          {currentTab === 'learning' && (
            <LearningView
              notes={notes}
              onToggleStatus={toggleStatus}
              onToggleStar={toggleStar}
              onSelectNote={handleOpenNote}
              onAddNote={addNote}
              onOpenFullModal={handleOpenQuickAdd}
            />
          )}

          {currentTab === 'wishlist' && (
            <WishlistView
              notes={notes}
              onToggleStatus={toggleStatus}
              onToggleStar={toggleStar}
              onSelectNote={handleOpenNote}
              onAddNote={addNote}
              onOpenFullModal={handleOpenQuickAdd}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarReviewView
              notes={notes}
              onToggleStatus={toggleStatus}
              onToggleStar={toggleStar}
              onSelectNote={handleOpenNote}
              onAddNote={addNote}
              onOpenFullModal={handleOpenQuickAdd}
            />
          )}
        </main>
      </div>

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
        onSave={handleSaveModalNote}
        onDelete={deleteNote}
        onToggleStar={toggleStar}
      />

      <QuickSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        notes={notes}
        onSelectNote={handleOpenNote}
        onOpenQuickAddWithTitle={title => handleOpenQuickAdd({ title })}
      />
    </div>
  );
}
