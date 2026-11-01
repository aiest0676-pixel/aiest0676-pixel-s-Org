import { NoteItem } from '../types';

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'ส่งสรุปงานประจำสัปดาห์',
    content: 'รวบรวมตัวเลข KPI ยอดผู้เข้าชมและส่งสรุปให้ทีมภายในวันจันทร์ตอนเช้า',
    category: 'งาน',
    priority: 'สูง',
    status: 'เสร็จแล้ว',
    dueDate: '2026-10-26',
    tags: [],
    starred: true,
    createdAt: '2026-10-20T08:30:00.000Z',
    updatedAt: '2026-10-25T14:15:00.000Z',
    checklists: [
      { id: 'c1', text: 'ดึงข้อมูล Analytics สัปดาห์ก่อนหน้า', completed: true },
      { id: 'c2', text: 'สรุป 3 ไฮไลต์หลักของงานที่เสร็จสิ้น', completed: true },
      { id: 'c3', text: 'ส่งอีเมลและแจ้งในแชตกลุ่มงาน', completed: true }
    ]
  },
  {
    id: 'note-2',
    title: 'ไอเดียโปรเจกต์ส่วนตัว',
    content: 'อยากทำแอปจดบันทึกที่เรียบง่าย เปิดแล้วรู้ทันทีว่าวันนี้ต้องทำอะไร ข้อสำคัญ: ต้องเร็วและไม่รก',
    category: 'โน้ต',
    priority: 'สูง',
    status: 'ใช้งานอยู่',
    tags: [],
    starred: true,
    createdAt: '2026-10-23T15:20:00.000Z',
    updatedAt: '2026-10-25T16:40:00.000Z',
    checklists: [
      { id: 'c4', text: 'ร่างโครงสร้างหน้าจอหลักและแถบนำทาง', completed: true }
    ]
  },
  {
    id: 'note-3',
    title: 'สรุปหนังสือ Atomic Habits',
    content: 'พฤติกรรมเล็กๆ รวมกันสร้างการเปลี่ยนแปลงที่ยิ่งใหญ่ในระยะยาว',
    category: 'การเรียนรู้',
    priority: 'สูง',
    status: 'กำลังเรียน',
    tags: [],
    starred: false,
    createdAt: '2026-10-25T10:00:00.000Z',
    updatedAt: '2026-10-28T09:15:00.000Z'
  }
];
