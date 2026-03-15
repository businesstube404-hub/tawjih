"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"

function RegisterForm() {
  const router = useRouter()
  const params = useSearchParams()
  const refCode = params.get("ref") || ""

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [inviteCode, setInviteCode] = useState(refCode)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, inviteCode }),
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
        <h1 className="text-2xl font-black text-center text-[#0b3b6f] mb-2">إنشاء حساب جديد</h1>
        <p className="text-center text-sm text-gray-500 mb-6">انضم لآلاف الطلاب وابدأ رحلة التفوق.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-bold text-sm mb-1 text-[#0b3b6f]">الاسم الكامل</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="محمد أحمد العلي"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b3b6f] transition"
            />
          </div>
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
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="6 أحرف على الأقل"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b3b6f] transition"
            />
          </div>
          <div>
            <label className="block font-bold text-sm mb-1 text-[#0b3b6f]">
              كود الدعوة <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              placeholder="أدخل كود الدعوة إن وجد"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b3b6f] transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3B6E47] text-white font-black rounded-xl py-3 mt-2 hover:bg-[#2d5537] transition disabled:opacity-60"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب والبدء"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="text-[#0b3b6f] font-bold hover:underline">
            سجّل الدخول
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
