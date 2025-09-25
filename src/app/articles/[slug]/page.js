"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const articleData = {
  "intro-to-income-tax": {
    title: "ความรู้พื้นฐานเกี่ยวกับภาษีเงินได้บุคคลธรรมดา",
    content: `
ภาษีเงินได้บุคคลธรรมดา คือภาษีที่ผู้มีรายได้ต้องชำระตามกฎหมาย โดยคิดจากรายได้สุทธิหลังหักค่าใช้จ่ายและค่าลดหย่อนตามที่กฎหมายกำหนด...

ตัวอย่างรายได้ เช่น เงินเดือน ค่าจ้าง โบนัส ฯลฯ

ผู้มีรายได้ต้องยื่นแบบแสดงรายการภาษี ภ.ง.ด.90 หรือ 91 ขึ้นอยู่กับประเภทของรายได้
    `,
  },
  "tax-deductions-benefits": {
    title: "สิทธิประโยชน์จากค่าลดหย่อนภาษี",
    content: `
ค่าลดหย่อนเป็นตัวช่วยลดฐานภาษี เช่น:
- ค่าลดหย่อนส่วนตัว 60,000 บาท
- เบี้ยประกันชีวิตสูงสุด 100,000 บาท
- เงินบริจาคสูงสุด 10% ของรายได้หลังหักค่าใช้จ่ายและค่าลดหย่อน
    `,
  },
  "tax-filing-deadline": {
    title: "กำหนดการยื่นภาษีประจำปี",
    content: `
การยื่นภาษีประจำปีต้องดำเนินการตั้งแต่เดือนมกราคมถึงมีนาคมของปีถัดไป

ยื่นผ่านเว็บไซต์กรมสรรพากรได้ที่ www.rd.go.th เพื่อความสะดวกรวดเร็ว
    `,
  },
  "progressive-tax-calculation": {
    title: "วิธีคำนวณภาษีขั้นบันได",
    content: `
ระบบภาษีเงินได้บุคคลธรรมดาใช้วิธีขั้นบันได ดังนี้:
- รายได้ 0 - 150,000 บาท: ยกเว้นภาษี
- 150,001 - 300,000 บาท: เสียภาษี 5%
- 300,001 - 500,000 บาท: เสียภาษี 10%
... สูงสุดถึง 35%
    `,
  },
};

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const article = articleData[slug];

  useEffect(() => {
    if (!article) {
      router.push("/articles");
    }
  }, [article]);

  if (!article) return null;

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
        <h1 className="text-2xl font-bold text-green-700 mb-4">{article.title}</h1>
        <p className="whitespace-pre-line text-gray-800 text-base leading-relaxed">
          {article.content}
        </p>
        <button
          className="mt-6 text-green-600 font-medium hover:underline"
          onClick={() => router.back()}
        >
          ← กลับหน้าบทความ
        </button>
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
