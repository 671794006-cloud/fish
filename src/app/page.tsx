"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// เชื่อมต่อ Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [user, setUser] = useState<any>(null); // เก็บข้อมูลผู้ใช้ที่ล็อกอิน

  // --- สถานะระบบตะกร้า ---
  const [cart, setCart] = useState<Record<number, number>>({}); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");
  
  // ฟอร์มข้อมูลจัดส่ง
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("qr");

  // โหลดข้อมูลผู้ใช้เมื่อเปิดหน้าเว็บ
  useEffect(() => {
    // โหลดวิดีโอ
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    // เช็กการล็อกอินและดึงข้อมูลที่อยู่มาใส่ฟอร์มอัตโนมัติ
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const meta = session.user.user_metadata;
        if (meta) {
          if (meta.fullName) setFullName(meta.fullName);
          if (meta.phone) setPhone(meta.phone);
          if (meta.addressDetail) setAddressDetail(meta.addressDetail);
        }
      }
    };
    checkUser();

    // ติดตามสถานะหากมีการล็อกอิน/ล็อกเอาต์แบบเรียลไทม์
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  // --- ฐานข้อมูลสินค้า ---
  const products = [
    {
      id: 1,
      name: "ปลาสวายแดดเดียว ตรา ๑ เดียว",
      vendor: "วิสาหกิจบ้านป่าตึงงาม หมู่ 18",
      price: 150,
      unit: "แพ็ค (500 กรัม)", 
      image: "https://grilvqiyczvdkfumxxqy.supabase.co/storage/v1/object/public/fish/cover_648a8ae1db991.jpg",
      description: "ปลาสวายแดดเดียวเนื้อแน่น คัดสรรจากปลานิลและปลาสวายคุณภาพดี หมักด้วยสูตรโบราณตากแดดธรรมชาติในมุ้งอนามัย รสชาติกลมกล่อม ไม่เค็มจัด สะอาด ปลอดสารกันบูด",
      details: [
        { title: "น้ำหนักสุทธิ", value: "500 กรัม / แพ็คสุญญากาศ" },
        { title: "ส่วนประกอบ", value: "เนื้อปลา 98%, เกลือบริสุทธิ์ไอโอดีน 2%" },
        { title: "มาตรฐานรับรอง", value: "OTOP 5 ดาว / มผช. ชุมชนบ้านป่าตึงงาม" },
        { title: "จุดเด่น", value: "เนื้อฟู นุ่ม ไม่เค็มจัด ไร้กลิ่นคาว ปราศจากสารเคมีและสารกันบูด" },
      ],
      cookingSteps: [
        "ทอดด้วยน้ำมัน: ตั้งไฟปานกลาง ทอดประมาณ 3-5 นาที จนปลาเปลี่ยนเป็นสีเหลืองทองกรอบนอกนุ่มใน",
        "ทอดด้วยหม้อทอดไร้น้ำมัน (Air Fryer): ตั้งอุณหภูมิ 180°C เป็นเวลา 10-12 นาที (พลิกกลับด้านในนาทีที่ 6)"
      ],
      storage: "แช่เย็นปกติเก็บได้ 1-2 สัปดาห์ / แช่แข็ง (Freezer -18°C) เก็บรักษาคุณภาพได้นานถึง 3-6 เดือน"
    },
    {
      id: 2,
      name: "แหนมหมู วรรณภา เชียงราย",
      vendor: "กลุ่มแปรรูปอาหาร วรรณภา",
      price: 120, 
      unit: "แท่ง (250 กรัม)", 
      image: "/naem.jpg", 
      description: "แหนมหมูสูตรต้นตำรับเชียงราย รสชาติเปรี้ยวพอดี อร่อย สะอาด ถูกหลักอนามัย ทำจากเนื้อหมูคุณภาพดี หมักด้วยวิธีธรรมชาติ ปราศจากสารเร่งปฏิกิริยา",
      details: [
        { title: "น้ำหนักสุทธิ", value: "250 กรัม / แท่ง" },
        { title: "ส่วนประกอบ", value: "เนื้อหมู 80%, หนังหมู 10%, กระเทียมและเครื่องเทศ 10%" },
        { title: "มาตรฐานรับรอง", value: "ของดีประจำจังหวัดเชียงราย" },
        { title: "จุดเด่น", value: "เปรี้ยวธรรมชาติ เนื้อหมูแน่น ไม่ผสมแป้ง บรรจุในแพ็คเกจสะอาด" },
      ],
      cookingSteps: [
        "รับประทานสด: หั่นเป็นชิ้นพอดีคำ ทานแกล้มกับพริกขี้หนูสด กระเทียม ถั่วลิสงคั่ว และกะหล่ำปลี",
        "ประกอบอาหาร: นำไปทำยำแหนมแซ่บๆ, ข้าวผัดแหนม, หรือเจียวใส่ไข่ก็อร่อยกลมกล่อม"
      ],
      storage: "เก็บในตู้เย็นช่องธรรมดา (2-8°C) ได้นาน 1 เดือน หากชอบเปรี้ยวมากสามารถวางไว้อุณหภูมิห้อง 1-2 วันก่อนทาน"
    }
  ];

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => { setToastMessage(""); }, 2000);
  };

  const addToCartOnly = (productId: number) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    showToast("🛒 เพิ่มสินค้าลงตะกร้าแล้ว");
  };

  const buyNow = (productId: number) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    setIsCartOpen(true);
    setShowPayment(true); 
  };

  const updateQty = (productId: number, delta: number) => {
    setCart((prev) => {
      const newQty = (prev[productId] || 0) + delta;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => p.id === parseInt(id));
    return { ...product!, qty };
  });
  
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingFee = totalItemsCount > 0 ? 40 : 0;
  const grandTotal = subtotal > 0 ? subtotal + shippingFee : 0;

// --- ระบบส่งข้อมูลเข้า Google Sheets และ Supabase ---
  const handleConfirmOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !addressDetail.trim()) {
      alert("กรุณากรอกชื่อ-นามสกุล เบอร์โทรศัพท์ และที่อยู่จัดส่งให้ครบถ้วนครับ");
      return;
    }

    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อครับ");
      return;
    }

    // 🔴 ใส่ URL ของ Google Apps Script ตรงนี้นะครับ
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzZbB7Go7N6jg_8n1TEqzCOEuXYzFOkbSLUSEqfXu02XNSr6kx_PAuhQolZqMog6RzZ/exec";

    showToast("กำลังส่งคำสั่งซื้อของคุณ...");

    const orderListText = cartItems.map(item => `- ${item.name} x${item.qty}`).join('\n');
    const fullAddressText = `คุณ ${fullName} (${phone})\nที่อยู่: ${addressDetail}\n\nรายการสินค้า:\n${orderListText}`;
    const paymentTypeText = paymentMethod === "qr" ? "โอนเงิน / QR Code" : "เก็บเงินปลายทาง (COD)";

    try {
      // 1. บันทึกลง Supabase และขอข้อมูลกลับมาเพื่อเอา ID ของออเดอร์
      const { data: orderData, error: dbError } = await supabase.from('orders').insert({
        user_id: user.id,
        items: cartItems, 
        total_price: grandTotal,
        status: 'รอดำเนินการ'
      }).select(); // <-- เพิ่ม select() ตรงนี้

      if (dbError) throw dbError;
      
      const newOrderId = orderData[0].id; // ได้รหัสออเดอร์มาแล้ว!

      // 2. สั่งยิงข้อมูลไปที่ Google Sheets 
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",       // บอกชีตว่านี่คือการสั่งซื้อใหม่
          orderId: newOrderId,    // ส่งรหัสออเดอร์ไปด้วย
          customerName: fullName,
          phone: phone,
          address: addressDetail,
          orderItems: orderListText,
          totalPrice: grandTotal,
          paymentMethod: paymentTypeText
        }),
      });

      if (paymentMethod === "qr") {
        alert(`บันทึกคำสั่งซื้อสำเร็จ!\nทางร้านจะรีบตรวจสอบยอดโอนและจัดส่งสินค้าครับ\n\n${fullAddressText}`);
      } else {
        alert(`บันทึกคำสั่งซื้อแบบเก็บเงินปลายทางสำเร็จ!\nกรุณาเตรียมเงินสด ฿${grandTotal} ไว้ชำระกับพนักงานจัดส่งครับ\n\n${fullAddressText}`);
      }
      
      setCart({});
      setIsCartOpen(false);
      setShowPayment(false);

    } catch (error) {
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้งครับ");
      console.error(error);
    }
  };

    

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 font-sans relative">
      
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#0a4a2f] text-[#f3c623] px-6 py-3 rounded-full shadow-2xl z-[100] font-bold text-sm flex items-center gap-2 animate-bounce">
          {toastMessage}
        </div>
      )}

     {/* 1. Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-green-100 sticky top-0 z-40 shadow-sm">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-[#0a4a2f] hover:opacity-80 transition cursor-pointer">
          <div className="bg-[#0a4a2f] p-2 rounded-full border-2 border-[#f3c623] shadow-sm">
            <svg className="w-5 h-5 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          วิสาหกิจบ้านป่าตึงงาม
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input
            type="text"
            placeholder="ค้นหาสินค้า อาหาร ของใช้..."
            className="w-full py-2.5 pl-10 pr-4 bg-gray-50 border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0a4a2f]"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <button 
            onClick={() => { setIsCartOpen(true); setShowPayment(false); }}
            className="relative flex items-center gap-2 text-gray-600 hover:text-[#0a4a2f] transition p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            {totalItemsCount > 0 && (
              <span className="absolute 0 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {totalItemsCount}
              </span>
            )}
          </button>
          
          {/* ปุ่มล็อกอิน / บัญชีของฉัน */}
          {user ? (
            <Link href="/account" className="flex items-center gap-2 bg-green-50 text-[#0a4a2f] px-4 py-2 rounded-full border border-green-200 hover:bg-green-100 transition shadow-sm font-bold">
              <div className="w-7 h-7 bg-[#0a4a2f] text-white rounded-full flex items-center justify-center text-sm uppercase">
                {user.email?.charAt(0) || "U"}
              </div>
              <span className="hidden sm:inline">บัญชีของฉัน</span>
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-[#0a4a2f] text-[#f3c623] px-5 py-2.5 rounded-full hover:bg-[#073622] transition shadow-sm">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </nav>

      {/* 2. Hero Section */}
      <div className="relative w-full h-[450px] flex flex-col items-center justify-center text-white overflow-hidden bg-[#0a4a2f]">
        <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://grilvqiyczvdkfumxxqy.supabase.co/storage/v1/object/public/fish/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="z-10 text-center space-y-6 max-w-3xl px-4 flex flex-col items-center">
          <div className="bg-black/50 text-[#f3c623] px-6 py-2.5 rounded-full text-sm inline-flex items-center gap-2 backdrop-blur-md border border-[#f3c623]/50 font-bold shadow-xl">
            ⭐ OTOP 5 ดาว วิสาหกิจชุมชน
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white tracking-wide" style={{ textShadow: "0px 4px 15px rgba(0, 0, 0, 0.9), 0px 2px 5px rgba(0, 0, 0, 0.7)" }}>
            วิสาหกิจบ้านป่าตึงงาม<br/>หมู่ 18
          </h1>
        </div>
      </div>

      {/* 3. ส่วนแสดงรายการสินค้าทั้งหมด */}
      <div id="products" className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#0a4a2f]">สินค้าแนะนำของชุมชน</h2>
            <p className="text-gray-500 mt-2">แปรรูปอาหารและหัตถกรรม สด สะอาด ปลอดภัย</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                <div className="sm:col-span-5 relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer" onClick={() => setSelectedProduct(item)}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1626804475297-41609ea2b5eb?q=80&w=800&auto=format&fit=crop"; }} />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="bg-white/90 text-[#0a4a2f] px-4 py-2 rounded-full font-bold text-xs shadow-lg">🔍 ดูรายละเอียด</span>
                  </div>
                </div>

                <div className="sm:col-span-7 flex flex-col justify-between h-full space-y-4">
                  <div className="cursor-pointer" onClick={() => setSelectedProduct(item)}>
                    <span className="inline-block text-xs font-bold text-[#0a4a2f] bg-green-50 px-3 py-1 rounded-full border border-green-200 mb-2">{item.vendor}</span>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 line-clamp-2 hover:text-[#0a4a2f] transition">{item.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3">{item.description}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500 block mb-1">ราคาจำหน่าย</span>
                    <p className="text-orange-600 font-extrabold text-2xl mb-3">
                      ฿{item.price} <span className="text-sm font-normal text-gray-500">/ {item.unit}</span>
                    </p>
                    
                    <div className="flex gap-2">
                      <button onClick={() => addToCartOnly(item.id)} className="flex-1 border-2 border-[#0a4a2f] text-[#0a4a2f] hover:bg-green-50 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-1.5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        ใส่ตะกร้า
                      </button>
                      <button onClick={() => buyNow(item.id)} className="flex-1 bg-[#0a4a2f] hover:bg-[#073622] text-[#f3c623] py-2.5 rounded-xl font-bold text-sm transition shadow-md flex items-center justify-center gap-1.5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        สั่งซื้อเลย
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Modal ป๊อปอัปรายละเอียดสินค้าเพิ่มเติม --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="bg-[#0a4a2f] p-5 text-white flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#f3c623]">รายละเอียดสินค้า</h2>
              <button onClick={() => setSelectedProduct(null)} className="p-1 hover:bg-white/20 rounded-full transition text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img src={selectedProduct.image} className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm" alt={selectedProduct.name} />
                <div>
                  <h3 className="font-bold text-xl text-[#0a4a2f] mb-1">{selectedProduct.name}</h3>
                  <span className="text-xs font-bold text-[#0a4a2f] bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-block mb-2">{selectedProduct.vendor}</span>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedProduct.description}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <h4 className="font-bold text-[#0a4a2f] text-sm mb-3">ข้อมูลจำเพาะ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {selectedProduct.details.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100">
                      <span className="text-gray-400 block text-xs">{item.title}</span>
                      <span className="font-semibold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 text-sm mb-2">🍳 วิธีการรับประทาน</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-amber-800">
                    {selectedProduct.cookingSteps.map((step: string, idx: number) => (<li key={idx} className="leading-relaxed">{step}</li>))}
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                  <h4 className="font-bold text-blue-900 text-sm mb-2">❄️ วิธีการเก็บรักษา</h4>
                  <p className="text-xs text-blue-800 leading-relaxed">{selectedProduct.storage}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                <button onClick={() => { addToCartOnly(selectedProduct.id); setSelectedProduct(null); }} className="px-6 py-3 rounded-xl border-2 border-[#0a4a2f] text-[#0a4a2f] font-bold hover:bg-green-50 text-sm flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  ใส่ตะกร้า
                </button>
                <button onClick={() => { buyNow(selectedProduct.id); setSelectedProduct(null); }} className="px-6 py-3 rounded-xl bg-[#0a4a2f] text-[#f3c623] font-bold hover:bg-[#073622] text-sm flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  สั่งซื้อเลย
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal ตะกร้าสินค้า และ หน้าจัดส่ง/ชำระเงิน --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="bg-[#0a4a2f] p-4 px-6 text-white flex justify-between items-center sticky top-0 z-20">
              <h2 className="text-xl font-bold text-[#f3c623] flex items-center gap-2">
                {showPayment ? "📦 จัดส่งและชำระเงิน" : "🛒 ตะกร้าสินค้าของคุณ"}
              </h2>
              <button onClick={() => { setIsCartOpen(false); setShowPayment(false); }} className="p-1.5 hover:bg-white/20 rounded-full transition text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6">
              {!showPayment ? (
                totalItemsCount === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <p className="text-gray-500 text-lg">ยังไม่มีสินค้าในตะกร้า</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                          <div className="flex gap-3 items-center w-full">
                            <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-gray-200 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-[#0a4a2f] text-sm truncate">{item.name}</h3>
                              <p className="text-xs text-orange-600 font-semibold mt-0.5">฿{item.price} / {item.unit}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm shrink-0 ml-2">
                            <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full font-bold">-</button>
                            <span className="font-bold w-4 text-center text-sm">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full font-bold">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-sm mt-4">
                      <div className="flex justify-between text-gray-600">
                        <span>ราคาสินค้ารวม ({totalItemsCount} ชิ้น)</span>
                        <span>฿{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>ค่าจัดส่ง (เหมาจ่าย)</span>
                        <span>฿{shippingFee}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-base font-extrabold text-[#0a4a2f]">
                        <span>ยอดรวมสุทธิ</span>
                        <span className="text-2xl text-orange-600">฿{grandTotal}</span>
                      </div>
                    </div>

                    <button onClick={() => setShowPayment(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-bold text-lg transition shadow-md flex justify-center items-center gap-2">
                      ดำเนินการจัดส่งและชำระเงิน <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  
                  <div className="bg-green-50/70 p-4 rounded-2xl border border-green-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-green-200 pb-2">
                      <span className="font-bold text-[#0a4a2f] text-sm flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z"></path></svg>
                        รายการสินค้าที่สั่งซื้อ
                      </span>
                      <span className="text-xs font-bold text-green-700 bg-white px-2.5 py-0.5 rounded-full border border-green-200">
                        {totalItemsCount} ชิ้น
                      </span>
                    </div>

                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center bg-white p-2 rounded-xl border border-green-100 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#0a4a2f] text-xs truncate">{item.name}</h4>
                            <div className="flex justify-between items-center mt-0.5">
                              <span className="text-[10px] text-gray-500 font-medium">฿{item.price} x {item.qty}</span>
                              <span className="font-extrabold text-orange-600 text-xs">฿{item.price * item.qty}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 text-xs text-gray-600 pt-2 border-t border-green-200/50">
                      <div className="flex justify-between">
                        <span>ราคาสินค้ารวม:</span>
                        <span className="font-semibold text-gray-800">฿{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ค่าบริการจัดส่ง:</span>
                        <span className="font-semibold text-gray-800">฿{shippingFee}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 mt-1 border-t border-green-200 text-sm font-extrabold text-[#0a4a2f]">
                        <span>ยอดชำระสุทธิ:</span>
                        <span className="text-xl text-orange-600">฿{grandTotal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      ระบุข้อมูลผู้รับสินค้า
                      {!user && <span className="text-[10px] font-normal text-red-500 ml-auto">ไม่ได้เข้าสู่ระบบ</span>}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="ชื่อ-นามสกุล ผู้รับ *"
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
                      />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="เบอร์โทรศัพท์ *"
                        className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
                      />
                    </div>

                    <textarea 
                      value={addressDetail}
                      onChange={(e) => setAddressDetail(e.target.value)}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-600 bg-gray-50"
                      placeholder="ที่อยู่จัดส่ง (บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์) *"
                    />
                    {user && (
                      <p className="text-xs text-gray-500 text-right">💡 ดึงข้อมูลที่อยู่มาจากบัญชีของคุณอัตโนมัติ</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      วิธีชำระเงิน
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setPaymentMethod("qr")} className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${paymentMethod === "qr" ? "bg-green-50 border-green-600 text-[#0a4a2f] ring-2 ring-green-600/30" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <span className="text-xs font-bold">โอนเงิน / QR Code</span>
                      </button>

                      <button onClick={() => setPaymentMethod("cod")} className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${paymentMethod === "cod" ? "bg-orange-50 border-orange-500 text-orange-800 ring-2 ring-orange-500/30" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span className="text-xs font-bold">เก็บเงินปลายทาง</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === "qr" ? (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col items-center space-y-3">
                      <div className="bg-white p-3 rounded-2xl border-2 border-[#0a4a2f] shadow-sm text-center">
                        <img src="/7cf48c5c-2375-46e8-8a30-04b7ccef97f5.jpg" alt="Thai QR Payment" className="w-48 h-auto object-contain mx-auto rounded-lg mb-2" />
                        <p className="text-xs text-gray-500">สแกน QR PromptPay เพื่อโอนเงิน</p>
                      </div>
                      <div className="w-full bg-white p-3 rounded-xl border border-gray-200 text-center text-xs space-y-1">
                        <p className="text-gray-500">ชื่อบัญชี: <span className="font-bold text-[#0a4a2f]">นาย พงศ์พิชิต ทาบุญสม</span></p>
                        <p className="text-gray-500">ยอดที่ต้องโอน: <span className="font-extrabold text-orange-600 text-base">฿{grandTotal}</span></p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200 text-center space-y-2">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                      </div>
                      <p className="font-bold text-orange-900 text-sm">บริการเก็บเงินปลายทาง</p>
                      <p className="text-xs text-orange-700">เตรียมเงินสด <span className="font-bold text-orange-900 text-sm">฿{grandTotal}</span> ไว้ชำระกับพนักงานจัดส่งเมื่อสินค้าถึงมือคุณ</p>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <button onClick={handleConfirmOrder} className="w-full bg-[#0a4a2f] hover:bg-[#073622] text-[#f3c623] py-3.5 rounded-2xl font-bold text-lg transition shadow-md flex justify-center items-center gap-2">
                      {paymentMethod === "qr" ? "ยืนยันการโอนเงิน / แจ้งชำระเงิน" : "ยืนยันการสั่งซื้อปลายทาง"}
                    </button>
                    <button onClick={() => setShowPayment(false)} className="w-full text-center text-xs text-gray-500 hover:text-gray-800 py-2 block">
                      ← ย้อนกลับไปแก้ไขตะกร้าสินค้า
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* --- ส่วน Footer (เครดิตล่างสุด) --- */}
      <footer className="bg-[#0a4a2f] border-t-4 border-[#f3c623] text-white py-10 mt-16 w-full relative z-40">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          
          <div className="space-y-1">
           <p className="font-bold flex items-center justify-center gap-1 text-lg text-[#f3c623]">  
              วิสาหกิจบ้านป่าตึงงาม หมู่ 18
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
            </p>
            <p className="text-sm text-gray-300">ตำบลป่า อำเภอแ่ปลื้ม</p>
            <p className="text-sm text-gray-300">จังหวัดเชียงราย 57100</p>
          </div>

          <div className="flex items-center justify-center gap-2 font-extrabold text-xl pt-3 pb-1">
            <svg className="w-5 h-5 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            Tel : 063-405-2812
          </div>

          <div className="pt-2 flex justify-center">
            {/* สามารถใส่ลิงก์ Facebook ร้าน ตรง href="#" แทนเครื่องหมาย # ได้เลยครับ */}
            <a href="https://www.facebook.com/pongpichit.tarboonsom" target="_blank" rel="noreferrer" className="bg-[#f3c623] text-[#0a4a2f] w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition shadow-md">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
            </a>
          </div>

        </div>
      </footer>
    </div>
  );
}
