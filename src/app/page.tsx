"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  // --- ระบบจัดการตะกร้าสินค้า ---
  const [cartQty, setCartQty] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // ข้อมูลสินค้า (ขายแค่ปลาแดดเดียว)
  const product = {
    name: "ปลาแดดเดียว สูตรวิสาหกิจบ้านป่าตึงงาม",
    vendor: "วิสาหกิจบ้านป่าตึงงาม หมู่ 18",
    price: 150,
    unit: "กก.",
    image: "https://images.unsplash.com/photo-1626804475297-41609ea2b5eb?q=80&w=800&auto=format&fit=crop",
  };

  const addToCart = () => {
    setCartQty((prev) => prev + 1);
    setIsCartOpen(true);
  };

  const totalPrice = cartQty * product.price;

  return (
    <div className="min-h-screen bg-white text-gray-800 pb-20 font-sans">
      
      {/* 1. Navbar (ธีมสีเขียว-ทอง) */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-green-100 sticky top-0 z-40 shadow-sm">
        {/* Logo วิสาหกิจชุมชน */}
        <div className="flex items-center gap-3 font-bold text-xl text-[#0a4a2f]">
          <div className="bg-[#0a4a2f] p-2 rounded-full border-2 border-[#f3c623]">
            <svg className="w-5 h-5 text-[#f3c623]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          วิสาหกิจบ้านป่าตึงงาม
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input
            type="text"
            placeholder="ค้นหาสินค้า อาหาร ของใช้..."
            className="w-full py-2.5 pl-10 pr-4 bg-gray-50 border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0a4a2f]"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        {/* เมนูขวา & ปุ่มตะกร้า */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {/* ปุ่มรถเข็น */}
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

      {/* 2. Hero Section (รูปแบนเนอร์ใหญ่) */}
      <div className="relative w-full h-[500px] flex flex-col items-center justify-center text-white bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1505934333218-8fe31602e971?q=80&w=2000&auto=format&fit=crop" 
          alt="Community Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        
        <div className="z-10 text-center space-y-6 max-w-3xl px-4 mt-8 flex flex-col items-center">
          <div className="bg-[#0a4a2f]/90 text-[#f3c623] px-5 py-2 rounded-full text-sm inline-flex items-center gap-2 backdrop-blur-sm border border-[#f3c623]/50 font-bold shadow-lg">
            ⭐ OTOP 5 ดาว วิสาหกิจชุมชน
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg text-white">
            วิสาหกิจบ้านป่าตึงงาม<br/>หมู่ 18
          </h1>
          
          <p className="text-gray-100 text-lg md:text-xl drop-shadow-md">
            ปลาแดดเดียว จากปลานิลสด สะอาด ปลอดภัย <br className="hidden md:block"/>แปรรูปด้วยภูมิปัญญาชุมชน สนับสนุนสินค้าท้องถิ่นสร้างรายได้ยั่งยืน
          </p>
          
          <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-semibold mt-4 flex items-center gap-2 transition text-lg shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5">
            เลือกซื้อสินค้า <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>
      </div>

      {/* 3. สินค้าแนะนำ (เหลือสินค้าชิ้นเดียวตามสั่ง) */}
      <div id="products" className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#0a4a2f]">สินค้าของชุมชน</h2>
            <p className="text-gray-500 mt-2">แปรรูปและหัตถกรรม ป่าตึงงาม</p>
          </div>
        </div>

        {/* ตะแกรงสินค้า (โชว์แค่ปลาแดดเดียว) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* การ์ดสินค้า ปลาแดดเดียว */}
          <div className="group bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-xl transition duration-300">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-4">
              <img src={product.image} alt="ปลาแดดเดียว" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                พร้อมส่ง
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <svg className="w-4 h-4 text-[#0a4a2f]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              <span className="text-xs font-medium text-[#0a4a2f] bg-green-50 px-2 py-0.5 rounded">{product.vendor}</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-lg px-1 group-hover:text-[#0a4a2f] transition">{product.name}</h3>
            
            <div className="flex items-center justify-between mt-4 px-1 pb-1">
              <p className="text-orange-600 font-bold text-2xl">฿{product.price} <span className="text-sm text-gray-500 font-normal">/ {product.unit}</span></p>
              
              {/* ปุ่มเพิ่มลงตะกร้า (ทำงานได้จริง) */}
              <button 
                onClick={addToCart}
                className="bg-[#0a4a2f] hover:bg-[#073622] text-[#f3c623] p-2.5 rounded-full transition shadow-md"
                title="เพิ่มลงตะกร้า"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </button>
            </div>
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
                className="p-1 hover:bg-white/20 rounded-full transition text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* เนื้อหาในป๊อปอัป */}
            <div className="p-6">
              {!showPayment ? (
                /* --- หน้ารายการสินค้าในตะกร้า --- */
                cartQty === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <p className="text-gray-500 text-lg">ยังไม่มีสินค้าในตะกร้า</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="pr-2">
                        <h3 className="font-bold text-[#0a4a2f] line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-orange-600 font-semibold mt-1">฿{product.price} / {product.unit}</p>
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
                      ชำระเงิน <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                  </div>
                )
              ) : (
                /* --- หน้าชำระเงิน QR Code --- */
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-full flex justify-between items-end border-b border-gray-100 pb-3">
                    <span className="text-gray-500">ยอดที่ต้องชำระ:</span>
                    <span className="font-extrabold text-orange-600 text-2xl">฿{totalPrice}</span>
                  </div>
                  
                  {/* รูป QR Code จากที่คุณส่งมา */}
                  <div className="border-4 border-[#0a4a2f] p-2 rounded-2xl bg-white shadow-lg relative">
                    {/* ตรงนี้จะดึงรูปจากโฟลเดอร์ public/ */}
                    <img 
                      src="/7cf48c5c-2375-46e8-8a30-04b7ccef97f5.jpg" 
                      alt="Thai QR Payment" 
                      className="w-64 h-auto object-contain rounded-xl"
                    />
                  </div>

                  <div className="text-center space-y-1 w-full bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-sm text-green-700">สแกน QR เพื่อโอนเข้าบัญชี</p>
                    <p className="font-bold text-[#0a4a2f] text-lg">นาย พงศ์พิชิต ทาบุญสม</p>
                  </div>

                  <button 
                    onClick={() => {
                      alert("ส่งหลักฐานสำเร็จ! ทางร้านจะรีบตรวจสอบยอดเงินและจัดส่งสินค้าครับ");
                      setCartQty(0);
                      setIsCartOpen(false);
                      setShowPayment(false);
                    }}
                    className="w-full bg-[#0a4a2f] hover:bg-[#073622] text-[#f3c623] py-3.5 rounded-xl font-bold text-lg transition shadow-md mt-2 flex justify-center items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    แจ้งชำระเงิน / แนบสลิป
                  </button>
                  
                  <button 
                    onClick={() => setShowPayment(false)}
                    className="text-sm text-gray-500 hover:text-gray-800 underline mt-2"
                  >
                    ย้อนกลับไปแก้ไขตะกร้า
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
