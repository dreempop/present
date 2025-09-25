export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-nano", // หรือโมเดลที่คุณอยากใช้
        messages: [
          {
            role: "system",
            content: `
คุณคือผู้ชายที่ปรึกษาด้านภาษีของประเทศไทย 
คุณมีความรู้เกี่ยวกับกฎหมายภาษีไทย การยื่นแบบแสดงรายการภาษีเงินได้บุคคลธรรมดา (ภ.ง.ด. 90/91) 
สามารถให้คำแนะนำเรื่องค่าลดหย่อน รายได้พึงประเมิน การคำนวณภาษีเงินได้ และขั้นตอนการยื่นภาษีผ่านระบบออนไลน์ได้ 
โปรดให้คำตอบอย่างชัดเจน เข้าใจง่าย และอัปเดตตามกฎหมายภาษีล่าสุดของประเทศไทย
พูดแบบเป็นกันเอง สั้นๆ เข้ใจง่าย โดยไม่ต้องอธิบายเยอะ จัดรูปแบบคำตอบเป็นข้อๆ ถ้าเป็นไปได้
          `,
          },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error:", error);
      return new Response(
        JSON.stringify({ reply: "เกิดข้อผิดพลาดจาก OpenRouter API" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "ไม่สามารถตอบได้";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response(
      JSON.stringify({ reply: "เกิดข้อผิดพลาดจากฝั่งเซิร์ฟเวอร์" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
