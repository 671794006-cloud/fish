"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 🌟 สถานะป๊อปอัปแจ้งเตือน (Modal)
  const [customAlert, setCustomAlert] = useState<{title: string, message: string, type: 'success' | 'error' | 'loading'} | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // เด้งป๊อปอัปโหลดหมุนติ้วๆ ขึ้นมาก่อนเลย
    setCustomAlert({ title: "กำลังตรวจสอบ...", message: "กรุณารอสักครู่ ระบบกำลังเข้าสู่ระบบ", type: "loading" });

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // ถ้ารหัสผิด ให้เปลี่ยนแอนิเมชันเป็น ❌ กากบาทสีแดง
      setCustomAlert({ title: "เข้าสู่ระบบไม่สำเร็จ", message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง", type: "error" });
    } else {
      // ถ้าสำเร็จ ให้เปลี่ยนเป็น ✅ เครื่องหมายถูกสีเขียว
      setCustomAlert({ title: "เข้าสู่ระบบสำเร็จ!", message: "ยินดีต้อนรับกลับมา! กำลังพากลับไปหน้าหลัก...", type: "success" });
      
      // หน่วงเวลาให้ลูกค้าอ่านข้อความ 1.5 วินาที แล้วเด้งกลับหน้าหลัก
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative font-sans">
      
      {/* 🌟 ป๊อปอัปแจ้งเตือน (Modal) เต็มหน้าจอ */}
      {customAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-gray-800 w-full max-w-sm rounded-3xl shadow-2xl p-6 md:p-8 text-center flex flex-col items-center relative animate-in fade-in zoom-in duration-200 border border-gray-700">
            
            {customAlert.type === 'loading' && (
              <div className="w-16 h-16 border-4 border-gray-600 border-t-[#4ade80] rounded-full animate-spin mb-4"></div>
            )}
            {customAlert.type === 'success' && (
              <div className="w-16 h-16 bg-green-900/50 text-green-400 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
            )}
            {customAlert.type === 'error' && (
              <div className="w-16 h-16 bg-red-900/50 text-red-400 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
            )}

            <h3 className="text-xl font-bold text-white mb-2">{customAlert.title}</h3>
            <p className="text-gray-400 text-sm mb-6 whitespace-pre-line leading-relaxed">
              {customAlert.message}
            </p>

            {customAlert.type !== 'loading' && customAlert.type !== 'success' && (
              <button 
                onClick={() => setCustomAlert(null)}
                className="w-full py-3 rounded-xl font-bold text-white bg-gray-700 hover:bg-gray-600 transition shadow-md"
              >
                ตกลง
              </button>
            )}
          </div>
        </div>
      )}

      {/* แบบฟอร์ม Login ปกติ */}
      <div className="bg-[#f0f0f0] w-full max-w-md rounded-3xl p-8 shadow-xl relative overflow-hidden">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
             <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800">เข้าสู่ระบบ</h2>
          <p className="text-sm text-gray-500 mt-1">เพื่อสั่งซื้อสินค้าและติดตามสถานะ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">อีเมล</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">รหัสผ่าน</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#0a4a2f] hover:bg-[#073622] text-white font-bold py-3.5 rounded-xl transition mt-2 shadow-md"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="flex justify-between items-center mt-6 text-xs font-semibold text-gray-500">
           <Link href="/" className="hover:text-gray-800 transition">← กลับหน้าหลัก</Link>
           <Link href="/signup" className="hover:text-green-700 transition">ยังไม่มีบัญชี? สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  );
}
