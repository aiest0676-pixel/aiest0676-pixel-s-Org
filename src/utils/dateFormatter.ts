const THAI_DAYS = [
  'วันอาทิตย์',
  'วันจันทร์',
  'วันอังคาร',
  'วันพุธ',
  'วันพฤหัสบดี',
  'วันศุกร์',
  'วันเสาร์'
];

const THAI_MONTHS_FULL = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม'
];

const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.'
];

/**
 * Format current date in Thai format as shown in screenshot:
 * "วันจันทร์ที่ 2 พฤศจิกายน 2569"
 */
export function formatThaiFullDate(date: Date = new Date()): string {
  const dayName = THAI_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const monthName = THAI_MONTHS_FULL[date.getMonth()];
  const thaiYear = date.getFullYear() + 543;
  return `${dayName}ที่ ${dayNum} ${monthName} ${thaiYear}`;
}

/**
 * Short date format like "26 ต.ค." or "26 ต.ค. 69"
 */
export function formatThaiShortDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = THAI_MONTHS_SHORT[d.getMonth()];
  return `${day} ${month}`;
}

/**
 * Relative time or updated date like "แก้ไข 25 ต.ค." or "วันนี้"
 */
export function formatUpdatedLabel(isoDate: string): string {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate();
  const month = THAI_MONTHS_SHORT[d.getMonth()];
  return `แก้ไข ${day} ${month}`;
}

/**
 * Reading time calculation (average 200 words per minute for Thai/English)
 */
export function getReadingTime(text: string): string {
  if (!text) return 'อ่าน 1 นาที';
  const charCount = text.length;
  const minutes = Math.max(1, Math.ceil(charCount / 400));
  return `อ่าน ~${minutes} นาที`;
}
