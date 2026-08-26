"use client";
import { useState, useEffect } from "react";

export default function IntroLoader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // ล็อกเวลาการทำงานตามสเตป (รวม 2 วิเป๊ะๆ)
    const timer1 = setTimeout(() => setStage(1), 1500); // เปลี่ยนสถานะเป็น Loaded
    const timer2 = setTimeout(() => setStage(2), 1800); // เริ่มเอฟเฟกต์แยกจอ
    const timer3 = setTimeout(() => setStage(3), 2500); // ลบแอนิเมชันออกจากระบบ

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // ถ้าโหลดจบและแยกจอเสร็จแล้ว ให้คืนพื้นที่ให้เว็บ (ลบตัวบังออก)
  if (stage === 3) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex pointer-events-none overflow-hidden">
      
      {/* 🚪 ประตูบานซ้าย (สีดำ) */}
      <div
        className={`w-1/2 h-full bg-[#111111] transition-transform duration-700 ease-in-out border-r border-white/10 ${
          stage >= 2 ? "-translate-x-full" : "translate-x-0"
        }`}
      ></div>

      {/* 🚪 ประตูบานขวา (สีดำ) */}
      <div
        className={`w-1/2 h-full bg-[#111111] transition-transform duration-700 ease-in-out border-l border-white/10 ${
          stage >= 2 ? "translate-x-full" : "translate-x-0"
        }`}
      ></div>

      {/* ✨ เส้นแสงเลเซอร์ผ่ากลาง (เหมือนในวิดีโอ) */}
      <div 
        className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-opacity duration-300 ${
          stage >= 2 ? "opacity-0" : "opacity-100"
        }`}
      ></div>

      {/* 🔮 ตรงกลาง (โลโก้ + ตัวหนังสือ) */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
          stage >= 2 ? "opacity-0 scale-110" : "opacity-100 scale-100"
        }`}
      >
        {/* แสงออร่าด้านหลังโลโก้ */}
        <div
          className={`absolute w-72 h-72 rounded-full blur-[50px] transition-all duration-300 ${
            stage === 0
              ? "bg-cyan-500/20 animate-pulse"
              : "bg-cyan-400/40 scale-125"
          }`}
        ></div>

        {/* 🏠 โลโก้ลายไทย (ใช้ CSS ซูมตัดขอบ เอาเฉพาะตัวบ้าน) */}
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-700 shadow-[0_0_30px_rgba(255,255,255,0.1)] bg-white z-10 flex items-center justify-center">
          <img
            src="/Gemini_Generated_Image_orhu2korhu2korhu.jfif"
            alt="Thai Logo"
            // CSS Trick: ถ่างรูป 170% แล้วขยับขึ้น เพื่อซ่อนต้นไม้และลายน้ำ
            className="absolute w-[170%] max-w-none object-cover -translate-y-[5%]"
          />
        </div>

        {/* 📝 ข้อความสถานะด้านล่าง */}
        <div className="mt-10 z-10 flex flex-col items-center h-10 justify-center">
          {stage === 0 ? (
            <div className="flex flex-col items-center">
              <span className="text-gray-300 font-bold tracking-[0.4em] uppercase text-sm animate-pulse">
                Loading
              </span>
              <div className="flex gap-1.5 mt-3">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
              </div>
            </div>
          ) : (
            <span className="text-white font-extrabold tracking-[0.4em] uppercase text-sm drop-shadow-[0_0_15px_rgba(34,211,238,1)] scale-110 transition-transform duration-300">
              Loaded
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
