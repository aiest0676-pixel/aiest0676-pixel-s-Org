import { useState, useEffect, useMemo, useCallback } from 'react';
import { NoteItem, ItemCategory, ItemStatus } from '../types';
import { INITIAL_NOTES } from '../data/initialData';

const STORAGE_KEY = 'life_os_notes_data_v3';
const THEME_KEY = 'life_os_theme_v3';
const USER_KEY = 'life_os_user_profile_v3';
const AUTH_KEY = 'life_os_auth_v3';

export interface UserProfile {
  name: string;
  isSynced: boolean;
  lastSyncTime: string;
}

export function useNotesStorage() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_KEY) === 'true';
    }
    return false;
  });

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return {
      name: 'Estai',
      isSynced: true,
      lastSyncTime: 'วันนี้ 09:00 น.'
    };
  });

  const loginUser = useCallback((username: string) => {
    setIsLoggedIn(true);
    localStorage.setItem(AUTH_KEY, 'true');
    setProfile(prev => {
      const updated = { ...prev, name: username };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logoutUser = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.setItem(AUTH_KEY, 'false');
  }, []);

  const updateProfileName = useCallback((name: string) => {
    setProfile(prev => {
      const updated = { ...prev, name };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Notes state
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_NOTES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback((item: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: NoteItem = {
      ...item,
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<NoteItem>) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleStar = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, starred: !n.starred, updatedAt: new Date().toISOString() } : n))
    );
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(n => {
        if (n.id !== id) return n;
        let nextStatus: ItemStatus = 'ยังไม่ทำ';
        if (n.status === 'เสร็จแล้ว') {
          nextStatus = n.category === 'การเรียนรู้' ? 'กำลังเรียน' : 'ยังไม่ทำ';
        } else {
          nextStatus = 'เสร็จแล้ว';
        }
        return {
          ...n,
          status: nextStatus,
          updatedAt: new Date().toISOString()
        };
      })
    );
  }, []);

  const toggleChecklist = useCallback((noteId: string, checklistId: string) => {
    setNotes(prev =>
      prev.map(n => {
        if (n.id !== noteId || !n.checklists) return n;
        const updatedChecklists = n.checklists.map(c =>
          c.id === checklistId ? { ...c, completed: !c.completed } : c
        );
        return {
          ...n,
          checklists: updatedChecklists,
          updatedAt: new Date().toISOString()
        };
      })
    );
  }, []);

  const resetToDefault = useCallback(() => {
    setNotes(INITIAL_NOTES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
  }, []);

  const stats = useMemo(() => {
    const taskItems = notes.filter(n => n.category === 'งาน');
    const totalTasks = taskItems.length;
    const completedTasks = taskItems.filter(n => n.status === 'เสร็จแล้ว').length;
    const pendingTasks = taskItems.filter(n => n.status !== 'เสร็จแล้ว').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const overdueTasks = taskItems.filter(n => {
      if (n.status === 'เสร็จแล้ว') return false;
      return n.dueDate && n.dueDate < todayStr;
    }).length;

    const totalAll = notes.length;
    const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    const countByCategory = {
      overview: totalAll,
      tasks: taskItems.length,
      notes: notes.filter(n => n.category === 'โน้ต').length,
      learning: notes.filter(n => n.category === 'การเรียนรู้').length,
      wishlist: notes.filter(n => n.category === 'Wishlist').length
    };

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      totalAll,
      taskPercentage,
      countByCategory
    };
  }, [notes]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(n => {
      n.tags.forEach(t => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [notes]);

  return {
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
  };
}
