import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        {/* Logo */}
        <div className="flex items-center gap-2 text-green-700 font-bold text-xl">
          <div className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-lg">
            O
          </div>
          O-TOPLocal
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input
            type="text"
            placeholder="ค้นหาสินค้า อาหาร ของใช้..."
            className="w-full py-2.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        {/* Menus & Login */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <button className="flex items-center gap-2 hover:text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            จัดการสินค้า
          </button>
          <button className="flex items-center gap-2 hover:text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </button>
          <Link href="/login" className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-full hover:bg-green-100 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            สมาชิกชุมชน
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative w-full h-[550px] bg-cover bg-center flex flex-col items-center justify-center text-white" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?q=80&w=2070&auto=format&fit=crop')" }} // เปลี่ยนรูปพื้นหลังตรงนี้ได้
      >
        <div className="absolute inset-0 bg-black/60"></div> {/* เงาดำทับรูป */}
        
        <div className="z-10 text-center space-y-6 max-w-3xl px-4 flex flex-col items-center">
          <div className="bg-green-800/80 text-green-100 px-4 py-1.5 rounded-full text-sm inline-flex items-center gap-2 backdrop-blur-sm">
            ⭐ สินค้าคุณภาพจากมือชุมชน สู่มือคุณ
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            อุดหนุนสินค้าท้องถิ่น<br/>สร้างรายได้ยั่งยืนสู่ชุมชน
          </h1>
          
          <p className="text-gray-200 text-lg md:text-xl">
            เลือกซื้อของดี ของอร่อย งานคราฟต์ทำมือ จากชาวบ้านโดยตรง มั่นใจได้ในคุณภาพ<br/>พร้อมเรื่องราวในทุกชิ้นงาน
          </p>
          
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-semibold mt-4 flex items-center gap-2 transition text-lg">
            ช้อปเลยตอนนี้ <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
