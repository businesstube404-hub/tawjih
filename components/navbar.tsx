"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  invite_code: string
  points: number
}

interface Notification {
  id: number
  message: string
  is_read: boolean
  created_at: string
}

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => setUser(d.user))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) return
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => {
        setNotifications(d.notifications || [])
        setUnread((d.notifications || []).filter((n: Notification) => !n.is_read).length)
      })
      .catch(() => {})
  }, [user])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/")
    router.refresh()
  }

  async function openNotif() {
    setNotifOpen(v => !v)
    if (unread > 0) {
      await fetch("/api/notifications", { method: "POST" })
      setUnread(0)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    }
  }

  const handleLogoClick = () => {
    if (user) router.push("/dashboard")
    else router.push("/auth/login")
  }

  const navLinks = [
    { label: "الرئيسية", href: "/" },
    { label: "المواد", href: "/subjects" },
    { label: "نصائح وأدعية", href: "/tips" },
    { label: "أفضل طالب", href: "/leaderboard" },
    { label: "الإنجازات", href: "/achievements" },
    { label: "دعوة الأصدقاء", href: "/invite" },
  ]

  return (
    <header className="bg-[#0b3b6f] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <button onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-0.5 flex-shrink-0 shadow">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-14%20at%2014.36.35-atfXaoljG3MULws4WovcuHpi6Ibr6R.jpeg"
              alt="شعار ToQuiz"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-right">
            <div className="font-black text-lg leading-none">ToQuiz</div>
            <div className="text-xs text-blue-200">لجيل 2009 و 2010</div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-lg text-sm font-bold hover:bg-white/10 transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">

          {/* Notifications bell */}
          {user && (
            <div className="relative">
              <button
                onClick={openNotif}
                className="relative p-2 rounded-lg hover:bg-white/10 transition"
                aria-label="الإشعارات"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unread > 0 && (
                  <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="bg-[#0b3b6f] text-white px-4 py-3 font-black text-sm">الإشعارات</div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-400 text-sm">لا توجد إشعارات</div>
                  ) : (
                    <ul className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifications.map(n => (
                        <li
                          key={n.id}
                          className={`px-4 py-3 text-sm text-[#111] ${!n.is_read ? "bg-blue-50" : ""}`}
                        >
                          {n.message}
                          <div className="text-xs text-gray-400 mt-0.5">
                            {new Date(n.created_at).toLocaleDateString("ar-JO")}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User / Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition text-sm font-bold"
              >
                <span className="w-6 h-6 rounded-full bg-[#3B6E47] flex items-center justify-center text-xs font-black">
                  {user.name.charAt(0)}
                </span>
                <span className="max-w-24 truncate">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs bg-red-500/80 hover:bg-red-600 px-3 py-1.5 rounded-lg font-bold transition"
              >
                خروج
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-[#3B6E47] hover:bg-[#2d5537] text-white px-4 py-2 rounded-lg font-bold text-sm transition"
            >
              تسجيل الدخول
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="القائمة"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#07254a] border-t border-white/10">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 rounded-lg text-sm font-bold hover:bg-white/10 transition text-right"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-bold hover:bg-white/10 transition text-right border-t border-white/10 mt-1 pt-2">
                  حسابي ({user.points} نقطة)
                </Link>
                <button onClick={handleLogout} className="px-3 py-3 text-right text-sm font-bold text-red-300 hover:bg-white/10 rounded-lg transition">
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-bold bg-[#3B6E47] text-center mt-2">
                تسجيل الدخول
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
