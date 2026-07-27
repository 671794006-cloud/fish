"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  // --- ตัวอ้างอิงวิดีโอเพื่อแก้บั๊ก Autoplay ---
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((error) => {
        console.log("Autoplay stopped by browser:", error);
      });
    }
  }, []);

  // --- ระบบจัดการตะกร้าสินค้าและการสั่งซื้อ ---
  const [cartQty, setCartQty] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("qr");

  // ข้อมูลสินค้า
  const product = {
    name: "ปลาสวายแดดเดียว ตรา ๑ เดียว",
    vendor: "วิสาหกิจบ้านป่าตึงงาม หมู่ 18",
    price: 150,
    unit: "แพ็ค", 
    image: "/cover_648a8ae1db991.jpg", 
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

      {/* 2. Hero Section (วิดีโอพื้นหลังพร้อมสั่งให้ Play ผ่าน Ref) */}
      <div className="relative w-full h-[450px] flex flex-col items-center justify-center text-white overflow-hidden bg-black">
        
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
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

      {/* 3. สินค้าแนะนำ */}
      <div id="products" className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#0a4a2f]">สินค้าของชุมชน</h2>
            <p className="text-gray-500 mt-2">แปรรูปและหัตถกรรม ป่าตึงงาม</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="group bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-xl transition duration-300 relative">
            
            <div 
              onClick={addToCart}
              title="คลิกรูปภาพเพื่อเพิ่มลงตะกร้า"
              className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 mb-4 flex items-center justify-center cursor-pointer group-hover:ring-2 ring-green-500 ring-offset-2 transition"
            >
              <img 
                src={product.image} 
                alt="ปลาสวายแดดเดียว" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x500?text=Image+Not+Found";
                }}
              />
              <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
                พร้อมส่ง
              </div>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white text-[#0a4a2f] font-bold px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> เพิ่มสินค้า
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-2 px-1">
              <svg className="w-4 h-4 text-[#0a4a2f]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              <span className="text-xs font-medium text-[#0a4a2f] bg-green-50 px-2 py-0.5 rounded">{product.vendor}</span>
            </div>
            
            <h3 className="font-bold text-gray-900 text-xl px-1 group-hover:text-[#0a4a2f] transition mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500 px-1 line-clamp-2">เนื้อดี รสแซ่บ ที่หนึ่งเดียว แพ็คสุญญากาศอย่างดี</p>
            
            <div className="flex items-center justify-between mt-4 px-1 pt-4 border-t border-gray-100">
              <p className="text-orange-600 font-extrabold text-2xl">฿{product.price} <span className="text-sm text-gray-500 font-normal">/ {product.unit}</span></p>
              
              <button 
                onClick={addToCart}
                className="bg-[#0a4a2f] hover:bg-[#073622] text-[#f3c623] p-3 rounded-full transition shadow-md hover:scale-105 z-10 relative"
                title="เพิ่มลงตะกร้า"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal ตะกร้าสินค้า และ ชำระเงิน --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <div className="bg-[#0a4a2f] p-4 text-white flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#f3c623]">
                {showPayment ? "จัดส่งและชำระเงิน" : "ตะกร้าสินค้าของคุณ"}
              </h2>
              <button 
                onClick={() => { setIsCartOpen(false); setShowPayment(false); }}
                className="p-1 hover:bg-white/20 rounded-full transition text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6">
              {!showPayment ? (
                cartQty === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <p className="text-gray-500 text-lg">ยังไม่มีสินค้าในตะกร้า</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex gap-4 items-center">
                        <img src={product.image} alt="product" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <div className="pr-2">
                          <h3 className="font-bold text-[#0a4a2f] line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-orange-600 font-semibold mt-1">฿{product.price} / {product.unit}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm shrink-0">
                        <button onClick={() => setCartQty(cartQty - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full font-bold text-lg">-</button>
                        <span className="font-bold w-4 text-center">{cartQty}</span>
                        <button onClick={() => setCartQty(cartQty + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full font-bold text-lg">+</button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="font-bold text-gray-600">ยอดรวมทั้งสิ้น</span>
                      <span className="font-extrabold text-3xl text-orange-600">฿{totalPrice}</span>
                    </div>

                    <button 
                      onClick={() => setShowPayment(true)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-lg transition shadow-md flex justify-center items-center gap-2"
                    >
                      ดำเนินการชำระเงิน <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                  </div>
                )
              ) : (
                <div className="flex flex-col space-y-5">
                  <div className="w-full flex justify-between items-end border-b border-gray-100 pb-3">
                    <span className="text-gray-500">ยอดที่ต้องชำระ:</span>
                    <span className="font-extrabold text-orange-600 text-2xl">฿{totalPrice}</span>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      ที่อยู่สำหรับจัดส่ง
                    </label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full mt-2 p-3 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                      placeholder="กรอกชื่อ-นามสกุล, บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์ และเบอร์โทรศัพท์..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">เลือกวิธีชำระเงิน</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setPaymentMethod("qr")}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition ${paymentMethod === "qr" ? "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <span className="text-sm font-bold">โอนเงิน (QR)</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition ${paymentMethod === "cod" ? "bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span className="text-sm font-bold">เก็บเงินปลายทาง</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === "qr" ? (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center">
                      <div className="border-4 border-[#0a4a2f] p-2 rounded-xl bg-white shadow-sm mb-3">
                        <img
