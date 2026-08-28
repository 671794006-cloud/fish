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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);

  // 🌟 ระบบจัดการธีม (Auto-detect System Theme)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // --- สถานะระบบค้นหาสินค้า ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // --- สถานะระบบตะกร้า ---
  const [cart, setCart] = useState<Record<number, number>>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("my_shop_cart");
      if (savedCart) {
        try { return JSON.parse(savedCart); } catch (e) { return {}; }
      }
    }
    return {};
  }); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // 🌟 สถานะสำหรับเก็บจำนวนสินค้าตอนเปิดป๊อปอัปดูรายละเอียด
  const [modalQty, setModalQty] = useState<number>(1);

  // 🌟 สถานะเปิด/ปิดกล่องข้อมูลผู้รับสินค้า (เพื่อประหยัดพื้นที่)
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState(""); 
  const [customAlert, setCustomAlert] = useState<{title: string, message: string, type: 'success' | 'error' | 'loading'} | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("qr");
  
  const [mapLink, setMapLink] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showMap, setShowMap] = useState(false); 
  const mapInstanceRef = useRef<any>(null); 

  // เช็ก Theme อัตโนมัติเมื่อเข้าเว็บ
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
  }, []);

  // อัปเดต HTML Class และจำค่า Theme
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const meta = session.user.user_metadata;
        if (meta) {
          if (meta.fullName) setFullName(meta.fullName);
          if (meta.phone) setPhone(meta.phone);
          if (meta.addressDetail) setAddressDetail(meta.addressDetail);
          if (meta.userLocation) setUserLocation(meta.userLocation);
          if (meta.mapLink) setMapLink(meta.mapLink);
        }
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  // บันทึกตะกร้า
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("my_shop_cart", JSON.stringify(cart));
    }
  }, [cart]);

  // โหลดแผนที่
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

        const map = L.map('interactive-map', { zoomControl: false }).setView([lat, lng], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

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

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => { setToastMessage(""); }, 2000);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      showToast("⏳ กำลังหาตำแหน่งปัจจุบันของคุณ...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapLink(`https://maps.google.com/?q=${latitude},${longitude}`);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([latitude, longitude], 17, { animate: true, duration: 1.5 });
          }
          showToast("📍 บินมาถึงตำแหน่งของคุณแล้ว!");
          setShowMap(true); 
        },
        (error) => {
          if (error.code === error.TIMEOUT) {
             setCustomAlert({ title: "หมดเวลาค้นหา", message: "ระบบค้นหาตำแหน่งนานเกินไป\nแนะนำให้พิมพ์ที่อยู่แล้วกด 'ค้นหาพิกัด' ครับ", type: "error" });
          } else {
             setCustomAlert({ title: "ไม่สามารถดึงตำแหน่งได้", message: "กรุณาอนุญาตให้เว็บเข้าถึงตำแหน่ง (Location)\nหรือพิมพ์ค้นหาพิกัดเองครับ", type: "error" });
          }
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
    showToast("⏳ กำลังค้นหาพิกัดจากที่อยู่...");
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
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
        }
        showToast("📍 เจอพิกัดใกล้เคียงแล้ว! (ใช้นิ้วเลื่อนปรับให้ตรงบ้านอีกนิดนะครับ)");
        setShowMap(true);
      } else {
        setCustomAlert({ title: "หาพิกัดไม่พบ", message: "ลองตรวจตัวสะกดชื่อ ตำบล อำเภอ จังหวัด อีกครั้งครับ", type: "error" });
      }
    } catch (error) {
      setCustomAlert({ title: "เกิดข้อผิดพลาด", message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์แผนที่ได้", type: "error" });
    }
  };

  const handleQuickSaveAddress = async () => {
    if (!user) return;
    showToast("⏳ กำลังบันทึกข้อมูล...");
    const { error } = await supabase.auth.updateUser({
      data: { fullName, phone, addressDetail, mapLink, userLocation }
    });
    if (!error) {
      showToast("✅ บันทึกที่อยู่นี้เป็นค่าเริ่มต้นเรียบร้อยแล้ว!");
    } else {
      setCustomAlert({ title: "เกิดข้อผิดพลาด", message: "ไม่สามารถบันทึกข้อมูลที่อยู่ได้", type: "error" });
    }
  };

  const addToCartOnly = (productId: number, qty: number = 1) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + qty }));
    showToast("🛒 เพิ่มสินค้าลงตะกร้าแล้ว");
  };

  const buyNow = (productId: number, qty: number = 1) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + qty }));
    setIsCartOpen(true);
    setShowPayment(true); 
  };

  // ล็อกไม่ให้ลบสินค้าออกอัตโนมัติ ให้เหลือ 0 ไว้
  const updateQty = (productId: number, delta: number) => {
    setCart((prev) => {
      let newQty = (prev[productId] || 0) + delta;
      if (newQty < 0) newQty = 0; 
      return { ...prev, [productId]: newQty };
    });
  };

  // ถังขยะเท่านั้นที่จะลบสินค้าออกไปจากตะกร้าอย่างสมบูรณ์
  const removeItem = (productId: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
    showToast("🗑️ ลบสินค้าออกจากตะกร้าแล้ว");
  };

  // จัดการตอนลูกค้าพิมพ์ตัวเลข ให้ถ้าลบตัวเลขทิ้งทั้งหมด (Backspace) ค่าจะกลายเป็น 0 โชว์ที่ช่องทันที
  const handleQtyChange = (productId: number, value: string) => {
    if (value === "") {
      setCart(prev => ({ ...prev, [productId]: 0 })); 
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) { 
      setCart(prev => ({ ...prev, [productId]: num }));
    }
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => p.id === parseInt(id));
    return { ...product!, qty };
  });
  
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingFee = totalItemsCount > 0 ? 40 : 0;
  const grandTotal = subtotal > 0 ? subtotal + shippingFee : 0;

  const handleConfirmOrder = async () => {
    // กรองเอาเฉพาะสินค้าที่มีจำนวนมากกว่า 0 (เพื่อป้องกันการส่งข้อมูลเปล่า)
    const finalCartItems = cartItems.filter(item => item.qty > 0);
    if (finalCartItems.length === 0) {
      setCustomAlert({ title: "ตะกร้าว่างเปล่า", message: "กรุณาเลือกจำนวนสินค้าอย่างน้อย 1 ชิ้น", type: "error" });
      return;
    }

    if (!fullName.trim() || !phone.trim() || !addressDetail.trim()) {
      setIsAddressOpen(true); 
      setCustomAlert({ title: "ข้อมูลไม่ครบถ้วน", message: "กรุณากรอกชื่อ-นามสกุล เบอร์โทรศัพท์\nและที่อยู่จัดส่งให้ครบถ้วนครับ", type: "error" });
      return;
    }

    if (!user) {
      setCustomAlert({ title: "ยังไม่ได้เข้าสู่ระบบ", message: "กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อครับ", type: "error" });
      return;
    }

    let finalPaymentTypeText = "เก็บเงินปลายทาง (COD)";
    
    if (paymentMethod === "qr") {
      if (!slipFile) {
        setCustomAlert({ title: "ยังไม่ได้แนบสลิป", message: "กรุณาแนบหลักฐานการโอนเงิน (สลิป) ก่อนกดยืนยันการสั่งซื้อด้วยครับ", type: "error" });
        return;
      }

      setCustomAlert({ title: "กำลังอัปโหลดสลิป...", message: "โปรดรอสักครู่ ระบบกำลังอัปโหลดหลักฐานการชำระเงิน", type: "loading" });

      const fileExt = slipFile.name.split('.').pop();
      const fileName = `slip_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `slips/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fish')
        .upload(filePath, slipFile);

      if (uploadError) {
        setCustomAlert({ title: "อัปโหลดสลิปไม่สำเร็จ", message: "ไม่สามารถแนบไฟล์สลิปได้ กรุณาลองอีกครั้งครับ\n" + uploadError.message, type: "error" });
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('fish').getPublicUrl(filePath);
      finalPaymentTypeText = `โอนเงิน / QR Code\nลิงก์สลิป: ${publicUrl}`;
    }

    const scriptUrl = "https://script.google.com/macros/s/AKfycbxK1f5QHqMGf7Av_whLADqwlHLf_k6RLGrCNsExZmIMt0-qLiI14Y-jASRLPa4dQ6NX/exec";

    setCustomAlert({ title: "กำลังดำเนินการ...", message: "โปรดรอสักครู่ ระบบกำลังส่งคำสั่งซื้อของคุณ", type: "loading" });

    let finalAddress = addressDetail;
    if (mapLink) {
      finalAddress += `\n📍 พิกัดแผนที่: ${mapLink}`;
    }

    const orderListText = finalCartItems.map(item => `- ${item.name} x${item.qty}`).join('\n');
    const fullAddressText = `คุณ ${fullName} (${phone})\nที่อยู่: ${finalAddress}\n\nรายการสินค้า:\n${orderListText}`;

    try {
      const { data: newOrder, error: dbError } = await supabase.from('orders').insert({
        user_id: user.id,
        items: finalCartItems, 
        total_price: grandTotal,
        status: 'รอดำเนินการ'
      }).select();

      if (dbError) throw dbError;
      const currentOrderId = newOrder[0].id; 

      await supabase.auth.updateUser({
        data: { fullName, phone, addressDetail, mapLink, userLocation }
      });

      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, 
        body: JSON.stringify({
          action: "create", 
          orderId: currentOrderId, 
          customerName: fullName,
          phone: phone,
          address: finalAddress, 
          orderItems: orderListText,
          totalPrice: grandTotal,
          paymentMethod: finalPaymentTypeText 
        }),
      });

      setCart({});
      setMapLink(""); 
      setUserLocation(null);
      setSlipFile(null);
      setSlipPreview(null);
      setIsCartOpen(false);
      setShowPayment(false);

      if (paymentMethod === "qr") {
        setCustomAlert({
          title: "สั่งซื้อสำเร็จ! 🎉",
          message: `บันทึกคำสั่งซื้อและแนบสลิปเรียบร้อยแล้ว\nทางร้านจะรีบตรวจสอบและจัดส่งสินค้าครับ\n\n${fullAddressText}`,
          type: "success"
        });
      } else {
        setCustomAlert({
          title: "สั่งซื้อสำเร็จ! 🎉",
          message: `กรุณาเตรียมเงินสด ฿${grandTotal} ไว้ชำระกับพนักงานจัดส่งเมื่อสินค้าถึงมือครับ\n\n${fullAddressText}`,
          type: "success"
        });
      }

    } catch (error) {
      setCustomAlert({ title: "เกิดข้อผิดพลาด", message: "ไม่สามารถส่งข้อมูลคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้งครับ", type: "error" });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-200 pb-20 font-sans relative transition-colors duration-300">
      
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#0a4a2f] dark:bg-[#111] text-[#f3c623] dark:text-[#fde047] px-6 py-3 rounded-full shadow-2xl z-[100] font-bold text-sm flex items-center gap-2 animate-bounce border border-[#f3c623]/20">
          {toastMessage}
        </div>
      )}

      {/* 🌟 ป๊อปอัปแจ้งเตือน */}
      {customAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111] w-full max-w-sm rounded-3xl shadow-2xl p-6 md:p-8 text-center flex flex-col items-center relative animate-in fade-in zoom-in duration-200 border border-transparent dark:border-neutral-800">
            
            {customAlert.type === 'loading' && (
              <div className="w-16 h-16 border-4 border-gray-100 dark:border-neutral-800 border-t-[#0a4a2f] dark:border-t-green-500 rounded-full animate-spin mb-4"></div>
            )}
            {customAlert.type === 'success' && (
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
            )}
            {customAlert.type === 'error' && (
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{customAlert.title}</h3>
            
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-6 whitespace-pre-line leading-relaxed text-left inline-block w-full max-h-48 overflow-y-auto">
              {customAlert.message}
            </div>

            {customAlert.type !== 'loading' && (
              <button 
                onClick={() => setCustomAlert(null)}
                className={`w-full py-3 rounded-xl font-bold text-white transition shadow-md ${customAlert.type === 'success' ? 'bg-[#0a4a2f] dark:bg-green-600 hover:bg-[#073622] dark:hover:bg-green-700' : 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'}`}
              >
                ตกลง
              </button>
            )}
          </div>
        </div>
      )}

      {/* 1. Navbar */}
      <nav className="flex flex-wrap items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white dark:bg-[#0a0a0a] border-b border-green-100 dark:border-neutral-900 sticky top-0 z-40 shadow-sm transition-colors duration-300 gap-y-3">
        
        {/* 🌟 (อัปเดต) เปลี่ยนโลโก้เป็นปุ่มที่กดแล้วเลื่อนกลับขึ้นบนสุด */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 font-bold text-lg md:text-xl text-[#0a4a2f] dark:text-white hover:opacity-80 transition cursor-pointer text-left"
        >
          <div className="bg-[#0a4a2f] dark:bg-green-600 p-1.5 md:p-2 rounded-full border-2 border-[#f3c623] dark:border-[#fde047]">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-[#f3c623] dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          วิสาหกิจบ้านป่าตึงงาม
        </button>

        <div className="flex items-center gap-2 md:gap-3 text-sm font-medium order-2 md:order-3">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 md:p-2 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
            title="สลับโหมดหน้าจอ"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button 
            onClick={() => { setIsCartOpen(true); setShowPayment(false); }}
            className="relative flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#0a4a2f] dark:hover:text-green-400 transition p-1 md:p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 100-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            {totalItemsCount > 0 && (
              <span className="absolute 0 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-[#0a0a0a]">
                {totalItemsCount}
              </span>
            )}
          </button>
          
          {user ? (
            <Link href="/account" className="flex items-center gap-2 bg-green-50 dark:bg-neutral-800 text-[#0a4a2f] dark:text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-green-200 dark:border-neutral-700 hover:bg-green-100 dark:hover:bg-neutral-700 transition shadow-sm font-bold">
              <div className="w-6 h-6 md:w-7 md:h-7 bg-[#0a4a2f] dark:bg-green-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm uppercase">
                {user.email?.charAt(0) || "U"}
              </div>
              <span className="hidden sm:inline">บัญชีของฉัน</span>
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-[#0a4a2f] dark:bg-green-600 text-[#f3c623] dark:text-black px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:bg-[#073622] dark:hover:bg-green-500 transition shadow-sm text-xs md:text-sm">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        <div className="w-full flex md:flex-1 md:w-auto max-w-xl mx-0 md:mx-8 relative order-3 md:order-2 mt-1 md:mt-0">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchInputRef.current?.blur();
                setIsSearchFocused(false);
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            placeholder="ค้นหาสินค้า (กด Enter เพื่อค้นหา)..."
            className="w-full py-2.5 md:py-2 pl-10 pr-4 bg-gray-50 dark:bg-[#111] border border-green-200 dark:border-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0a4a2f] dark:focus:ring-green-500 text-sm md:text-base shadow-sm md:shadow-none dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-3 md:top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>

          {searchQuery && isSearchFocused && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden z-[50] max-h-[50vh] overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      setSelectedProduct(item);
                      setModalQty(1); 
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-green-50 dark:hover:bg-neutral-800 cursor-pointer border-b border-gray-50 dark:border-neutral-800 last:border-0 transition"
                  >
                    <img src={item.image} alt={item.name} className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-xl border border-gray-100 dark:border-neutral-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs md:text-sm text-[#0a4a2f] dark:text-green-400 truncate">{item.name}</h4>
                      <p className="text-[10px] md:text-xs text-orange-600 dark:text-orange-400 font-semibold mt-0.5">฿{item.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 text-center text-sm text-gray-500 dark:text-gray-400">
                  ไม่มีสินค้าที่ตรงกับ "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

      </nav>

      {/* 2. Hero Section */}
      <div className="relative w-full h-[350px] md:h-[450px] flex flex-col items-center justify-center text-white overflow-hidden bg-[#0a4a2f] dark:bg-black">
        <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://grilvqiyczvdkfumxxqy.supabase.co/storage/v1/object/public/fish/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>
        <div className="z-10 text-center space-y-4 md:space-y-6 max-w-3xl px-4 flex flex-col items-center">
          <div className="bg-black/50 text-[#f3c623] px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm inline-flex items-center gap-2 backdrop-blur-md border border-[#f3c623]/50 font-bold shadow-xl">
            ⭐ OTOP 5 ดาว วิสาหกิจชุมชน
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold leading-tight text-white tracking-wide" style={{ textShadow: "0px 4px 15px rgba(0, 0, 0, 0.9), 0px 2px 5px rgba(0, 0, 0, 0.7)" }}>
            วิสาหกิจบ้านป่าตึงงาม<br/>หมู่ 18
          </h1>
        </div>
      </div>

      {/* 3. ส่วนแสดงรายการสินค้าทั้งหมด */}
      <div id="products" className="max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-2 md:gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a4a2f] dark:text-white">
              {searchQuery ? `ผลการค้นหา: "${searchQuery}"` : "สินค้าแนะนำของชุมชน"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 md:mt-2 text-sm md:text-base">แปรรูปอาหารและหัตถกรรม สด สะอาด ปลอดภัย</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <div key={item.id} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-neutral-800 rounded-3xl p-4 md:p-6 shadow-sm hover:shadow-md transition duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 md:gap-6 items-start">
                  <div className="sm:col-span-5 relative aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-900 group cursor-pointer" onClick={() => { setSelectedProduct(item); setModalQty(1); }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1626804475297-41609ea2b5eb?q=80&w=800&auto=format&fit=crop"; }} />
                    <div className="absolute inset-0 bg-black/20 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="bg-white/90 dark:bg-black/90 text-[#0a4a2f] dark:text-green-400 px-4 py-2 rounded-full font-bold text-xs shadow-lg">🔍 ดูรายละเอียด</span>
                    </div>
                  </div>

                  <div className="sm:col-span-7 flex flex-col justify-between h-full space-y-4">
                    <div className="cursor-pointer" onClick={() => { setSelectedProduct(item); setModalQty(1); }}>
                      <span className="inline-block text-[10px] md:text-xs font-bold text-[#0a4a2f] dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full border border-green-200 dark:border-green-800 mb-2">{item.vendor}</span>
                      <h3 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-[#0a4a2f] dark:hover:text-green-400 transition">{item.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm line-clamp-3">{item.description}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
                      <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 block mb-1">ราคาจำหน่าย</span>
                      <p className="text-orange-600 dark:text-orange-400 font-extrabold text-xl md:text-2xl mb-3">
                        ฿{item.price} <span className="text-xs md:text-sm font-normal text-gray-500 dark:text-gray-500">/ {item.unit}</span>
                      </p>
                      
                      <div className="flex gap-2">
                        <button onClick={() => addToCartOnly(item.id)} className="flex-1 border-2 border-[#0a4a2f] dark:border-green-500 text-[#0a4a2f] dark:text-green-400 hover:bg-green-50 dark:hover:bg-neutral-800 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-1.5">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                          ใส่ตะกร้า
                        </button>
                        <button onClick={() => buyNow(item.id)} className="flex-1 bg-[#0a4a2f] dark:bg-green-600 hover:bg-[#073622] dark:hover:bg-green-700 text-[#f3c623] dark:text-white py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition shadow-md flex items-center justify-center gap-1.5">
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                          สั่งซื้อเลย
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 lg:col-span-2 text-center py-16 bg-white dark:bg-[#111] rounded-3xl border border-dashed border-gray-300 dark:border-neutral-700 shadow-sm">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-1">ไม่พบสินค้าที่คุณค้นหา</h3>
              <p className="text-gray-500 dark:text-gray-400">ลองค้นหาด้วยคำอื่น หรือเลือกดูสินค้าแนะนำของเรา</p>
              <button onClick={() => setSearchQuery("")} className="mt-4 px-6 py-2 bg-green-50 dark:bg-neutral-800 text-[#0a4a2f] dark:text-white font-bold rounded-full hover:bg-green-100 dark:hover:bg-neutral-700 transition border border-green-200 dark:border-neutral-700">
                ดูสินค้าทั้งหมด
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Modal ป๊อปอัปรายละเอียดสินค้าเพิ่มเติม --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-transparent dark:border-neutral-800">
            <div className="bg-[#0a4a2f] dark:bg-[#111] p-4 md:p-5 text-white flex justify-between items-center sticky top-0 z-10 border-b border-transparent dark:border-neutral-800">
              <h2 className="text-lg md:text-xl font-bold text-[#f3c623] dark:text-green-400">รายละเอียดสินค้า</h2>
              <button onClick={() => setSelectedProduct(null)} className="p-1 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-5 md:space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 md:gap-5 items-start">
                <img src={selectedProduct.image} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm" alt={selectedProduct.name} />
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-[#0a4a2f] dark:text-white mb-1">{selectedProduct.name}</h3>
                  <span className="text-[10px] md:text-xs font-bold text-[#0a4a2f] dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded border border-green-200 dark:border-green-800 inline-block mb-2">{selectedProduct.vendor}</span>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">{selectedProduct.description}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#111] rounded-2xl p-4 border border-gray-100 dark:border-neutral-800">
                <h4 className="font-bold text-[#0a4a2f] dark:text-white text-sm mb-3">ข้อมูลจำเพาะ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                  {selectedProduct.details.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-black p-3 rounded-xl border border-gray-100 dark:border-neutral-800">
                      <span className="text-gray-400 dark:text-gray-500 block text-[10px] md:text-xs">{item.title}</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/50">
                  <h4 className="font-bold text-amber-900 dark:text-amber-400 text-sm mb-2">🍳 วิธีการรับประทาน</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-amber-800 dark:text-amber-200/80">
                    {selectedProduct.cookingSteps.map((step: string, idx: number) => (<li key={idx} className="leading-relaxed">{step}</li>))}
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/50">
                  <h4 className="font-bold text-blue-900 dark:text-blue-400 text-sm mb-2">❄️ วิธีการเก็บรักษา</h4>
                  <p className="text-xs text-blue-800 dark:text-blue-200/80 leading-relaxed">{selectedProduct.storage}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">จำนวน:</span>
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-neutral-700 rounded-xl px-1 py-1 shadow-sm">
                    <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg font-bold text-lg transition">-</button>
                    <input 
                      type="number" 
                      value={modalQty.toString()}
                      onChange={(e) => {
                        if (e.target.value === "") setModalQty(0);
                        else {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 0) setModalQty(val);
                        }
                      }}
                      className="w-10 text-center text-sm font-bold bg-transparent outline-none dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button onClick={() => setModalQty(modalQty + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg font-bold text-lg transition">+</button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
                  <button onClick={() => { addToCartOnly(selectedProduct.id, modalQty); setSelectedProduct(null); }} className="px-6 py-2.5 md:py-3 rounded-xl border-2 border-[#0a4a2f] dark:border-green-500 text-[#0a4a2f] dark:text-green-400 font-bold hover:bg-green-50 dark:hover:bg-neutral-800 text-xs md:text-sm flex items-center justify-center gap-2 transition">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    ใส่ตะกร้า
                  </button>
                  <button onClick={() => { buyNow(selectedProduct.id, modalQty); setSelectedProduct(null); }} className="px-6 py-2.5 md:py-3 rounded-xl bg-[#0a4a2f] dark:bg-green-600 text-[#f3c623] dark:text-white font-bold hover:bg-[#073622] dark:hover:bg-green-700 text-xs md:text-sm flex items-center justify-center gap-2 transition shadow-md">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    สั่งซื้อเลย
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal ตะกร้าสินค้า และ หน้าจัดส่ง/ชำระเงิน --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-transparent dark:border-neutral-800">
            <div className="bg-[#0a4a2f] dark:bg-[#111] p-4 px-5 md:px-6 text-white flex justify-between items-center sticky top-0 z-20 border-b border-transparent dark:border-neutral-800">
              <h2 className="text-lg md:text-xl font-bold text-[#f3c623] dark:text-green-400 flex items-center gap-2">
                {showPayment ? "📦 จัดส่งและชำระเงิน" : "🛒 ตะกร้าสินค้าของคุณ"}
              </h2>
              <button onClick={() => { setIsCartOpen(false); setShowPayment(false); setSlipFile(null); setSlipPreview(null); }} className="p-1.5 hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition text-white">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-5 md:p-6">
              {!showPayment ? (
                cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <p className="text-gray-500 dark:text-gray-500 text-sm md:text-lg">ยังไม่มีสินค้าในตะกร้า</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-[#111] p-2 md:p-3 rounded-2xl border border-gray-100 dark:border-neutral-800 gap-2">
                          <div className="flex gap-2 md:gap-3 items-center min-w-0 flex-1">
                            <img src={item.image} alt={item.name} className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-xl border border-gray-200 dark:border-neutral-800 shrink-0" />
                            <div className="min-w-0">
                              <h3 className="font-bold text-[#0a4a2f] dark:text-white text-xs md:text-sm truncate">{item.name}</h3>
                              <p className="text-[10px] md:text-xs text-orange-600 dark:text-orange-400 font-semibold mt-0.5">฿{item.price}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
                            <div className="flex items-center gap-1 bg-white dark:bg-black border border-gray-200 dark:border-neutral-700 rounded-full px-1 py-1 shadow-sm">
                              <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full font-bold text-sm md:text-base">-</button>
                              <input 
                                type="number" 
                                value={item.qty.toString()}
                                onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                className="w-6 md:w-8 text-center text-xs md:text-sm font-bold bg-transparent outline-none dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full font-bold text-sm md:text-base">+</button>
                            </div>

                            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1.5 md:p-2 rounded-full transition" title="ลบสินค้า">
                              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-[#111] p-3 md:p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 space-y-2 text-xs md:text-sm mt-4">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>ราคาสินค้ารวม ({totalItemsCount} ชิ้น)</span>
                        <span>฿{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>ค่าจัดส่ง (เหมาจ่าย)</span>
                        <span>฿{shippingFee}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-neutral-800 text-sm md:text-base font-extrabold text-[#0a4a2f] dark:text-white">
                        <span>ยอดรวมสุทธิ</span>
                        <span className="text-xl md:text-2xl text-orange-600 dark:text-orange-400">฿{grandTotal}</span>
                      </div>
                    </div>

                    <button onClick={() => setShowPayment(true)} className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-3 md:py-3.5 rounded-2xl font-bold text-sm md:text-lg transition shadow-md flex justify-center items-center gap-2">
                      ดำเนินการจัดส่งและชำระเงิน <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                  </div>
                )
              ) : (
                <div className="space-y-4 md:space-y-6 relative">
                  
                  <div className="bg-green-50/70 dark:bg-green-900/10 p-3 md:p-4 rounded-2xl border border-green-200 dark:border-green-800/30 space-y-3">
                    <div className="flex items-center justify-between border-b border-green-200 dark:border-green-800/50 pb-2">
                      <span className="font-bold text-[#0a4a2f] dark:text-green-400 text-xs md:text-sm flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4L5 11z"></path></svg>
                        รายการสินค้าที่สั่งซื้อ
                      </span>
                      <span className="text-[10px] md:text-xs font-bold text-green-700 dark:text-green-300 bg-white dark:bg-green-900/40 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-700">
                        {totalItemsCount} ชิ้น
                      </span>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-2 md:gap-3 items-center bg-white dark:bg-black p-2 rounded-xl border border-green-100 dark:border-neutral-800 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg border border-gray-200 dark:border-neutral-800 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#0a4a2f] dark:text-gray-200 text-[10px] md:text-xs truncate">{item.name}</h4>
                            
                            <div className="flex justify-between items-center mt-1 w-full gap-2">
                              <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-neutral-700 rounded-full px-1 py-0.5 shadow-sm">
                                <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full font-bold text-sm">-</button>
                                <input 
                                  type="number" 
                                  value={item.qty.toString()}
                                  onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                  className="w-6 text-center text-[10px] md:text-xs font-bold bg-transparent outline-none dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full font-bold text-sm">+</button>
                              </div>
                              <span className="font-extrabold text-orange-600 dark:text-orange-400 text-[10px] md:text-xs ml-auto">฿{item.price * item.qty}</span>
                              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 md:p-1.5 rounded-full transition" title="ลบสินค้า">
                                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 text-[10px] md:text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-green-200/50 dark:border-green-800/50">
                      <div className="flex justify-between">
                        <span>ยอดชำระสุทธิ (รวมส่ง):</span>
                        <span className="text-lg md:text-xl text-orange-600 dark:text-orange-400 font-extrabold">฿{grandTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* ย่อข้อมูลผู้รับ (Accordion) ประหยัดพื้นที่ */}
                  <div className="space-y-3">
                    <button 
                      type="button" 
                      onClick={() => setIsAddressOpen(!isAddressOpen)} 
                      className="w-full flex items-center justify-between p-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-neutral-800 rounded-xl md:rounded-2xl shadow-sm transition hover:bg-gray-50 dark:hover:bg-neutral-800"
                    >
                      <h3 className="text-xs md:text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-700 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        ข้อมูลผู้รับสินค้า
                      </h3>
                      <span className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs font-bold bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded-lg">
                        {isAddressOpen ? "▲ ย่อเก็บ" : "▼ กดเพื่อดู/แก้ไข"}
                      </span>
                    </button>

                    {isAddressOpen && (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="ชื่อ-นามสกุล *" className="w-full p-2.5 md:p-3 border border-gray-300 dark:border-neutral-700 rounded-xl text-xs md:text-sm outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 bg-gray-50 dark:bg-[#111] dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="เบอร์โทรศัพท์ *" className="w-full p-2.5 md:p-3 border border-gray-300 dark:border-neutral-700 rounded-xl text-xs md:text-sm outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 bg-gray-50 dark:bg-[#111] dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                        </div>

                        <div className="space-y-1">
                          <textarea value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} rows={2} placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด..." className="w-full p-2.5 md:p-3 border border-gray-300 dark:border-neutral-700 rounded-xl text-xs md:text-sm outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-500 bg-gray-50 dark:bg-[#111] dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                          <div className="flex justify-between items-center px-1">
                            <span className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-500">💡 พิมพ์ที่อยู่เต็ม แล้วกดค้นหาพิกัดด้านล่างได้เลย</span>
                            {user && (
                              <button type="button" onClick={handleQuickSaveAddress} className="text-[10px] md:text-xs text-green-700 dark:text-green-500 font-bold hover:underline">
                                💾 บันทึกเป็นที่อยู่ประจำ
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 pt-1">
                          <div className="flex gap-2">
                            <button type="button" onClick={handleSearchAddress} className="flex-1 p-2.5 rounded-xl border bg-gray-100 dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 text-xs md:text-sm font-bold transition flex items-center justify-center gap-2">
                              🔍 ค้นหาพิกัดจากที่อยู่
                            </button>
                          </div>

                          {!showMap ? (
                            <button type="button" onClick={() => setShowMap(true)} className={`w-full p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs md:text-sm font-bold transition ${mapLink ? 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400 shadow-sm' : 'bg-white dark:bg-[#111] border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800'}`}>
                              <svg className="w-4 h-4 md:w-5 md:h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                              {mapLink ? "📍 แก้ไขพิกัดปักหมุด" : "📍 เปิดแผนที่เพื่อปักหมุด (เลื่อนหาเองได้)"}
                            </button>
                          ) : (
                            <div className="mt-2 rounded-xl overflow-hidden border-2 border-green-600 shadow-lg relative flex flex-col h-[350px] animate-in fade-in zoom-in duration-300">
                              <div className="bg-[#0a4a2f] text-white text-xs md:text-sm text-center py-2 font-bold flex justify-between items-center px-4">
                                <span>📍 ใช้นิ้วเลื่อนแผนที่ให้ตรงกับบ้านคุณ</span>
                                <button type="button" onClick={() => setShowMap(false)} className="text-gray-300 hover:text-white px-2 py-1 rounded">✕ ปิด</button>
                              </div>
                              
                              <div className="relative flex-1 w-full bg-gray-100 dark:bg-neutral-900">
                                <div id="interactive-map" className="absolute inset-0 z-0"></div>
                                
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-[1000] pointer-events-none drop-shadow-xl pb-2">
                                  <svg className="w-10 h-10 text-red-600 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                </div>

                                <button type="button" onClick={handleGetLocation} className="absolute bottom-4 right-4 z-[1000] bg-white p-3 rounded-full shadow-xl border border-gray-200 text-blue-600 hover:bg-blue-50 transition flex items-center justify-center">
                                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
                                </button>
                              </div>

                              <button type="button" onClick={() => { setShowMap(false); showToast("✅ บันทึกพิกัดแผนที่แล้ว"); }} className="w-full bg-[#f3c623] hover:bg-yellow-500 text-[#0a4a2f] py-3 font-extrabold text-sm border-t-2 border-[#0a4a2f] transition">
                                 ✅ ยืนยันพิกัดปักหมุดตรงนี้
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs md:text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-700 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      วิธีชำระเงิน
                    </h3>

                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      <button type="button" onClick={() => setPaymentMethod("qr")} className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl border flex flex-col items-center gap-1.5 transition ${paymentMethod === "qr" ? "bg-green-50 dark:bg-green-900/30 border-green-600 dark:border-green-500 text-[#0a4a2f] dark:text-green-400 ring-2 ring-green-600/30 dark:ring-green-500/30" : "bg-white dark:bg-[#111] border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800"}`}>
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <span className="text-[10px] md:text-xs font-bold">โอนเงิน / QR Code</span>
                      </button>

                      <button type="button" onClick={() => setPaymentMethod("cod")} className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl border flex flex-col items-center gap-1.5 transition ${paymentMethod === "cod" ? "bg-orange-50 dark:bg-orange-900/30 border-orange-500 dark:border-orange-500 text-orange-800 dark:text-orange-400 ring-2 ring-orange-500/30 dark:ring-orange-500/30" : "bg-white dark:bg-[#111] border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800"}`}>
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <span className="text-[10px] md:text-xs font-bold">เก็บเงินปลายทาง</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === "qr" ? (
                    <div className="bg-gray-50 dark:bg-[#111] p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-200 dark:border-neutral-800 flex flex-col items-center space-y-3">
                      <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl border-2 border-[#0a4a2f] shadow-sm text-center">
                        <img src="/7cf48c5c-2375-46e8-8a30-04b7ccef97f5.jpg" alt="Thai QR Payment" className="w-32 md:w-48 h-auto object-contain mx-auto rounded-lg mb-1 md:mb-2" />
                        <p className="text-[10px] md:text-xs text-gray-500">สแกน QR PromptPay เพื่อโอนเงิน</p>
                      </div>
                      <div className="w-full bg-white dark:bg-black p-2 md:p-3 rounded-xl border border-gray-200 dark:border-neutral-800 text-center text-xs md:text-sm space-y-1">
                        <p className="text-gray-500 dark:text-gray-400">ชื่อบัญชี: <span className="font-bold text-[#0a4a2f] dark:text-green-400">นาย พงศ์พิชิต ทาบุญสม</span></p>
                        <p className="text-gray-500 dark:text-gray-400">ยอดที่ต้องโอน: <span className="font-extrabold text-orange-600 dark:text-orange-400 text-sm md:text-base">฿{grandTotal}</span></p>
                      </div>

                      <div className="w-full bg-white dark:bg-black p-3 rounded-xl border border-gray-200 dark:border-neutral-800 mt-2 text-left">
                        <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">แนบหลักฐานการโอนเงิน (สลิป) <span className="text-red-500">*</span></label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSlipFile(e.target.files[0]);
                              setSlipPreview(URL.createObjectURL(e.target.files[0]));
                            }
                          }}
                          className="block w-full text-xs text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 dark:file:bg-neutral-800 file:text-[#0a4a2f] dark:file:text-green-400 hover:file:bg-green-100 dark:hover:file:bg-neutral-700 transition cursor-pointer outline-none"
                        />
                        {slipPreview && (
                          <div className="mt-3 relative inline-block">
                            <img src={slipPreview} alt="Slip Preview" className="max-h-32 object-contain rounded-lg border border-gray-200 dark:border-neutral-700 shadow-sm" />
                            <button type="button" onClick={() => { setSlipFile(null); setSlipPreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md hover:bg-red-600 transition">✕</button>
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 md:p-5 rounded-xl md:rounded-2xl border border-orange-200 dark:border-orange-800/30 text-center space-y-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-1">
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                      </div>
                      <p className="font-bold text-orange-900 dark:text-orange-400 text-xs md:text-sm">บริการเก็บเงินปลายทาง</p>
                      <p className="text-[10px] md:text-xs text-orange-700 dark:text-orange-500">เตรียมเงินสด <span className="font-bold text-orange-900 dark:text-orange-300 text-xs md:text-sm">฿{grandTotal}</span> ไว้ชำระกับพนักงานจัดส่งเมื่อสินค้าถึงมือคุณ</p>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <button type="button" onClick={handleConfirmOrder} className="w-full bg-[#0a4a2f] dark:bg-green-600 hover:bg-[#073622] dark:hover:bg-green-700 text-[#f3c623] dark:text-white py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg transition shadow-md flex justify-center items-center gap-2">
                      ยืนยันการสั่งซื้อ
                    </button>
                    <button type="button" onClick={() => setShowPayment(false)} className="w-full text-center text-[10px] md:text-xs text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 py-2 block">
                      ← ย้อนกลับไปแก้ไขตะกร้าสินค้า
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
