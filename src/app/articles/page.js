"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArticlesPage() {

  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
const articles = [
  {
    title: "ความรู้พื้นฐานเกี่ยวกับภาษีเงินได้บุคคลธรรมดา",
    excerpt: "ภาษีเงินได้บุคคลธรรมดา คือภาษีที่ผู้มีรายได้ต้องชำระตามกฎหมาย โดยคิดจากรายได้สุทธิหลังหักค่าใช้จ่ายและค่าลดหย่อน...",
    link: "intro-to-income-tax",
  },
  {
    title: "สิทธิประโยชน์จากค่าลดหย่อนภาษี",
    excerpt: "ค่าลดหย่อนช่วยลดฐานภาษี เช่น ค่าลดหย่อนส่วนตัว 60,000 บาท เบี้ยประกันชีวิต บิดามารดา และเงินบริจาค...",
    link: "tax-deductions-benefits",
  },
  {
    title: "กำหนดการยื่นภาษีประจำปี",
    excerpt: "ผู้มีรายได้ต้องยื่นแบบแสดงรายการภาษี (ภ.ง.ด.90/91) ตั้งแต่เดือนมกราคมถึงมีนาคมของปีถัดไป...",
    link: "tax-filing-deadline",
  },
  {
    title: "วิธีคำนวณภาษีขั้นบันได",
    excerpt: "อัตราภาษีบุคคลธรรมดาจะถูกคำนวณตามขั้นบันได เช่น รายได้สุทธิ 0-150,000 บาท ได้รับการยกเว้น 150,001-300,000 บาท เสียภาษี 5% เป็นต้น...",
    link: "progressive-tax-calculation",
  },
];


  return (
    <div
      className="relative text-green-900 flex flex-col min-h-screen"
      style={{
        backgroundImage: "url('/img/home01.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >


      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-5xl mt-6 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-green-700 mb-6">บทความความรู้เรื่องภาษี</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article, idx) => (
            <div
              key={idx}
              className="p-6 bg-green-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-lg font-bold text-green-700">{article.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{article.excerpt}</p>
<button
  className="mt-4 text-green-600 font-medium hover:underline"
  onClick={() => router.push(`/articles/${article.link}`)}
>
  อ่านต่อ →
</button>

            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-50 text-green-800 py-8 rounded-t-2xl mt-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center max-w-7xl space-y-4 md:space-y-0 text-center">
          <div className="text-2xl font-bold flex items-center text-green-600">
            <span className="mr-1">C</span>
            <span>Advisor</span>
          </div>
          <p className="text-green-600 text-sm">© 2025 Tax Advisor WebApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
