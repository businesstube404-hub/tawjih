"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("حدث خطأ، يرجى المحاولة مرة أخرى")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-14%20at%2014.36.35-atfXaoljG3MULws4WovcuHpi6Ibr6R.jpeg"
            alt="شعار ToQuiz"
            width={90}
            height={90}
            className="rounded-xl"
          />
        </div>
        <h1 className="text-2xl font-black text-center text-[#0b3b6f] mb-2">تسجيل الدخول</h1>
        <p className="text-center text-sm text-gray-500 mb-6">أهلاً بعودتك! سجّل دخولك لمتابعة مسيرتك.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-bold text-sm mb-1 text-[#0b3b6f]">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b3b6f] transition"
            />
          </div>
          <div>
            <label className="block font-bold text-sm mb-1 text-[#0b3b6f]">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b3b6f] transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0b3b6f] text-white font-black rounded-xl py-3 mt-2 hover:bg-[#07254a] transition disabled:opacity-60"
          >
            {loading ? "جاري الدخول..." : "دخول المنصة"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ليس لديك حساب؟{" "}
          <Link href="/auth/register" className="text-[#3B6E47] font-bold hover:underline">
            سجّل الآن
          </Link>
        </p>
      </div>
    </div>
  )
}
