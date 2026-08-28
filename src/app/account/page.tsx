"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://grilvqiyczvdkfumxxqy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyaWx2cWl5Y3p2ZGtmdW14eHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMjM0NjIsImV4cCI6MjEwMDY5OTQ2Mn0.xoT69q46aqz6SAXNsiDLUd4BEyf2Q4yfB9teuEHYktM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  // 🌟 เช็ก Theme อัตโนมัติเมื่อเข้าเว็บให้เหมือนกับหน้าหลัก
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); 
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [adminList, setAdminList] = useState<any[]>([]);
  const [newAdminAccount, setNewAdminAccount] = useState("");
  const [adminTab, setAdminTab] = useState<"orders" | "admins">("orders");

  const [toastMessage, setToastMessage] = useState(""); 
  const [customAlert, setCustomAlert] = useState<{title: string, message: string, type: 'success' | 'error' | 'loading'} | null>(null);

  const [kickTarget, setKickTarget] = useState<{id: number, email: string} | null>(null);
  const [isKicking, setIsKicking] = useState(false);

  const [cancelTarget, setCancelTarget] = useState<number | null>(null);
  const [isCancelingOrder, setIsCancelingOrder] = useState(false);

  const [mapLink, setMapLink] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showMap, setShowMap] = useState(false); 
  const mapInstanceRef = useRef<any>(null);

  const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1mKZ2Jxbk7jQre97-GuoNKsRAgkqUaN5PLkXeTDVvyAY/edit?gid=0#gid=0";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("shop_theme") as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    }

    const fetchUserAndOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login"; 
        return;
      } 
      
      setUser(session.user);
      
      const meta = session.user.user_metadata;
      if (meta) {
        setFullName(meta.fullName || "");
        setPhone(meta.phone || "");
        setAddressDetail(meta.addressDetail || "");
        setMapLink(meta.mapLink || "");
        setUserLocation(meta.userLocation || null);
      }

      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (orderData) setOrders(orderData);

      const currentUserIdentifier = session.user.email || session.user.phone || "";

      if (currentUserIdentifier) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("*")
          .eq("email", currentUserIdentifier)
          .maybeSingle(); 

        if (adminData) {
          setIsAdmin(true); 
          setIsSuperAdmin(adminData.is_super); 
          fetchAllAdminData();
        }
      }
      
      setLoading(false);
    };
    
    fetchUserAndOrders();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("shop_theme", theme);
    }
  }, [theme]);

  const fetchAllAdminData = async () => {
    const { data: ordersData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (ordersData) setAllOrders(ordersData);

    const { data: adminsData } = await supabase.from("admins").select("*").order("is_super", { ascending: false }).order("created_at", { ascending: true });
    if (adminsData) setAdminList(adminsData);
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setCustomAlert({ title: "กำลังอัปเดต...", message: "ระบบกำลังซิงค์สถานะใหม่ไปยัง Excel", type: "loading" });

    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    
    if (error) {
      setCustomAlert({ title: "เกิดข้อผิดพลาด", message: error.message, type: "error" });
    } else {
      const scriptUrl = "https://script.google.com/macros/s/AKfycbyRwXmahIGk6HRxmmILYd7RP_cF6zjtwjQhlMDavO9WyK9vq0s5CAN02aQk7z3PDM2k/exec";
      fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "update_status", orderId: orderId, status: newStatus })
      }).catch(console.error);

      setAllOrders(allOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setCustomAlert({ title: "อัปเดตสำเร็จ!", message: "สถานะถูกเปลี่ยนในระบบและ Excel เรียบร้อยแล้ว", type: "success" });
      setTimeout(() => setCustomAlert(null), 1500);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    let accountToAdd = newAdminAccount.trim();
    if (!accountToAdd) return;

    if (/^0[0-9]{9}$/.test(accountToAdd)) {
      accountToAdd = "+66" + accountToAdd.substring(1);
    }

    const { error } = await supabase.from("admins").insert([{ email: accountToAdd, is_super: false }]); 
    if (error) {
      setCustomAlert({ title: "เกิดข้อผิดพลาด", message: "ไม่สามารถเพิ่มได้ ข้อมูลนี้อาจมีอยู่แล้ว", type: "error" });
    } else {
      showToast("✅ เพิ่มแอดมินใหม่เรียบร้อย!");
      setNewAdminAccount("");
      fetchAllAdminData();
    }
  };

  const prepareRemoveAdmin = (id: number, emailOrPhone: string) => {
    if (!isSuperAdmin) {
      setCustomAlert({ title: "ไม่มีสิทธิ์!", message: "เฉพาะแอดมินสูงสุด 👑 เท่านั้นที่สามารถเตะคนอื่นได้ครับ", type: "error" });
      return;
    }
    if (emailOrPhone === (user?.email || user?.phone)) {
      setCustomAlert({ title: "เตะตัวเองไม่ได้!", message: "คุณไม่สามารถเตะตัวเองออกจากระบบได้ครับ!", type: "error" });
      return;
    }
    setKickTarget({ id, email: emailOrPhone });
  };

  const confirmKickAdmin = async () => {
    if (!kickTarget || !isSuperAdmin) return;
    setIsKicking(true); 

    setTimeout(async () => {
      const { error } = await supabase.from("admins").delete().eq("id", kickTarget.id);
      setIsKicking(false);
      setKickTarget(null);
      
      if (!error) {
        showToast("🦵 เตะกระเด็นออกจากระบบเรียบร้อย!");
        fetchAllAdminData();
      } else {
        setCustomAlert({ title: "เกิดข้อผิดพลาด", message: "ลบสิทธิ์ไม่สำเร็จ", type: "error" });
      }
    }, 1500);
  };

  const handleTransferSuperAdmin = async (targetId: number, targetEmail: string) => {
    if (!isSuperAdmin) return;
    if (!window.confirm(`⚠️ คำเตือนระดับสูงสุด!\n\nคุณต้องการโอนตำแหน่ง "👑 แอดมินสูงสุด" ให้กับ ${targetEmail} ใช่หรือไม่?\n\nเมื่อโอนแล้ว คุณจะกลายเป็นแอดมินธรรมดา และไม่สามารถดึงสิทธิ์คืนได้เองอีกต่อไป!`)) return;

    setCustomAlert({ title: "กำลังโอนสิทธิ์...", message: "โปรดรอสักครู่", type: "loading" });

    await supabase.from("admins").update({ is_super: false }).eq("email", user?.email || user?.phone);
    const { error } = await supabase.from("admins").update({ is_super: true }).eq("id", targetId);

    if (error) {
      setCustomAlert({ title: "เกิดข้อผิดพลาด", message: error.message, type: "error" });
    } else {
      setCustomAlert({ title: "โอนสิทธิ์สำเร็จ!", message: `แอดมินสูงสุดถูกเปลี่ยนเป็น ${targetEmail} เรียบร้อยแล้ว`, type: "success" });
      setIsSuperAdmin(false); 
      setAdminTab("orders"); 
      fetchAllAdminData();
      setTimeout(() => setCustomAlert(null), 2500);
    }
  };

  useEffect(() => {
    if (showMap) {
      const initMap = () => {
        const L = (window as any).L;
        if (!L) return;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const lat = userLocation?.lat || 19.910480;
        const lng = userLocation?.lng || 99.840576;
        const map = L.map('account-map', { zoomControl: false }).setView([lat, lng], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
        L.control.zoom({ position: 'bottomleft' }).addTo(map);

        map.on('moveend', () => {
          const center = map.getCenter();
          setUserLocation({ lat: center.lat, lng: center.lng });
          setMapLink(`https://maps.google.com/?q=${center.lat},${center.lng}`);
        });
        mapInstanceRef.current = map;
      };

      if (!(window as any).L) {
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }
        if (!document.getElementById('leaflet-js')) {
          const script = document.createElement('script');
          script.id = 'leaflet-js';
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = initMap;
          document.head.appendChild(script);
        }
      } else {
        initMap();
      }
      return () => {
         if (mapInstanceRef.current) {
             mapInstanceRef.current.remove();
             mapInstanceRef.current = null;
         }
      };
    }
  }, [showMap, userLocation]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => { setToastMessage(""); }, 2000);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setCustomAlert({ title: "กำลังหาตำแหน่ง...", message: "ระบบกำลังค้นหาพิกัดปัจจุบันของคุณ", type: "loading" });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapLink(`https://maps.google.com/?q=${latitude},${longitude}`);
          if (mapInstanceRef.current) mapInstanceRef.current.flyTo([latitude, longitude], 17, { animate: true, duration: 1.5 });
          setCustomAlert(null);
          setShowMap(true); 
        },
        (error) => {
          setCustomAlert({ title: "ไม่สามารถดึงตำแหน่งได้", message: "กรุณาเปิด GPS/Location แล้วลองอีกครั้ง\nหรือค้นหาผ่านชื่อจังหวัดครับ", type: "error" });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      setCustomAlert({ title: "ไม่รองรับการทำงาน", message: "เบราว์เซอร์ของคุณไม่รองรับการดึงตำแหน่งครับ", type: "error" });
    }
  };

  const handleSearchAddress = async () => {
    if (!addressDetail.trim()) {
      setCustomAlert({ title: "ข้อมูลไม่ครบถ้วน", message: "กรุณาพิมพ์ที่อยู่ในช่องก่อนกดค้นหาครับ", type: "error" });
      return;
    }
    setCustomAlert({ title: "กำลังค้นหาพิกัด...", message: "โปรดรอสักครู่ ระบบกำลังค้นหาพิกัดจากที่อยู่", type: "loading" });
    try {
      let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressDetail)}`);
      let data = await res.json();
      
      if (!data || data.length === 0) {
        const subDistrictMatch = addressDetail.match(/(ตำบล|ต\.|แขวง).*$/);
        if (subDistrictMatch) {
           const query = subDistrictMatch[0] + " Thailand";
           res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
           data = await res.json();
        }
      }

      if (!data || data.length === 0) {
        const districtMatch = addressDetail.match(/(อำเภอ|เขต|อ\.).*?(จังหวัด|จ\.).*?(\s|$)/);
        if (districtMatch) {
           const query = districtMatch[0] + " Thailand";
           res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
           data = await res.json();
        }
      }

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setUserLocation({ lat, lng });
        setMapLink(`https://maps.google.com/?q=${lat},${lng}`);
        if (mapInstanceRef.current) mapInstanceRef.current.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
        setCustomAlert(null);
        setShowMap(true);
      } else {
        setCustomAlert({ title: "หาพิกัดไม่พบ", message: "ลองตรวจตัวสะกดชื่อ ตำบล อำเภอ จังหวัด อีกครั้งครับ", type: "error" });
      }
    } catch (error) {
      setCustomAlert({ title: "เกิดข้อผิดพลาด", message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์แผนที่ได้", type: "error" });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setCustomAlert({ title: "กำลังบันทึก...", message: "โปรดรอสักครู่ ระบบกำลังบันทึกข้อมูล", type: "loading" });
    
    const { error } = await supabase.auth.updateUser({
      data: { fullName, phone, addressDetail, mapLink, userLocation }
    });

    if (error) {
      setCustomAlert({ title: "เกิดข้อผิดพลาด", message: "ไม่สามารถบันทึกข้อมูลได้", type: "error" });
    } else {
      setCustomAlert({ title: "บันทึกสำเร็จ!", message: "บันทึกที่อยู่และพิกัดเรียบร้อยแล้ว", type: "success" });
      setTimeout(() => setCustomAlert(null), 1500);
    }
    setSaving(false);
  };

  const prepareCancelOrder = (orderId: number) => {
    setCancelTarget(orderId);
  };

  const executeCancelOrder = async () => {
    if (cancelTarget === null) return;
    setIsCancelingOrder(true); 

    setTimeout(async () => {
      const orderId = cancelTarget;
      const { error } = await supabase.from('orders').update({ status: 'ยกเลิกแล้ว' }).eq('id', orderId);
      
      setIsCancelingOrder(false);
      setCancelTarget(null);

      if (error) {
        setCustomAlert({ title: "เกิดข้อผิดพลาด", message: "ไม่สามารถยกเลิกคำสั่งซื้อได้", type: "error" });
      } else {
        const scriptUrl = "https://script.google.com/macros/s/AKfycbyRwXmahIGk6HRxmmILYd7RP_cF6zjtwjQhlMDavO9WyK9vq0s5CAN02aQk7z3PDM2k/exec";
        fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action: "cancel", orderId: orderId })
        }).catch(console.error);

        showToast("✅ ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว (แง๊ๆๆๆ)");
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'ยกเลิกแล้ว' } : o));
      }
    }, 1500);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black font-sans font-bold text-gray-500">กำลังตรวจสอบข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-200 font-sans pb-20 relative transition-colors duration-300">
      
      {/* --- 💥 Custom Modal เตะแอดมิน (Pixel Art Style) 💥 --- */}
      {kickTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono">
          <style>{`
            @keyframes windup {
              0% { transform: translateX(0) rotate(0); }
              30% { transform: translateX(-30px) rotate(-25deg); }
              50% { transform: translateX(40px) rotate(15deg); }
              100% { transform: translateX(40px) rotate(15deg); }
            }
            @keyframes flyaway {
              0% { transform: translateX(0) rotate(0); opacity: 1; }
              45% { transform: translateX(0) rotate(0); opacity: 1; }
              50% { transform: translateX(20px) rotate(45deg); opacity: 1; }
              100% { transform: translateX(350px) rotate(1080deg) scale(0.3); opacity: 0; }
            }
            @keyframes powEffect {
              0% { opacity: 0; transform: scale(0.5); }
              49% { opacity: 0; transform: scale(0.5); }
              50% { opacity: 1; transform: scale(2); }
              80% { opacity: 0; transform: scale(2.5); }
              100% { opacity: 0; }
            }
          `}</style>
          
          <div className="bg-gray-900 border-4 border-red-600 w-full max-w-md rounded-none shadow-[10px_10px_0_0_rgba(220,38,38,1)] p-6 md:p-8 text-center flex flex-col items-center relative overflow-hidden">
            <h3 className="text-2xl font-extrabold text-red-500 mb-2 uppercase tracking-widest drop-shadow-md">⚠️ Warning ⚠️</h3>
            <p className="text-gray-300 mb-6 text-sm">
              คุณกำลังจะเตะแอดมินท่านนี้<br/>
              <span className="text-white bg-red-700 px-3 py-1 inline-block mt-3 font-bold border-2 border-red-900">{kickTarget.email}</span>
            </p>

            <div className="relative w-full h-32 bg-gray-800 border-2 border-gray-700 mb-8 flex items-center justify-center overflow-hidden">
               <div className="text-6xl absolute z-10" style={{ animation: isKicking ? 'powEffect 1.5s forwards' : 'none', opacity: 0, left: '50%' }}>💥</div>
               <div className="text-6xl absolute z-20" style={{ animation: isKicking ? 'windup 1.5s forwards' : 'none', left: '30%', filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.5))' }}>👞</div>
               <div className="text-6xl absolute z-10" style={{ animation: isKicking ? 'flyaway 1.5s forwards' : 'none', left: '50%', filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.5))' }}>🧍</div>
            </div>

            {!isKicking ? (
              <div className="flex gap-4 w-full">
                <button onClick={() => setKickTarget(null)} className="flex-1 bg-gray-600 text-white font-bold py-3 border-b-4 border-gray-800 hover:bg-gray-500 hover:mt-1 hover:border-b-0 transition-all uppercase">Cancel</button>
                <button onClick={confirmKickAdmin} className="flex-1 bg-red-600 text-white font-bold py-3 border-b-4 border-red-900 hover:bg-red-500 hover:mt-1 hover:border-b-0 transition-all uppercase tracking-widest">🔥 Kick!</button>
              </div>
            ) : (
               <div className="text-red-500 font-extrabold animate-pulse text-xl uppercase tracking-widest">Kicking...</div>
            )}
          </div>
        </div>
      )}

      {/* --- 😭 Custom Modal ยกเลิกออเดอร์ --- */}
      {cancelTarget !== null && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono">
          <style>{`
            @keyframes tantrum {
              0% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(-25px, 10px) rotate(-45deg); }
              50% { transform: translate(25px, 10px) rotate(45deg); }
              75% { transform: translate(-25px, 10px) rotate(-45deg); }
              100% { transform: translate(0, 0) rotate(0deg); }
            }
            @keyframes tear-shoot-left {
              0% { transform: translate(0, 0) scale(1); opacity: 1; }
              100% { transform: translate(-80px, 40px) scale(1.5); opacity: 0; }
            }
            @keyframes tear-shoot-right {
              0% { transform: translate(0, 0) scale(1); opacity: 1; }
              100% { transform: translate(80px, 40px) scale(1.5); opacity: 0; }
            }
          `}</style>
          
          <div className="bg-gray-900 border-4 border-blue-500 w-full max-w-md rounded-none shadow-[10px_10px_0_0_rgba(59,130,246,1)] p-6 md:p-8 text-center flex flex-col items-center relative overflow-hidden">
            <h3 className="text-2xl font-extrabold text-blue-400 mb-2 uppercase tracking-widest drop-shadow-md">NOOOOOOO! 😭</h3>
            <p className="text-gray-300 mb-6 text-sm">
              คุณแน่ใจหรอว่าจะ <span className="text-white bg-blue-700 px-2 py-0.5 font-bold">ยกเลิก</span> ออเดอร์นี้จริงๆ?<br/>
              <span className="text-xs text-gray-500 mt-2 inline-block">(แอดมินร้องไห้แล้วนะ)</span>
            </p>

            <div className="relative w-full h-32 bg-gray-800 border-2 border-gray-700 mb-8 flex items-center justify-center overflow-hidden">
               {isCancelingOrder && <div className="text-4xl absolute z-10" style={{ animation: 'tear-shoot-left 0.5s infinite', left: '40%' }}>💦</div>}
               <div className="text-7xl absolute z-20" style={{ animation: isCancelingOrder ? 'tantrum 0.4s infinite' : 'none', filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.5))' }}>😭</div>
               {isCancelingOrder && <div className="text-4xl absolute z-10" style={{ animation: 'tear-shoot-right 0.5s infinite', left: '50%' }}>💦</div>}
            </div>

            {!isCancelingOrder ? (
              <div className="flex gap-4 w-full">
                <button onClick={() => setCancelTarget(null)} className="flex-1 bg-green-600 text-white font-bold py-3 border-b-4 border-green-800 hover:bg-green-500 hover:mt-1 hover:border-b-0 transition-all uppercase text-xs sm:text-sm">ไม่ยกเลิกแล้ว!</button>
                <button onClick={executeCancelOrder} className="flex-1 bg-gray-600 text-white font-bold py-3 border-b-4 border-gray-800 hover:bg-gray-500 hover:mt-1 hover:border-b-0 transition-all uppercase text-xs sm:text-sm tracking-widest">ยืนยันยกเลิก</button>
              </div>
            ) : (
               <div className="text-blue-500 font-extrabold animate-pulse text-xl uppercase tracking-widest">Crying... 😭😭😭</div>
            )}
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#0a4a2f] dark:bg-[#111] text-[#f3c623] dark:text-[#fde047] px-6 py-3 rounded-full shadow-2xl z-[100] font-bold text-sm flex items-center gap-2 animate-bounce border border-[#f3c623]/20">
          {toastMessage}
        </div>
      )}

      {customAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111] w-full max-w-sm rounded-3xl shadow-2xl p-6 md:p-8 text-center flex flex-col items-center relative animate-in fade-in zoom-in duration-200 border border-transparent dark:border-neutral-800">
            {customAlert.type === 'loading' && <div className="w-16 h-16 border-4 border-gray-100 dark:border-neutral-800 border-t-[#0a4a2f] dark:border-t-green-500 rounded-full animate-spin mb-4"></div>}
            {customAlert.type === 'success' && <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 shadow-inner"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div>}
            {customAlert.type === 'error' && <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4 shadow-inner"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg></div>}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{customAlert.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 whitespace-pre-line leading-relaxed">{customAlert.message}</p>
            {customAlert.type !== 'loading' && customAlert.type !== 'success' && (
              <button onClick={() => setCustomAlert(null)} className="w-full py-3 rounded-xl font-bold text-white transition shadow-md bg-[#0a4a2f] dark:bg-green-600 hover:bg-[#073622] dark:hover:bg-green-700">ตกลง</button>
            )}
          </div>
        </div>
      )}

      {/* Navbar พร้อมปุ่มสลับธีม ☀️/🌙 */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0a0a0a] border-b border-green-100 dark:border-neutral-900 sticky top-0 z-40 shadow-sm transition-colors duration-300">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-[#0a4a2f] dark:text-white hover:opacity-80 transition">
          <span className="text-2xl">←</span> กลับหน้าหลัก
        </Link>
        
        <div className="flex items-center gap-3">
          {/* 🌟 ปุ่มสลับ Theme สว่าง/มืด */}
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
            title="สลับโหมดหน้าจอ"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button onClick={handleLogout} className="text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 px-4 py-2 rounded-full transition text-sm border border-red-200 dark:border-red-900/50">
            ออกจากระบบ
          </button>
        </div>
      </nav>

      {/* 🌟 หน้าจัดการหลังบ้าน */}
      {isAdmin && showAdminPanel ? (
        <div className="max-w-5xl mx-auto px-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 p-4 rounded-t-3xl shadow-sm mb-6 gap-4">
            <h2 className="font-bold text-yellow-800 dark:text-yellow-400 text-lg flex items-center gap-2">
              <span className="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs uppercase">Admin</span> ระบบจัดการร้านค้า
            </h2>
            <button onClick={() => setShowAdminPanel(false)} className="text-sm font-bold bg-white dark:bg-[#111] text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700 transition shadow-sm w-full sm:w-auto">
              กลับไปหน้าบัญชี
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => setAdminTab("orders")} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition ${adminTab === "orders" ? "bg-[#0a4a2f] dark:bg-green-600 text-[#f3c623] dark:text-white shadow-md" : "bg-white dark:bg-[#111] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-800"}`}>📦 รายการออเดอร์</button>
            {isSuperAdmin && (
              <button onClick={() => setAdminTab("admins")} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition ${adminTab === "admins" ? "bg-[#0a4a2f] dark:bg-green-600 text-[#f3c623] dark:text-white shadow-md" : "bg-white dark:bg-[#111] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-neutral-800"}`}>🔑 จัดการแอดมิน</button>
            )}
          </div>

          {adminTab === "orders" && (
            <div className="space-y-4">
              {allOrders.length === 0 ? (
                <div className="bg-white dark:bg-[#111] rounded-3xl p-12 text-center border border-dashed border-gray-300 dark:border-neutral-800">
                  <p className="text-gray-500 dark:text-gray-400 font-bold">ยังไม่มีออเดอร์เข้ามาในระบบครับ</p>
                </div>
              ) : (
                allOrders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden mb-4">
                    
                    <div className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-neutral-800 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#0a4a2f] dark:bg-green-600 text-[#f3c623] dark:text-white px-3 py-1 rounded-lg font-extrabold text-sm shadow-sm">ID: {order.id}</span>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">📅 {formatDate(order.created_at)}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(order.id.toString());
                          showToast(`📋 คัดลอกรหัส [ ${order.id} ] แล้ว! กด Ctrl+F ใน Excel เพื่อค้นหาได้เลย`);
                          window.open(GOOGLE_SHEET_URL, "_blank");
                        }}
                        className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-green-300 dark:border-green-800 shadow-sm w-full sm:w-auto justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        📊 ดูข้อมูลลูกค้าใน Excel
                      </button>
                    </div>

                    <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="space-y-1">
                          {order.items.map((item: any, i: number) => (
                            <div key={i} className="text-sm font-medium text-gray-800 dark:text-gray-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>{item.name} <span className="text-orange-600 dark:text-orange-400 font-extrabold ml-auto">x{item.qty}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 font-bold text-gray-900 dark:text-white">ยอดสุทธิ: <span className="text-red-500 dark:text-red-400">฿{order.total_price}</span></div>
                      </div>
                      <div className="bg-gray-50 dark:bg-[#111] p-3 rounded-xl border border-gray-100 dark:border-neutral-800 shrink-0 w-full md:w-auto h-fit">
                        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold block mb-1">สถานะปัจจุบัน:</label>
                        <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="w-full font-bold text-sm rounded-xl px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-800 dark:text-white outline-none cursor-pointer">
                          <option value="รอดำเนินการ">🟠 รอดำเนินการ</option>
                          <option value="กำลังจัดส่ง">🔵 กำลังจัดส่ง</option>
                          <option value="จัดส่งสำเร็จ">🟢 จัดส่งสำเร็จ</option>
                          <option value="ยกเลิกแล้ว">🔴 ยกเลิกแล้ว</option>
                        </select>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          )}

          {/* 🌟 ซ่อนเนื้อหาการจัดการแอดมินสำหรับแอดมินทั่วไป */}
          {isSuperAdmin && adminTab === "admins" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-gray-200 dark:border-neutral-800 shadow-sm h-fit">
                <h3 className="font-bold mb-4 text-[#0a4a2f] dark:text-green-400">เพิ่มแอดมินใหม่</h3>
                <form onSubmit={handleAddAdmin} className="space-y-3">
                  <input type="text" required value={newAdminAccount} onChange={(e) => setNewAdminAccount(e.target.value)} placeholder="อีเมล หรือ เบอร์โทร (เช่น 0812345678)" className="w-full p-3 border border-gray-300 dark:border-neutral-700 rounded-xl outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 dark:bg-[#111] dark:text-white placeholder-gray-400" />
                  <button type="submit" className="w-full bg-[#0a4a2f] dark:bg-green-600 text-[#f3c623] dark:text-white font-bold py-3 rounded-xl hover:bg-[#073622] dark:hover:bg-green-700 transition shadow-md">เพิ่มสิทธิ์แอดมินทั่วไป</button>
                </form>
              </div>
              <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-gray-200 dark:border-neutral-800 shadow-sm">
                <h3 className="font-bold mb-4 text-[#0a4a2f] dark:text-green-400">รายชื่อผู้ดูแลระบบ</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {adminList.map((admin) => {
                    const isMe = admin.email === (user?.email || user?.phone);
                    return (
                      <div key={admin.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 dark:bg-[#111] rounded-xl border border-gray-100 dark:border-neutral-800 gap-3">
                        <div className="font-semibold text-sm flex flex-wrap items-center gap-2 text-gray-800 dark:text-gray-200">
                          <span className="truncate max-w-[150px] sm:max-w-full">{admin.email}</span>
                          {isMe && <span className="text-[10px] bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full whitespace-nowrap">คุณ</span>}
                          {admin.is_super && <span className="text-[10px] bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">👑 แอดมินสูงสุด</span>}
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          {isSuperAdmin && !admin.is_super && (
                            <button onClick={() => handleTransferSuperAdmin(admin.id, admin.email)} className="text-[10px] bg-white dark:bg-black text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-neutral-800 px-3 py-2 rounded-lg font-bold transition shadow-sm border border-purple-200 dark:border-purple-800 whitespace-nowrap">
                              โอนสิทธิ์ 👑
                            </button>
                          )}
                          
                          {isSuperAdmin && !admin.is_super && (
                            <button onClick={() => prepareRemoveAdmin(admin.id, admin.email)} className="text-red-500 dark:text-red-400 bg-white dark:bg-black border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-neutral-800 px-3 py-1.5 rounded-lg transition font-bold text-xs shadow-sm whitespace-nowrap">
                              ลบสิทธิ์
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 🟢 หน้าบัญชีผู้ใช้ปกติ */
        <div className="max-w-5xl mx-auto px-4 mt-8 animate-in fade-in duration-300">
          <div className="bg-[#0a4a2f] dark:bg-neutral-900 text-white p-8 rounded-t-3xl shadow-md flex justify-between items-center transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white text-[#0a4a2f] rounded-full flex items-center justify-center text-3xl font-extrabold uppercase shadow-inner">
                {(user?.email || user?.phone || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  บัญชีของฉัน
                  {isSuperAdmin && <span className="text-[10px] bg-purple-500 text-white px-2 py-1 rounded-full shadow-sm ml-1">👑 แอดมินสูงสุด</span>}
                </h1>
                <p className="text-green-200 text-sm mt-1">{user?.email || user?.phone}</p>
              </div>
            </div>
            {isAdmin && (
              <button onClick={() => setShowAdminPanel(true)} className="hidden md:flex bg-[#f3c623] hover:bg-yellow-400 text-[#0a4a2f] px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition items-center gap-2">
                ⚙️ จัดการร้านค้า
              </button>
            )}
          </div>

          {isAdmin && (
            <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 md:hidden">
              <button onClick={() => setShowAdminPanel(true)} className="w-full bg-[#f3c623] text-[#0a4a2f] py-3 rounded-xl font-bold shadow-sm flex justify-center items-center gap-2">
                ⚙️ เข้าสู่ระบบจัดการร้านค้า
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            
            {/* ฝั่งซ้าย: ฟอร์มที่อยู่ และ แผนที่ปักหมุด */}
            <div className="lg:col-span-4 bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-neutral-800 h-fit transition-colors">
              <h2 className="text-lg font-bold text-[#0a4a2f] dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                ที่อยู่จัดส่งเริ่มต้น
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">ชื่อ-นามสกุล</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="ระบุชื่อผู้รับสินค้า" className="w-full mt-1 p-3 border border-gray-300 dark:border-neutral-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-[#111] dark:text-white" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">เบอร์โทรศัพท์</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0812345678" className="w-full mt-1 p-3 border border-gray-300 dark:border-neutral-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-[#111] dark:text-white" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">ที่อยู่จัดส่งแบบละเอียด</label>
                  <textarea value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} rows={3} placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์" className="w-full mt-1 p-3 border border-gray-300 dark:border-neutral-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-[#111] dark:text-white" />
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex gap-2">
                    <button type="button" onClick={handleSearchAddress} className="flex-1 p-2.5 rounded-xl border bg-gray-100 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 text-sm font-bold transition flex items-center justify-center gap-2">
                      🔍 ค้นหาพิกัดจากที่อยู่
                    </button>
                  </div>

                  {!showMap ? (
                    <button type="button" onClick={() => setShowMap(true)} className={`w-full p-2.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition ${mapLink ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400 shadow-sm' : 'bg-white dark:bg-[#111] border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800'}`}>
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      {mapLink ? "📍 แก้ไขพิกัดปักหมุด" : "📍 เปิดแผนที่เพื่อปักหมุด"}
                    </button>
                  ) : (
                    <div className="mt-2 rounded-xl overflow-hidden border-2 border-green-600 shadow-lg relative flex flex-col h-[300px] animate-in fade-in zoom-in duration-300">
                      <div className="bg-[#0a4a2f] text-white text-xs text-center py-2 font-bold flex justify-between items-center px-4">
                        <span>📍 เลื่อนแผนที่ให้ตรงบ้าน</span>
                        <button type="button" onClick={() => setShowMap(false)} className="text-gray-300 hover:text-white px-2 py-1 rounded">✕ ปิด</button>
                      </div>
                      
                      <div className="relative flex-1 w-full bg-gray-100">
                        <div id="account-map" className="absolute inset-0 z-0"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-[10] pointer-events-none drop-shadow-xl pb-2">
                          <svg className="w-10 h-10 text-red-600 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        </div>
                        <button type="button" onClick={handleGetLocation} className="absolute bottom-4 right-4 z-[10] bg-white p-3 rounded-full shadow-xl border border-gray-200 text-blue-600 hover:bg-blue-50 transition flex items-center justify-center">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
                        </button>
                      </div>

                      <button type="button" onClick={() => { setShowMap(false); showToast("✅ ยืนยันพิกัดแล้ว กดปุ่ม 'บันทึกที่อยู่' สีเขียวเข้มด้านล่างด้วยนะครับ"); }} className="w-full bg-[#f3c623] hover:bg-yellow-500 text-[#0a4a2f] py-2.5 font-extrabold text-sm border-t-2 border-[#0a4a2f] transition">
                         ✅ ยืนยันพิกัดปักหมุด
                      </button>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={saving} className="w-full bg-[#0a4a2f] dark:bg-green-600 text-[#f3c623] dark:text-white py-3.5 rounded-xl font-bold hover:bg-[#073622] dark:hover:bg-green-700 transition shadow-md mt-2">
                  บันทึกที่อยู่
                </button>
              </form>
            </div>

            {/* ฝั่งขวา: ประวัติคำสั่งซื้อ */}
            <div className="lg:col-span-8 space-y-4">
               <h2 className="text-xl font-bold text-[#0a4a2f] dark:text-white flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z"></path></svg>
                ประวัติการสั่งซื้อ
              </h2>

              {orders.length === 0 ? (
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 text-center border border-dashed border-gray-300 dark:border-neutral-800 h-[300px] flex flex-col justify-center items-center shadow-sm transition-colors">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">ยังไม่มีประวัติการสั่งซื้อ</p>
                  <Link href="/" className="mt-4 bg-[#0a4a2f] dark:bg-green-600 text-[#f3c623] dark:text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#073622] dark:hover:bg-green-700 transition shadow-sm">
                    ไปเลือกซื้อสินค้ากันเลย
                  </Link>
                </div>
              ) : (
                orders.map((order, index) => (
                  <div key={index} className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden transition-colors">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-[#111]">
                      <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        วิสาหกิจบ้านป่าตึงงาม
                      </div>
                      <div className={`font-semibold text-sm px-3 py-1 rounded-full border ${
                        order.status === 'ยกเลิกแล้ว' ? 'bg-red-50 dark:bg-red-950/30 text-red-500 border-red-200 dark:border-red-900/50' : 
                        order.status === 'กำลังจัดส่ง' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:border-blue-950/50 border-blue-200' :
                        order.status === 'จัดส่งสำเร็จ' ? 'bg-green-50 dark:bg-green-950/30 text-green-600 border-green-200 dark:border-green-900/50' :
                        'bg-orange-50 dark:bg-orange-950/30 text-orange-500 border-orange-200 dark:border-orange-900/50'
                      }`}>
                        {order.status}
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex gap-4">
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gray-200 dark:border-neutral-800 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">{item.name}</h3>
                              <span className="font-semibold text-gray-800 dark:text-gray-300 shrink-0">฿{item.price}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.unit}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 text-right">x{item.qty}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-neutral-800 flex flex-col items-end gap-3 bg-gray-50/30 dark:bg-[#111]">
                      <div className="text-gray-800 dark:text-gray-200 font-medium">
                        ยอดรวม: <span className="text-xl font-bold text-[#ee4d2d]">฿{order.total_price}</span>
                      </div>
                      <div className="flex gap-2 sm:gap-3 mt-1 w-full sm:w-auto justify-end">
                        {order.status === 'รอดำเนินการ' && (
                          <button onClick={() => prepareCancelOrder(order.id)} className="px-4 py-2 bg-white dark:bg-black text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-neutral-700 font-bold rounded-[4px] hover:bg-gray-50 dark:hover:bg-neutral-800 transition shadow-sm text-sm">
                            ยกเลิกคำสั่งซื้อ
                          </button>
                        )}
                        <Link href="/" className="px-6 py-2 bg-[#ee4d2d] text-white font-bold rounded-[4px] hover:bg-[#d73f22] transition shadow-sm text-sm text-center">
                          สั่งซื้ออีกครั้ง
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
