'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // ปิดการส่ง email ยืนยัน
          data: { phone },
        },
      });

      if (error) {
        setError(error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      } else {
        setSuccess("สมัครสมาชิกสำเร็จ! สามารถล็อกอินได้ทันที");
        setEmail("");
        setPassword("");
        setPhone("");
      }
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/img/home01.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <img src="/logo.png" alt="C-Advisor Logo" className="h-16 mb-2" />
      </div>

      {/* Register Box */}
      <form
        className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6">สมัครสมาชิก</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="Phone"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-center">{success}</div>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          disabled={loading}
        >
          {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>
      </form>
    </div>
  );
}
