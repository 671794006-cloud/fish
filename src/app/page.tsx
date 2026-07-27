"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Image as ImageIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-neutral-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">🐟</span>
            ชุมชนปลาแดดเดียว
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-white/10 hover:text-white">เข้าสู่ระบบ</Button>
            </Link>
            <Button className="bg-white text-black hover:bg-neutral-200 rounded-full px-6 font-medium">
              <ShoppingCart className="mr-2 h-4 w-4" />
              ตะกร้า (0)
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium w-fit">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              ของดีประจำชุมชน ส่งตรงถึงบ้านคุณ
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
              ปลาแดดเดียว <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                สูตรลับเฉพาะชุมชน
              </span>
            </h1>
            
            <p className="text-lg text-neutral-400 max-w-lg leading-relaxed">
              สัมผัสรสชาติความอร่อยที่สืบทอดกันมาอย่างยาวนาน ทำสดใหม่ทุกวัน สะอาด ปลอดภัย ไร้สารกันบูด พร้อมจัดส่งถึงหน้าบ้านคุณแล้ววันนี้
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-14 text-base shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]">
                สั่งซื้อเลย <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Video / Image Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 relative shadow-2xl">
              {/* Fallback pattern while video is loading/missing */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
                <p>พื้นที่สำหรับรูปภาพสินค้า</p>
                <p className="text-sm">(ดึงจาก Supabase Storage)</p>
              </div>

              {/* Glassmorphism Price Tag */}
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-black/40 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-neutral-300 text-sm mb-1">ราคาเริ่มต้นเพียง</p>
                  <p className="text-3xl font-bold text-white">฿150 <span className="text-base font-normal text-neutral-400">/ กก.</span></p>
                </div>
                <Button className="bg-white text-black hover:bg-neutral-200 rounded-full h-12 px-6 font-bold text-base shadow-lg hover:scale-105 transition-transform">
                  เพิ่มลงตะกร้า
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
