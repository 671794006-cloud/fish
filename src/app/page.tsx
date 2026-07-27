"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((error) => {
        console.log("Autoplay issue:", error);
      });
    }
  }, []);

  // --- สถานะตะกร้าสินค้าและการสั่งซื้อ ---
  const [cartQty, setCartQty] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false); // ป๊อปอัปรายละเอียดสินค้า
  
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("qr");

  // ข้อมูลสินค้าปลาแดดเดียว
  const product = {
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
  };

  const addToCart = () => {
    setCartQty((prev) => prev + 1);
    setIsCartOpen(true);
  };

  const totalPrice = cartQty * product.price;

  const handleConfirmOrder = () => {
    if (!address.trim()) {
      alert("กรุณากรอกข้อมูลที่อยู่และเบอร์โทรศัพท์สำหรับจัดส่งด้วยครับ");
      return;
    }

    if (paymentMethod === "qr") {
      alert("ส่งหลักฐานสำเร็จ! ทางร้านจะรีบตรวจสอบยอดเงินและจัดส่งสินค้าครับ\nจัดส่งไปที่: " + address);
    } else {
      alert("สั่งซื้อสำเร็จ! กรุณาเตรียมเงินสดชำระกับพนักงานส่งของครับ\nจัดส่งไปที่: " + address);
    }
    
    setCartQty(0);
    setAddress("");
    setIsCartOpen(false);
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 font-sans">
      
      {/* 1. Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-green-100 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 font-bold text-xl text-[#0a4a2f]">
          <div className="bg-[#0a4a2f] p-2 rounded-full border-2 border-[#f3c623]">
            <svg className="w-5 h-5 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          วิสาหกิจบ้านป่าตึงงาม
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input
            type="text"
            placeholder="ค้นหาสินค้า อาหาร ของใช้..."
            className="w-full py-2.5 pl-10 pr-4 bg-gray-50 border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0a4a2f]"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 text-gray-600 hover:text-[#0a4a2f] transition p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            {cartQty > 0 && (
              <span className="absolute 0 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {cartQty}
              </span>
            )}
          </button>
          
          <Link href="/login" className="hidden md:flex items-center gap-2 bg-[#0a4a2f] text-[#f3c623] px-5 py-2.5 rounded-full hover:bg-[#073622] transition shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            เข้าสู่ระบบ
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section (วิดีโอพื้นหลัง) */}
      <div className="relative w-full h-[450px] flex flex-col items-center justify-center text-white overflow-hidden bg-[#0a4a2f]">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://grilvqiyczvdkfumxxqy.supabase.co/storage/v1/object/public/fish/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="z-10 text-center space-y-6 max-w-3xl px-4 flex flex-col items-center">
          <div className="bg-black/50 text-[#f3c623] px-6 py-2.5 rounded-full text-sm inline-flex items-center gap-2 backdrop-blur-md border border-[#f3c623]/50 font-bold shadow-xl">
            ⭐ OTOP 5 ดาว วิสาหกิจชุมชน
          </div>
          <h1 
            className="text-5xl md:text-7xl font-extrabold leading-tight text-white tracking-wide"
            style={{ textShadow: "0px 4px 15px rgba(0, 0, 0, 0.9), 0px 2px 5px rgba(0, 0, 0, 0.7)" }}
          >
            วิสาหกิจบ้านป่าตึงงาม<br/>หมู่ 18
          </h1>
        </div>
      </div>

      {/* 3. ส่วนแสดงสินค้าและรายละเอียด */}
      <div id="products" className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#0a4a2f]">สินค้าแนะนำของชุมชน</h2>
            <p className="text-gray-500 mt-2">แปรรูปปลาแดดเดียว สด สะอาด ปลอดภัย</p>
          </div>
        </div>

        {
