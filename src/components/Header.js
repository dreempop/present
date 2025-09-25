'use client';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import { Bell, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [hasReminder, setHasReminder] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [lastReminderDate, setLastReminderDate] = useState(null);
  const router = useRouter();
  const bellRef = useRef(null);
  const profileRef = useRef(null);

  // ✅ กำหนดวันครบกำหนดยื่นภาษี (31 มี.ค. 2025)
  const dueDate = new Date("2025-03-31T23:59:59");

  // ✅ pushToast อยู่ใน scope ที่ถูกต้อง
  function pushToast(text) {
    toast.custom(
      () => (
        <div className="bg-white/90 border-l-4 border-green-500 p-4 rounded-xl shadow-lg text-gray-800 backdrop-blur-sm">
          {text}
        </div>
      ),
      { duration: 3000 }
    );
  }

  // โหลด session
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === "SIGNED_IN") toast.success("เข้าสู่ระบบสำเร็จ!");
      if (_event === "SIGNED_OUT") toast.success("ออกจากระบบสำเร็จ!");
    });

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  // ปิด dropdown เมื่อคลิกนอกกรอบ
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) setBellDropdownOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ตรวจสอบ Reminder (วันละครั้ง)
  useEffect(() => {
    if (!session?.user?.email) return;

    setLastReminderDate(null);
    checkReminderAndNotify();

    // ✅ รันทุก 24 ชั่วโมง
    const interval = setInterval(() => checkReminderAndNotify(), 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, [session]);

  const checkReminderAndNotify = async () => {
    const email = session?.user?.email;
    if (!email) return;

    const today = new Date();
    const todayStr = today.toDateString();

    // ✅ กันไม่ให้แจ้งซ้ำในวันเดียวกัน
    if (lastReminderDate === todayStr) return;

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let message = "";

    if (diffDays === 10) {
      message = "📢 เหลือเวลา 10 วันในการยื่นภาษีประจำปี";
    } else if (diffDays === 0) {
      message = "⚠️ วันนี้ครบกำหนดยื่น/ชำระภาษีแล้ว (31 มี.ค. / 8 เม.ย. ออนไลน์)";
    } else if (diffDays < 0 && diffDays >= -365) {
      message = "⌛ ตอนนี้สามารถยื่นแบบย้อนหลังได้ (มีเบี้ยปรับและเงินเพิ่ม)";
    } else {
      return;
    }

    setLastReminderDate(todayStr);
    setNotifications((prev) => [{ text: message, time: new Date() }, ...prev]);
    setHasReminder(true);
    pushToast(message);

    try {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("C-Advisor", { body: message });
        } else if (Notification.permission !== "denied") {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            new Notification("C-Advisor", { body: message });
          }
        }
      }
    } catch {}
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    else {
      setLastReminderDate(null);
      setNotifications([]);
      router.push("/");
    }
  };

  // Navigation items
  const navItems = [
    { name: "หน้าแรก", path: "/" },
    { name: "แชทบอท", path: "/chat-page" },
    { name: "บทความ", path: "/articles" },
    { name: "คำนวณภาษี", path: "/calculator" },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          {/* Logo */}
          <div
            className="flex items-center text-2xl font-bold text-green-700 cursor-pointer select-none"
            onClick={() => router.push("/")}
          >
            <span className="tracking-tight">C-Advisor</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8 font-medium text-gray-800">
            {navItems.map((item) => (
              <button key={item.path} onClick={() => router.push(item.path)} className="relative group">
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-5 relative">
            {session && (
              <>
                {/* Bell Dropdown */}
                <div className="relative" ref={bellRef}>
                  <button
                    onClick={() => setBellDropdownOpen(!bellDropdownOpen) || setHasReminder(false)}
                    className="relative p-2 rounded-full hover:bg-green-50 transition"
                  >
                    <Bell className="w-6 h-6 text-green-700" />
                    {hasReminder && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
                  </button>

                  <AnimatePresence>
                    {bellDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
                      >
                        <div className="p-3 font-semibold text-green-700 border-b">การแจ้งเตือน</div>
                        <div className="max-h-64 overflow-y-auto divide-y">
                          {notifications.length > 0 ? (
                            notifications.map((n, idx) => (
                              <div key={idx} className="p-3 text-sm hover:bg-green-50 transition">
                                <div>{n.text}</div>
                                <div className="text-xs text-gray-500 mt-1">{n.time.toLocaleString()}</div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-sm text-gray-500 text-center">ไม่มีการแจ้งเตือน</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center p-2 rounded-full hover:bg-green-50 transition"
                  >
                    <User className="w-6 h-6 text-green-700" />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
                      >
                        <button onClick={() => { router.push("/profile"); setProfileDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-green-50 transition">โปรไฟล์</button>
                        <button onClick={() => { router.push("/Gallery Page"); setProfileDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-green-50 transition">คลังภาพ</button>
                        <button onClick={() => { router.push("/settings"); setProfileDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-green-50 transition">ตั้งค่า</button>
                        <button onClick={() => { handleLogout(); setProfileDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 transition text-red-600">ออกจากระบบ</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {!session && (
              <>
                <button onClick={() => router.push("/login-page")} className="px-5 py-2 border border-green-600 text-green-700 rounded-full hover:bg-green-50 transition">Sign In</button>
                <button onClick={() => router.push("/register-page")} className="px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-sm">Register</button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden relative">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-2xl text-green-700 focus:outline-none">
              {mobileOpen ? "✕" : "☰"}
              {hasReminder && !mobileOpen && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="md:hidden bg-white border-t border-green-100 overflow-hidden">
              <nav className="flex flex-col px-4 py-2 space-y-2 font-medium text-gray-800">
                {navItems.map((item) => (
                  <button key={item.path} onClick={() => { router.push(item.path); setMobileOpen(false); }} className="text-left px-2 py-2 rounded hover:bg-green-50 transition">{item.name}</button>
                ))}
                {session && (
                  <>
                    <button onClick={() => { router.push("/profile"); setProfileDropdownOpen(false); setMobileOpen(false); }} className="text-left px-2 py-2 rounded hover:bg-green-50 transition">โปรไฟล์</button>
                    <button onClick={() => { router.push("/image"); setProfileDropdownOpen(false); setMobileOpen(false); }} className="text-left px-2 py-2 rounded hover:bg-green-50 transition">คลังภาพ</button>
                    <button onClick={() => { router.push("/settings"); setProfileDropdownOpen(false); setMobileOpen(false); }} className="text-left px-2 py-2 rounded hover:bg-green-50 transition">ตั้งค่า</button>
                    <button onClick={() => { handleLogout(); setProfileDropdownOpen(false); setMobileOpen(false); }} className="text-left px-2 py-2 rounded hover:bg-red-50 transition text-red-600">ออกจากระบบ</button>
                  </>
                )}
                {!session && (
                  <>
                    <button onClick={() => { router.push("/login-page"); setMobileOpen(false); }} className="px-2 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50 transition">Sign In</button>
                    <button onClick={() => { router.push("/register-page"); setMobileOpen(false); }} className="px-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Register</button>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
