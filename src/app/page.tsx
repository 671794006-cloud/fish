import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 pb-20">
      {/* 1. Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
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
        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <button className="hidden md:flex items-center gap-2 hover:text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            จัดการสินค้า
          </button>
          <button className="flex items-center gap-2 hover:text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </button>
          <Link href="/login" className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-full hover:bg-green-100 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            สมาชิกชุมชน
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <div className="relative w-full h-[500px] flex flex-col items-center justify-center text-white bg-gray-800">
        {/* ใส่รูปภาพพื้นหลังตรงนี้ */}
        <img 
          src="https://images.unsplash.com/photo-1505934333218-8fe31602e971?q=80&w=2000&auto=format&fit=crop" 
          alt="Community Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        
        <div className="z-10 text-center space-y-6 max-w-3xl px-4 mt-8 flex flex-col items-center">
          <div className="bg-green-800/80 text-green-100 px-4 py-1.5 rounded-full text-sm inline-flex items-center gap-2 backdrop-blur-sm border border-green-700/50">
            ⭐ สินค้าคุณภาพจากมือชุมชน สู่มือคุณ
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
            อุดหนุนสินค้าท้องถิ่น<br/>สร้างรายได้ยั่งยืนสู่ชุมชน
          </h1>
          
          <p className="text-gray-100 text-lg md:text-xl drop-shadow-md">
            เลือกซื้อของดี ของอร่อย งานคราฟต์ทำมือ จากชาวบ้านโดยตรง มั่นใจได้ในคุณภาพ<br className="hidden md:block"/>พร้อมเรื่องราวในทุกชิ้นงาน
          </p>
          
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-semibold mt-4 flex items-center gap-2 transition text-lg shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5">
            ช้อปเลยตอนนี้ <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

      {/* 3. สินค้าแนะนำ (ส่วนที่เพิ่มใหม่) */}
      <div className="max-w-7xl mx-auto px-6 mt-16">
        {/* หัวข้อและหมวดหมู่ */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">สินค้าแนะนำ</h2>
            <p className="text-gray-500 mt-2">อัปเดตใหม่ล่าสุดจากชาวบ้าน</p>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            <button className="px-5 py-2 bg-gray-900 text-white rounded-full text-sm whitespace-nowrap">ทั้งหมด</button>
            <button className="px-5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-sm font-medium whitespace-nowrap transition">อาหาร</button>
            <button className="px-5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-sm font-medium whitespace-nowrap transition">ของใช้</button>
            <button className="px-5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-sm font-medium whitespace-nowrap transition">งานคราฟต์</button>
          </div>
        </div>

        {/* ตะแกรงสินค้า (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* สินค้าชิ้นที่ 1 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img src="https://images.unsplash.com/photo-1626804475297-41609ea2b5eb?q=80&w=800&auto=format&fit=crop" alt="ปลาแดดเดียว" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">กลุ่มแม่บ้านริมน้ำ</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-green-600 transition">ปลาแดดเดียว สูตรลับชุมชน</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-orange-500 font-bold text-xl">฿150 <span className="text-sm text-gray-500 font-normal">/ กก.</span></p>
              <button className="bg-gray-100 hover:bg-green-600 hover:text-white p-2 rounded-full transition text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </button>
            </div>
          </div>

          {/* สินค้าชิ้นที่ 2 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img src="https://images.unsplash.com/photo-1603569283847-aa295f0d016a?q=80&w=800&auto=format&fit=crop" alt="กระเป๋าสาน" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">วิสาหกิจชุมชนทอผ้า</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-green-600 transition">กระเป๋าสานกระจูด แต่งหนัง</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-orange-500 font-bold text-xl">฿390 <span className="text-sm text-gray-500 font-normal">/ ใบ</span></p>
              <button className="bg-gray-100 hover:bg-green-600 hover:text-white p-2 rounded-full transition text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </button>
            </div>
          </div>

          {/* สินค้าชิ้นที่ 3 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img src="https://images.unsplash.com/photo-1582282577237-77fb57d47453?q=80&w=800&auto=format&fit=crop" alt="น้ำพริก" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">ป้าแมว ของฝาก</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-green-600 transition">น้ำพริกหนุ่ม ย่างเตาถ่าน</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-orange-500 font-bold text-xl">฿65 <span className="text-sm text-gray-500 font-normal">/ กระปุก</span></p>
              <button className="bg-gray-100 hover:bg-green-600 hover:text-white p-2 rounded-full transition text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </button>
            </div>
          </div>

          {/* สินค้าชิ้นที่ 4 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img src="https://images.unsplash.com/photo-1544681280-d2dc1bcfa97a?q=80&w=800&auto=format&fit=crop" alt="สบู่สมุนไพร" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">กลุ่มเกษตรอินทรีย์</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-green-600 transition">สบู่เหลวออร์แกนิค ขมิ้นชัน</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-orange-500 font-bold text-xl">฿120 <span className="text-sm text-gray-500 font-normal">/ ขวด</span></p>
              <button className="bg-gray-100 hover:bg-green-600 hover:text-white p-2 rounded-full transition text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
