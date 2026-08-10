"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://grilvqiyczvdkfumxxqy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyaWx2cWl5Y3p2ZGtmdW14eHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMjM0NjIsImV4cCI6MjEwMDY5OTQ2Mn0.xoT69q46aqz6SAXNsiDLUd4BEyf2Q4yfB9teuEHYktM"; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [view, setView] = useState<"menu" | "email" | "register" | "phone" | "otp">("menu");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  // 🌟 สถานะป๊อปอัปแจ้งเตือนเต็มหน้าจอแบบบล็อกการกด
  const [customAlert, setCustomAlert] = useState<{title: string, message: string, type: 'success' | 'error' | 'loading'} | null>(null);

  // --- ฟังก์ชันเข้าสู่ระบบด้วยอีเมล ---
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomAlert({ title: "กำลังตรวจสอบ...", message: "กรุณารอสักครู่ ระบบกำลังเข้าสู่ระบบ", type: "loading" });
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setCustomAlert({ title: "เข้าสู่ระบบไม่สำเร็จ", message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือยังไม่ได้สมัครสมาชิก", type: "error" });
    } else {
      setCustomAlert({ title: "เข้าสู่ระบบสำเร็จ!", message: "กำลังพากลับไปหน้าหลัก...", type: "success" });
      setTimeout(() => { window.location.href = "/"; }, 1500);
    }
  };

  // --- ฟังก์ชันสมัครสมาชิกด้วยอีเมล ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomAlert({ title: "กำลังบันทึกข้อมูล...", message: "กรุณารอสักครู่ ระบบกำลังสร้างบัญชีใหม่", type: "loading" });

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setCustomAlert({ title: "สมัครสมาชิกไม่สำเร็จ", message: error.message, type: "error" });
    } else {
      setCustomAlert({ title: "สมัครสมาชิกสำเร็จ!", message: "สร้างบัญชีเรียบร้อย กำลังพากลับไปหน้าหลัก...", type: "success" });
      setTimeout(() => { window.location.href = "/"; }, 1500);
    }
  };

  // --- ฟังก์ชัน OTP ---
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomAlert({ title: "กำลังส่งข้อความ...", message: "กรุณารอสักครู่ ระบบกำลังส่งรหัส OTP ไปที่เบอร์ของคุณ", type: "loading" });
    
    const formattedPhone = "+66" + phone.replace(/^0/, "");
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
    
    if (error) {
      setCustomAlert({ title: "ไม่สามารถส่ง SMS ได้", message: error.message, type: "error" });
    } else {
      setCustomAlert({ title: "ส่ง OTP สำเร็จ!", message: "ส่งรหัส OTP ไปที่เบอร์ของคุณแล้ว กรุณาตรวจสอบ SMS", type: "success" });
      setTimeout(() => { 
        setCustomAlert(null);
        setView("otp"); 
      }, 1500);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomAlert({ title: "กำลังตรวจสอบ...", message: "กรุณารอสักครู่", type: "loading" });
    
    const formattedPhone = "+66" + phone.replace(/^0/, "");
    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });

    if (error) {
      setCustomAlert({ title: "เข้าสู่ระบบไม่สำเร็จ", message: "รหัส OTP ไม่ถูกต้อง!", type: "error" });
    } else {
      setCustomAlert({ title: "ยืนยันสำเร็จ!", message: "เข้าสู่ระบบเรียบร้อย กำลังพากลับไปหน้าหลัก...", type: "success" });
      setTimeout(() => { window.location.href = "/"; }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-4 font-sans relative">
      
      {/* 🌟 ป๊อปอัปแจ้งเตือน (Modal) เต็มหน้าจอ */}
      {customAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 md:p-8 text-center flex flex-col items-center relative animate-in fade-in zoom-in duration-200">
            
            {customAlert.type === 'loading' && (
              <div className="w-16 h-16 border-4 border-gray-100 border-t-[#0a4a2f] rounded-full animate-spin mb-4"></div>
            )}
            {customAlert.type === 'success' && (
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
            )}
            {customAlert.type === 'error' && (
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 mb-2">{customAlert.title}</h3>
            <p className="text-gray-600 text-sm mb-6 whitespace-pre-line leading-relaxed">
              {customAlert.message}
            </p>

            {customAlert.type !== 'loading' && customAlert.type !== 'success' && (
              <button 
                onClick={() => setCustomAlert(null)}
                className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition shadow-md"
              >
                ตกลง
              </button>
            )}
          </div>
        </div>
      )}

      {/* โค้ดกล่องเข้าสู่ระบบออริจินัลของคุณ */}
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center relative shadow-2xl">
        
        <Link href="/" className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition">
          ✕
        </Link>

        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          {view === "register" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">เพื่อสั่งซื้อสินค้าและติดตามสถานะ</p>

        {/* --- หน้าเมนูหลัก --- */}
        {view === "menu" && (
          <div className="space-y-3">
            <button 
              onClick={() => setView("email")}
              className="w-full bg-[#0a4a2f] text-[#f3c623] hover:bg-[#073622] py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-sm"
            >
              เข้าสู่ระบบด้วยอีเมล
            </button>
            
            <button 
              onClick={() => setView("register")}
              className="w-full bg-white border-2 border-[#0a4a2f] text-[#0a4a2f] hover:bg-green-50 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
            >
              สมัครสมาชิกใหม่
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs">หรือ</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button 
              onClick={() => setView("phone")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition text-sm"
            >
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              เข้าสู่ระบบด้วยเบอร์โทรศัพท์ (OTP)
            </button>
          </div>
        )}

        {/* --- หน้ากรอกอีเมลสำหรับเข้าสู่ระบบ --- */}
        {view === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-bold text-gray-700">อีเมล</label>
              {/* ✅ แก้ไขคลาส text-black เพื่อไม่ให้ฟอนต์เป็นสีขาวกลืนไปกับพื้นหลัง */}
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-black font-medium placeholder-gray-400" 
                placeholder="example@email.com" 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">รหัสผ่าน</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-black font-medium placeholder-gray-400" 
                placeholder="••••••••" 
              />
            </div>
            <button type="submit" className="w-full bg-[#0a4a2f] text-white py-3.5 rounded-xl font-bold hover:bg-[#073622] transition shadow-md">
              เข้าสู่ระบบ
            </button>
            <div className="flex justify-between items-center text-xs pt-2">
              <button type="button" onClick={() => setView("menu")} className="text-gray-500 hover:text-gray-800">← กลับหน้าหลัก</button>
              <button type="button" onClick={() => setView("register")} className="text-green-700 font-bold hover:underline">ยังไม่มีบัญชี? สมัครสมาชิก</button>
            </div>
          </form>
        )}

        {/* --- หน้าสมัครสมาชิกใหม่ --- */}
        {view === "register" && (
          <form onSubmit={handleRegister} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-bold text-gray-700">อีเมลสำหรับสมัครสมาชิก</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-black font-medium placeholder-gray-400" 
                placeholder="example@email.com" 
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">ตั้งรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-black font-medium placeholder-gray-400" 
                placeholder="••••••••" 
              />
            </div>
            <button type="submit" className="w-full bg-[#0a4a2f] text-[#f3c623] py-3.5 rounded-xl font-bold hover:bg-[#073622] transition shadow-md">
              ยืนยันการสมัครสมาชิก
            </button>
            <div className="flex justify-between items-center text-xs pt-2">
              <button type="button" onClick={() => setView("menu")} className="text-gray-500 hover:text-gray-800">← กลับหน้าหลัก</button>
              <button type="button" onClick={() => setView("email")} className="text-green-700 font-bold hover:underline">มีบัญชีแล้ว? เข้าสู่ระบบ</button>
            </div>
          </form>
        )}

        {/* --- หน้ากรอกเบอร์โทรศัพท์ --- */}
        {view === "phone" && (
          <form onSubmit={handlePhoneLogin} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-bold text-gray-700">เบอร์โทรศัพท์</label>
              <div className="flex mt-1">
                <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-500 font-bold">+66</span>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-r-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-black font-medium placeholder-gray-400" placeholder="0812345678" />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#0a4a2f] text-white py-3.5 rounded-xl font-bold hover:bg-[#073622] transition shadow-md">
              รับรหัส OTP
            </button>
            <button type="button" onClick={() => setView("menu")} className="w-full text-sm text-gray-500 py-2">← กลับหน้าหลัก</button>
          </form>
        )}

        {/* --- หน้ากรอกรหัส OTP --- */}
        {view === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-bold text-gray-700">รหัส OTP 6 หลัก</label>
              <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full mt-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-center tracking-widest text-xl text-black font-bold placeholder-gray-400" placeholder="123456" maxLength={6} />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition shadow-md">
              ยืนยันรหัส OTP
            </button>
            <button type="button" onClick={() => setView("phone")} className="w-full text-sm text-gray-500 py-2">← เปลี่ยนเบอร์โทร</button>
          </form>
        )}

      </div>
    </div>
  );
}
