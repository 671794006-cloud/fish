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
  
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login"; 
      } else {
        setUser(session.user);
        const meta = session.user.user_metadata;
        if (meta) {
          setFullName(meta.fullName || "");
          setPhone(meta.phone || "");
          setAddressDetail(meta.addressDetail || "");
        }

        const { data: orderData } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (orderData) {
          setOrders(orderData);
        }
      }
      setLoading(false);
    };
    fetchUserAndOrders();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { fullName, phone, addressDetail }
    });
    if (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + error.message);
    } else {
      alert("✅ บันทึกข้อมูลที่อยู่สำเร็จ!");
    }
    setSaving(false);
  };

// --- ฟังก์ชันยกเลิกคำสั่งซื้อ ---
  const handleCancelOrder = async (orderId: number) => {
    const confirmCancel = window.confirm("คุณแน่ใจหรือไม่ที่จะยกเลิกคำสั่งซื้อนี้?");
    if (!confirmCancel) return;

    // 🔴 ใส่ URL ของ Google Apps Script ตรงนี้ด้วยครับ (URL เดียวกับหน้าสั่งซื้อเลย)
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzZbB7Go7N6jg_8n1TEqzCOEuXYzFOkbSLUSEqfXu02XNSr6kx_PAuhQolZqMog6RzZ/exec";

    // 1. อัปเดตสถานะใน Supabase
    const { error } = await supabase
      .from('orders')
      .update({ status: 'ยกเลิกแล้ว' })
      .eq('id', orderId);

    if (error) {
      alert("เกิดข้อผิดพลาดในการยกเลิก: " + error.message);
    } else {
      
      // 2. แอบส่งคำสั่งไปเปลี่ยนสถานะใน Google Sheets ให้เป็น "ยกเลิกแล้ว"
      try {
        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "cancel",     // บอกชีตว่านี่คือการยกเลิก
            orderId: orderId      // ส่งรหัสออเดอร์ไปให้ชีตค้นหาบรรทัดที่ถูกต้อง
          }),
        });
      } catch (e) {
        console.error(e);
      }

      alert("✅ ยกเลิกคำสั่งซื้อสำเร็จ");
      // อัปเดตหน้าจอทันที
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'ยกเลิกแล้ว' } : order
      ));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-green-100 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-[#0a4a2f] hover:opacity-80 transition">
          <span className="text-2xl">←</span> กลับหน้าหลัก
        </Link>
        <button onClick={handleLogout} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-full transition text-sm border border-red-200">
          ออกจากระบบ
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-[#0a4a2f] text-white p-8 rounded-t-3xl shadow-md flex items-center gap-4">
          <div className="w-16 h-16 bg-white text-[#0a4a2f] rounded-full flex items-center justify-center text-3xl font-extrabold uppercase shadow-inner">
            {user?.email?.charAt(0) || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold">บัญชีของฉัน</h1>
            <p className="text-green-200 text-sm mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* ฝั่งซ้าย: ฟอร์มที่อยู่ */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-lg font-bold text-[#0a4a2f] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              ที่อยู่จัดส่งเริ่มต้น
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
          <div className="lg:col-span-8 space-y-4">
             <h2 className="text-xl font-bold text-[#0a4a2f] flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z"></path></svg>
              ประวัติการสั่งซื้อ
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-300 h-[300px] flex flex-col justify-center items-center shadow-sm">
                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                <p className="text-gray-500 font-medium">ยังไม่มีประวัติการสั่งซื้อ</p>
                <Link href="/" className="mt-4 bg-[#0a4a2f] text-[#f3c623] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#073622] transition shadow-sm">
                  ไปเลือกซื้อสินค้ากันเลย
                </Link>
              </div>
            ) : (
              orders.map((order, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* หัวบิล */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                      วิสาหกิจบ้านป่าตึงงาม
                    </div>
                    {/* เปลี่ยนสีตัวหนังสือตามสถานะ */}
                    <div className={`font-semibold text-sm ${order.status === 'ยกเลิกแล้ว' ? 'text-red-500' : 'text-orange-500'}`}>
                      {order.status}
                    </div>
                  </div>

                  {/* รายการสินค้า */}
                  <div className="p-4 space-y-4">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gray-200 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-medium text-gray-900 line-clamp-2 leading-snug">{item.name}</h3>
                            <span className="font-semibold text-gray-800 shrink-0">฿{item.price}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{item.unit}</p>
                          <p className="text-sm text-gray-500 font-medium mt-1 text-right">x{item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* สรุปยอด และปุ่มกด */}
                  <div className="p-4 border-t border-gray-100 flex flex-col items-end gap-3 bg-gray-50/30">
                    <div className="text-gray-800 font-medium">
                      ยอดรวม: <span className="text-xl font-bold text-[#ee4d2d]">฿{order.total_price}</span>
                    </div>
                    
                    <div className="flex gap-3 mt-1">
                      {/* ปุ่มยกเลิก จะโชว์เฉพาะออเดอร์ที่ยัง รอดำเนินการ */}
                      {order.status === 'รอดำเนินการ' && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-6 py-2 bg-white border border-gray-300 text-gray-600 font-bold rounded-[4px] hover:bg-gray-50 hover:text-red-500 transition shadow-sm text-sm"
                        >
                          ยกเลิกคำสั่งซื้อ
                        </button>
                      )}

                      <Link href="/" className="px-6 py-2 bg-[#ee4d2d] text-white font-bold rounded-[4px] hover:bg-[#d73f22] transition shadow-sm text-sm">
                        ซื้ออีกครั้ง
                      </Link>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
