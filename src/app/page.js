'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';






export default function Home() {
  const router = useRouter();


  // โหลดสถานะล็อกอินจาก localStorage เมื่อโหลดหน้า
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") setIsLoggedIn(true);
  }, []);



  return (
    <div className="bg-gray-50">
      {/* Header */}


      {/* Hero */}
      <section
        className="relative text-white py-20 md:py-32 text-center rounded-b-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/img/home01.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b "></div>
        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <h1 className="text-black text-xl md:text-5xl font-extrabold leading-tight mb-0 drop-shadow-lg">
          แทบทุกคนผู้ช่วยภาษีที่ทำให้การคำนวณง่ายรวดเร็วและไม่ซับซ้อน
          </h1>
          <p className="text-black text-lg md:text-1xl mb-10 opacity-90 font-medium drop-shadow">
            ไม่ต้องกังวลเรื่องการยื่นภาษีอีกต่อไป ระบบของเราช่วยคำนวณและแนะนำสิทธิประโยชน์ที่คุณควรได้รับแบบอัตโนมัติ
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
        onClick={() => router.push("/chat-page")}
        className="text-black px-10 py-4 bg-white-500 rounded-full font-bold shadow-xl hover:bg-teal-600 transition-colors text-lg"
      >
        เริ่มใช้งาน
      </button>
     
            <button  onClick={() => router.push("/articles")} className="text-black px-10 bg-white py-4 bg-green-c  rounded-full font-bold shadow-xl hover:bg-teal-600 transition-colors text-lg">
              เรียนรู้เพิ่มเติม
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white py-16 md:py-24 text-center rounded-b-2xl">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-green-c">ภาษีควรเป็นเรื่องง่าย</h2>
          <p className="text-gray-800 text-lg mb-4">
            C-Advisor เกิดจากความปรารถนาที่จะปฏิรูปกฎหมายภาษี...
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#d7f9f3] py-16 md:py-24 rounded-b-2xl">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Card 1 */}
          <div
            className="rounded-2xl shadow-xl p-8 flex items-center min-h-[260px] relative overflow-hidden"
            style={{
              backgroundImage: "url('/img/box1.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black/60 rounded-2xl z-0"></div>
            <div className="relative z-10 flex-1 text-center md:text-left text-white drop-shadow-lg">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">ที่ปรึกษาการเงินส่วนตัวของคุณ</h3>
              <p className="mb-6 text-base md:text-lg font-medium">
                C-Advisor ไม่เพียงแค่เป็นแอปพลิเคชันที่...
              </p>
              <button onClick={() => router.push("/chat-page")} className="bg-green-c text-white px-8 py-3 rounded-full font-bold hover:bg-teal-600 transition-colors shadow-lg">
                เริ่มต้นใช้งาน
              </button>
            </div>
          </div>
          {/* Card 2 */}
          <div
            className="rounded-2xl shadow-xl p-8 flex items-center min-h-[260px] relative overflow-hidden"
            style={{
              backgroundImage: "url('/img/box2.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black/60 rounded-2xl z-0"></div>
            <div className="relative z-10 flex-1 text-center md:text-left text-white drop-shadow-lg">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">คำนวณภาษีอัตโนมัติและรวดเร็ว</h3>
              <p className="mb-6 text-base md:text-lg font-medium">
                คำนวณและวางแผนภาษีได้อย่างแม่นยำ
              </p>
              <button
                onClick={() => router.push("/calculator")}
                className="bg-green-c text-white px-8 py-3 rounded-full font-bold hover:bg-teal-600 transition-colors shadow-lg"
              >
                คำนวณ
              </button>
            </div>
          </div>
          {/* Card 3 */}
          <div
            className="rounded-2xl shadow-xl p-8 flex items-center min-h-[260px] relative overflow-hidden"
            style={{
              backgroundImage: "url('/img/box3.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black/60 rounded-2xl z-0"></div>
            <div className="relative z-10 flex-1 text-center md:text-left text-white drop-shadow-lg">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">ข่าวภาษี</h3>
              <p className="mb-6 text-base md:text-lg font-medium">
                ติดตามข่าวสารและความเคลื่อนไหวด้านภาษี...
              </p>
              <button className="bg-green-c text-white px-8 py-3 rounded-full font-bold hover:bg-teal-600 transition-colors shadow-lg">
                อ่านข่าว
              </button>
            </div>
          </div>
          {/* Card 4 */}
          <div
            className="rounded-2xl shadow-xl p-8 flex items-center min-h-[260px] relative overflow-hidden"
            style={{
              backgroundImage: "url('/img/box4.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black/60 rounded-2xl z-0"></div>
            <div className="relative z-10 flex-1 text-center md:text-left text-white drop-shadow-lg">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">ความรู้ภาษี</h3>
              <p className="mb-6 text-base md:text-lg font-medium">
                แหล่งรวมบทความความรู้เกี่ยวกับภาษี...
              </p>
              <button onClick={() => router.push("/articles")} className="bg-green-c text-white px-8 py-3 rounded-full font-bold hover:bg-teal-600 transition-colors shadow-lg">
                เริ่มอ่าน
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-50 text-green-800 py-8 rounded-t-2xl mt-10">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
          <div className="text-2xl font-bold flex items-center text-green-600">
            <span className="mr-1">C</span>
            <span>Advisor</span>
          </div>
          <p className="text-green-600 text-sm">© 2025 Tax Advisor WebApp. All rights reserved.</p>
        </div>
      </footer>

      {/* Hero Background Style */}
      <style jsx>{`
        .hero-bg-img {
          background: url('/home01.jpg') center center / cover no-repeat;
          position: relative;
        }
      `}</style>
    </div>
  );
}
