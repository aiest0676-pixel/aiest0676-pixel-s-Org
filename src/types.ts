export type ItemCategory = 'งาน' | 'โน้ต' | 'การเรียนรู้' | 'Wishlist' | 'ไอเดีย';

export type PriorityLevel = 'ด่วนมาก' | 'สูง' | 'ปานกลาง' | 'ต่ำ';

export type ItemStatus = 'ยังไม่ทำ' | 'กำลังทำ' | 'เสร็จแล้ว' | 'ใช้งานอยู่' | 'กำลังเรียน';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: ItemCategory;
  priority: PriorityLevel;
  status: ItemStatus;
  dueDate?: string; // YYYY-MM-DD
  tags: string[];
  starred: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  checklists?: ChecklistItem[];
  price?: number; // for Wishlist
  linkUrl?: string; // for Wishlist or Learning
  images?: string[]; // attached images base64 or URLs
}

export type ViewTab = 'overview' | 'tasks' | 'notes' | 'learning' | 'wishlist' | 'calendar';

export interface FilterOptions {
  searchQuery: string;
  category?: ItemCategory | 'all';
  status?: string | 'all';
  tag?: string;
  starredOnly?: boolean;
  sortBy: 'updatedAt' | 'createdAt' | 'dueDate' | 'title';
  sortOrder: 'asc' | 'desc';
}
