'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        if (error || !currentUser) {
          toast.error("ไม่สามารถโหลดข้อมูลผู้ใช้ได้", { duration: 3000 });
          setLoading(false);
          return;
        }
        setUser(currentUser);
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดไม่คาดคิด", { duration: 3000 });
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("เกิดข้อผิดพลาดในการออกจากระบบ", { duration: 3000 });
    else {
      toast.success("ออกจากระบบสำเร็จ!", { duration: 3000 });
      router.push("/login-page");
    }
  };

  if (loading) return <p className="p-6 text-center text-green-700">กำลังโหลดข้อมูล...</p>;

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: "url('/img/home01.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Toaster position="top-right" />
      <main className="container mx-auto max-w-3xl mt-6 p-6 bg-white bg-opacity-90 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">โปรไฟล์ผู้ใช้</h2>
        {user ? (
          <div className="space-y-4">
            <p><span className="font-semibold">อีเมล:</span> {user.email}</p>
            <p><span className="font-semibold">สถานะผู้ใช้:</span> {user.email_confirmed_at ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน"}</p>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                onClick={() => toast("ฟีเจอร์แก้ไขโปรไฟล์ยังไม่เปิดใช้งาน", { duration: 3000 })}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-teal-600 transition"
              >
                แก้ไขโปรไฟล์
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 border border-green-600 text-green-700 rounded-lg hover:bg-green-100 transition"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600 mt-4">ไม่พบผู้ใช้</p>
        )}
      </main>

      <footer className="bg-green-50 text-green-800 py-8 mt-auto rounded-t-2xl">
        <div className="container mx-auto px-4 text-center">
          <p className="text-green-600 text-sm">© 2025 Tax Advisor WebApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
