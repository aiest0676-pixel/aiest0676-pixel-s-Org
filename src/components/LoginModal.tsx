import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (username: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }
    if (password.length < 4) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }
    onLogin(username.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col w-full max-w-md p-8 rounded-2xl border shadow-2xl bg-[#fbfaf6] dark:bg-[#212425] border-[#e4e0d5] dark:border-[#303435]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-xl bg-[#3b7562]/10 text-[#3b7562] dark:text-[#6fae98]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#2a2d2e] dark:text-[#e8e6df]">
            เข้าสู่ระบบ Life OS
          </h2>
          <p className="mt-1 text-xs text-[#85877f]">
            กรอกชื่อผู้ใช้และรหัสผ่านเพื่อเข้าใช้งานบันทึกส่วนตัวของคุณ
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-xs bg-rose-50 dark:bg-rose-950/40 text-[#b0503e] border border-rose-200 dark:border-rose-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-xs font-medium text-[#85877f]">ชื่อผู้ใช้ (Username)</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85877f]" />
              <input
                type="text"
                required
                placeholder="เช่น Estai หรือชื่อของคุณ"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none focus:border-[#3b7562]"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-[#85877f]">รหัสผ่าน (Password)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85877f]" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border bg-[#f2efe8] dark:bg-[#1b1d1e] border-[#e4e0d5] dark:border-[#303435] text-[#2a2d2e] dark:text-[#e8e6df] placeholder:text-[#85877f] focus:outline-none focus:border-[#3b7562]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center w-full gap-2 py-2.5 mt-2 text-xs font-medium bg-[#3b7562] hover:bg-[#326453] text-[#fbfaf6] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>เข้าสู่ระบบ / เริ่มต้นใช้งาน</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-[#85877f]">
          ข้อมูลจะถูกบันทึกไว้อย่างปลอดภัยบนอุปกรณ์ของคุณ
        </div>
      </div>
    </div>
  );
};
