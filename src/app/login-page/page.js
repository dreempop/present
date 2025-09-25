'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 👉 ถ้ามี session อยู่แล้วให้เด้งไปหน้า Home
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.push("/");
      }
    };
    checkSession();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let error;
    // รองรับทั้ง v1 และ v2
    if (supabase.auth.signInWithPassword) {
      // v2
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    } else {
      // v1
      ({ error } = await supabase.auth.signIn({ email, password }));
    }

    if (error) {
      setError("❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/"); // เข้าหน้า Home
    }

    setLoading(false);
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
        <h1 className="text-2xl font-bold text-white">C-Advisor</h1>
      </div>

      {/* Login Box */}
      <form
        className="bg-white bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Remember me */}
        <div className="flex items-center mb-6">
          <input type="checkbox" id="remember" className="mr-2" />
          <label htmlFor="remember" className="text-gray-700 text-sm">จดจำฉันไว้</label>
        </div>

        {/* Error */}
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          disabled={loading}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
