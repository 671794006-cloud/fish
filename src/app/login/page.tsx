"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-neutral-900/80 backdrop-blur-xl border-neutral-800 text-white shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center tracking-tight">เข้าสู่ระบบ</CardTitle>
            <CardDescription className="text-center text-neutral-400">
              ยินดีต้อนรับสู่ร้านค้าชุมชนของเรา
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800 hover:text-white transition-all font-medium text-blue-400">
                Facebook
              </Button>
              <Button variant="outline" className="bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800 hover:text-white transition-all font-medium text-neutral-300">
                Apple
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-neutral-900 px-2 text-neutral-500">หรือใช้เบอร์โทร/อีเมล</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">อีเมล / เบอร์โทรศัพท์</Label>
              <Input 
                id="email" 
                type="text" 
                placeholder="m@example.com" 
                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-neutral-800/50 border-neutral-700 text-white focus-visible:ring-blue-500"
              />
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
              เข้าสู่ระบบ <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-neutral-400">
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                สมัครสมาชิก
              </Link>
            </div>
            <Link href="/" className="text-center text-sm text-neutral-500 hover:text-white transition-colors">
              กลับสู่หน้าหลัก
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
