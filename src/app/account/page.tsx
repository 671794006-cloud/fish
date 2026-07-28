"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login"; // ถ้ายังไม่ล็อกอิน ให้เด้งไปหน้าล็อกอิน
      } else {
        setUser(session.user);
        const meta = session.user.user_metadata;
        if (meta) {
          setFullName(meta.fullName || "");
          setPhone(meta.phone || "");
          setAddressDetail(meta.addressDetail || "");
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // บันทึกข้อมูลที่อยู่ลงในระบบของ Supabase
    const { error } = await supabase.auth.updateUser({
      data: { fullName, phone, addressDetail }
    });

    if (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + error.message);
    } else {
      alert("✅ บันทึกข้อมูลที่อยู่สำเร็จ! เวลาสั่งซื้อระบบจะดึงข้อมูลนี้ไปใช้อัตโนมัติครับ");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      
      {/* Navbar แบบย่อ */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-green-100 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-[#0a4a2f] hover:opacity-80 transition">
          <span className="text-2xl">←</span> กลับหน้าหลัก
        </Link>
        <button onClick={handleLogout} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-full transition text-sm border border-red-200">
          ออกจากระบบ
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-[#0a4a2f] text-white p-8 rounded-t-3xl shadow-md flex items-center gap-4">
          <div className="w-16 h-16 bg-white text-[#0a4a2f] rounded-full flex items-center justify-center text-3xl font-extrabold uppercase shadow-inner">
            {user?.email?.charAt(0) || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold">บัญชีของฉัน</h1>
            <p className="text-green-200 text-sm mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          
          {/* ฝั่งซ้าย: ฟอร์มที่อยู่ */}
          <div className="md:col-span-7 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-[#0a4a2f] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              ที่อยู่สำหรับจัดส่งเริ่มต้น
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700">ชื่อ-นามสกุล</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="ระบุชื่อผู้รับสินค้า" className="w-full mt-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">เบอร์โทรศัพท์</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0812345678" className="w-full mt-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">ที่อยู่จัดส่งแบบละเอียด</label>
                <textarea value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} rows={3} placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์" className="w-full mt-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
              </div>
              <button type="submit" disabled={saving} className="w-full bg-[#0a4a2f] text-[#f3c623] py-3 rounded-xl font-bold hover:bg-[#073622] transition shadow-md">
                {saving ? "กำลังบันทึก..." : "บันทึกที่อยู่"}
              </button>
            </form>
          </div>

          {/* ฝั่งขวา: ประวัติคำสั่งซื้อ */}
          <div className="md:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
             <h2 className="text-lg font-bold text-[#0a4a2f] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z"></path></svg>
              ประวัติการสั่งซื้อ
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300 h-[300px] flex flex-col justify-center items-center">
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              <p className="text-gray-500 font-medium">ยังไม่มีประวัติการสั่งซื้อ</p>
              <p className="text-xs text-gray-400 mt-1">ออเดอร์ของคุณจะแสดงที่นี่ในอนาคต</p>
              <Link href="/" className="mt-4 bg-white border border-green-600 text-green-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-green-50 transition">
                ไปเลือกซื้อสินค้ากันเลย
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
