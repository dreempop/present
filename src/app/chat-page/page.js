"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ ดึง user จาก Supabase
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });
  }, []);

  // ✅ โหลดประวัติแชทเมื่อ user พร้อม
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      const res = await fetch(`/api/get-chat?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setMessages(
          data.history.map((m) => ({
            id: m.id,
            sender: m.sender,
            text: m.message,
          }))
        );
      }
    };
    fetchHistory();
  }, [user]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const handleSend = async (msg = null) => {
    if (!user) return alert("กรุณาล็อกอินก่อนใช้งาน");

    const userMessage = msg ?? input.trim();
    if (!userMessage) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: userMessage },
    ]);
    setInput("");
    setIsBotTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      const botReply = data.reply;

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "bot", text: botReply },
      ]);

      // ✅ บันทึก user + bot ลง DB
      await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          { user_id: user.id, sender: "user", message: userMessage },
          { user_id: user.id, sender: "bot", message: botReply },
        ]),
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: "เกิดข้อผิดพลาด ลองใหม่อีกครั้งครับ",
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

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
      <main className="flex-1 container mx-auto max-w-4xl mt-6 p-6 bg-white rounded-xl shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          แชทบอทที่ปรึกษาภาษี
        </h2>

        {/* Chat messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto border rounded-lg bg-green-50">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              เริ่มแชทกับเราได้เลย!
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.sender === "user"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isBotTyping && (
            <p className="text-sm text-gray-400">กำลังพิมพ์...</p>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input box */}
        <div className="p-4 border-t flex space-x-2 mt-4">
          <input
            type="text"
            placeholder="พิมพ์ข้อความ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={() => handleSend()}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            ส่ง
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-50 text-green-800 py-8 rounded-t-2xl mt-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center max-w-7xl space-y-4 md:space-y-0 text-center">
          <div className="text-2xl font-bold flex items-center text-green-600">
            <span className="mr-1">C</span>
            <span>Advisor</span>
          </div>
          <p className="text-green-600 text-sm">
            © 2025 Tax Advisor WebApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
