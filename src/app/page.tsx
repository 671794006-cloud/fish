"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  // --- ระบบจัดการตะกร้าสินค้า ---
  const [cartQty, setCartQty] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // ข้อมูลสินค้า (ขายแค่ปลาแดดเดียวตามที่รีเควส)
  const product = {
    name: "ปลาแดดเดียว วิสาหกิจบ้านป่าตึงงาม",
    desc: "จากปลานิลสด สะอาด ปลอดภัย แปรรูปด้วยภูมิปัญญาชุมชน หมู่ 18",
    price: 150,
    unit: "กก.",
    image: "https://images.unsplash.com/photo-1626804475297-41609ea2b5eb?q=80&w=800&auto=format&fit=crop", // สามารถเปลี่ยนเป็นรูปปลาจริงๆ ของร้านได้
  };

  const addToCart = () => {
    setCartQty((prev) => prev + 1);
    setIsCartOpen(true); // เพิ่มปุ๊บ เปิดหน้าต่างตะกร้าให้ดูเลย
  };

  const totalPrice = cartQty * product.price;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 font-sans">
      {/* 1. Navbar (ธีมสีเขียว-ทอง) */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#0a4a2f] text-white sticky top-0 z-40 shadow-md">
        {/* Logo ใหม่ */}
        <div className="flex items-center gap-3 font-bold text-xl text-[#f3c623]">
          <div className="bg-white/20 p-2 rounded-full border border-[#f3c623]">
            <svg className="w-6 h-6 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          บ้านป่าตึงงาม
        </div>

        {/* เมนูขวา & ปุ่มตะกร้า */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {/* ปุ่มรถเข็น (กดได้จริง) */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 hover:text-[#f3c623] transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            {cartQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartQty}
              </span>
            )}
          </button>
          <Link href="/login" className="hidden md:flex items-center gap-2 bg-[#f3c623] text-[#0a4a2f] px-5 py-2.5 rounded-full hover:bg-yellow-400 transition font-bold shadow-sm">
            เข้าสู่ระบบ
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section & สินค้าหลัก */}
      <div className="max-w-5xl mx-auto px-6 mt-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          {/* รูปสินค้า */}
          <div className="w-full md:w-1/2 bg-gray-200 relative h-[400px]">
            <img 
              src={product.image} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* ป้าย OTOP (จำลอง) */}
            <div className="absolute top-4 left-4 bg-[#0a4a2f] text-[#f3c623] px-4 py-2 rounded-full font-bold shadow-lg text-sm border border-[#f3c623]">
              OTOP 5 ดาว
            </div>
          </div>
          
          {/* ข้อมูลสินค้าและการสั่งซื้อ */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0a4a2f] mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              {product.desc}
            </p>
            
            <div className="flex items-end gap-3 mb-8 pb-8 border-b border-gray-100">
              <span className="text-5xl font-extrabold text-orange-600">฿{product.price}</span>
              <span className="text-gray-500 mb-1">/ {product.unit}</span>
            </div>

            <button 
              onClick={addToCart}
              className="w-full bg-[#0a4a2f] hover:bg-[#073622] text-[#f3c623] py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition shadow-lg shadow-green-900/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              เพิ่มลงตะกร้า
            </button>
            <p className="text-center text-sm text-gray-400 mt-4">มีบริการจัดส่งทั่วประเทศ</p>
          </div>
        </div>
      </div>

      {/* --- Modal ตะกร้าสินค้า และ ชำระเงิน --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            
            {/* Header ป๊อปอัป */}
            <div className="bg-[#0a4a2f] p-4 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#f3c623]">
                {showPayment ? "ชำระเงิน (QR Code)" : "ตะกร้าสินค้าของคุณ"}
              </h2>
              <button 
                onClick={() => { setIsCartOpen(false); setShowPayment(false); }}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* เนื้อหาในป๊อปอัป */}
            <div className="p-6">
              {!showPayment ? (
                /* --- หน้ารายการสินค้าในตะกร้า --- */
                cartQty === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    ยังไม่มีสินค้าในตะกร้า
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <h3 className="font-bold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-500">฿{product.price} / {product.unit}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-2 py-1">
                        <button onClick={() => setCartQty(cartQty - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full font-bold">-</button>
                        <span className="font-bold w-4 text-center">{cartQty}</span>
                        <button onClick={() => setCartQty(cartQty + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full font-bold">+</button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="font-bold text-gray-600">ยอดรวมทั้งสิ้น</span>
                      <span className="font-extrabold text-2xl text-orange-600">฿{totalPrice}</span>
                    </div>

                    <button 
                      onClick={() => setShowPayment(true)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-lg transition shadow-md"
                    >
                      ดำเนินการชำระเงิน
                    </button>
                  </div>
                )
              ) : (
                /* --- หน้าชำระเงิน QR Code --- */
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full flex justify-between text-sm mb-2">
                    <span className="text-gray-500">ยอดที่ต้องชำระ:</span>
                    <span className="font-bold text-orange-600 text-lg">฿{totalPrice}</span>
                  </div>
                  
                  {/* รูป QR Code จากที่ผู้ใช้แนบมา */}
                  <div className="border-4 border-[#0a4a2f] p-2 rounded-xl bg-white">
                    {/* ตรงนี้จะดึงรูปจากโฟลเดอร์ public/ */}
                    <img 
                      src="/7cf48c5c-2375-46e8-8a30-04b7ccef97f5.jpg" 
                      alt="Thai QR Payment" 
                      className="w-64 h-auto object-contain"
                    />
                  </div>

                  <div className="text-center space-y-1 w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500">สแกน QR เพื่อโอนเข้าบัญชี</p>
                    <p className="font-bold text-[#0a4a2f]">ชื่อ: นาย พงศ์พิชิต ทาบุญสม</p>
                  </div>

                  <button 
                    onClick={() => {
                      alert("แจ้งสลิปสำเร็จ! รอการตรวจสอบจากทางร้านครับ");
                      setCartQty(0);
                      setIsCartOpen(false);
                      setShowPayment(false);
                    }}
                    className="w-full bg-[#0a4a2f] hover:bg-[#073622] text-[#f3c623] py-3.5 rounded-xl font-bold text-lg transition shadow-md mt-4"
                  >
                    แนบสลิป / แจ้งชำระเงิน
                  </button>
                  
                  <button 
                    onClick={() => setShowPayment(false)}
                    className="text-sm text-gray-500 hover:text-gray-800 underline"
                  >
                    ย้อนกลับไปตะกร้า
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
