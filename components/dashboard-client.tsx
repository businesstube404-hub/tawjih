"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  invite_code: string
  points: number
  questions_solved: number
  exams_completed: number
  streak_days: number
}

interface Notification {
  id: number
  message: string
  is_read: boolean
  created_at: string
}

interface Achievement {
  key: string
  name_ar: string
  description_ar: string
  icon: string
  earned_at: string
}

export default function DashboardClient({
  user,
  notifications,
  achievements,
}: {
  user: User
  notifications: Notification[]
  achievements: Achievement[]
}) {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  const [copied, setCopied] = useState(false)
  const inviteLink = `${typeof window !== "undefined" ? window.location.origin : "https://toquiz.online"}/auth/register?ref=${user.invite_code}`

  function copyInvite() {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">

      {/* Header card */}
      <div className="bg-gradient-to-br from-[#0b3b6f] to-[#07254a] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#3B6E47] flex items-center justify-center text-2xl font-black shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-black text-xl">{user.name}</div>
            <div className="text-blue-200 text-sm">{user.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/80 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition"
        >
          تسجيل الخروج
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "النقاط", value: user.points, icon: "⭐", color: "#eab308" },
          { label: "الأسئلة المحلولة", value: user.questions_solved, icon: "📋", color: "#3B6E47" },
          { label: "الاختبارات", value: user.exams_completed, icon: "📝", color: "#0b3b6f" },
          { label: "أيام متواصلة", value: user.streak_days, icon: "🔥", color: "#e11d48" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow p-5 text-center" style={{ borderBottom: `4px solid ${s.color}` }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 font-bold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "ابدأ اختباراً", href: "/subjects", bg: "#3B6E47", icon: "▶️" },
          { label: "أفضل طالب", href: "/leaderboard", bg: "#0b3b6f", icon: "🏆" },
          { label: "الإنجازات", href: "/achievements", bg: "#eab308", icon: "🎖️" },
        ].map(a => (
          <Link
            key={a.label}
            href={a.href}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-sm hover:opacity-90 transition hover:-translate-y-0.5 shadow"
            style={{ background: a.bg }}
          >
            {a.icon} {a.label}
          </Link>
        ))}
      </div>

      {/* Invite section */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="font-black text-[#0b3b6f] text-lg mb-1">رابط دعوتك الخاص</h2>
        <p className="text-sm text-gray-500 mb-4">
          شارك هذا الرابط مع أصدقائك. عند تسجيلهم ستحصل على <strong className="text-[#3B6E47]">100 نقطة</strong> لكل صديق!
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={`/auth/register?ref=${user.invite_code}`}
            className="flex-1 bg-[#f4f7f6] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none"
          />
          <button
            onClick={copyInvite}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition flex-shrink-0 ${
              copied ? "bg-[#0b3b6f] text-white" : "bg-[#3B6E47] hover:bg-[#2d5537] text-white"
            }`}
          >
            {copied ? "تم النسخ ✓" : "نسخ"}
          </button>
        </div>
      </div>

      {/* Recent achievements */}
      {achievements.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-black text-[#0b3b6f] text-lg mb-4">آخر الإنجازات</h2>
          <div className="flex flex-col gap-3">
            {achievements.slice(0, 3).map(a => (
              <div key={a.key} className="flex items-center gap-3 bg-[#f4f7f6] rounded-xl p-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-lg">🏅</div>
                <div>
                  <div className="font-black text-sm text-[#0b3b6f]">{a.name_ar}</div>
                  <div className="text-xs text-gray-500">{a.description_ar}</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/achievements" className="text-sm text-[#3B6E47] font-bold mt-3 inline-block hover:underline">
            عرض جميع الإنجازات →
          </Link>
        </div>
      )}

      {/* Recent notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-black text-[#0b3b6f] text-lg mb-4">آخر الإشعارات</h2>
          <div className="flex flex-col gap-3">
            {notifications.map(n => (
              <div key={n.id} className={`p-3 rounded-xl text-sm ${!n.is_read ? "bg-blue-50 border border-blue-100" : "bg-[#f4f7f6]"}`}>
                <p className="text-gray-700">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleDateString("ar-JO")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  )
}
