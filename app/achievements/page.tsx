"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Achievement {
  key: string
  name_ar: string
  description_ar: string
  icon: string
  points_reward: number
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [earned, setEarned] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/achievements")
      .then(r => r.json())
      .then(d => {
        setAchievements(d.achievements || [])
        setEarned(d.earned || [])
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🎖️</div>
          <h1 className="text-3xl font-black text-[#0b3b6f] mb-2">الإنجازات والجوائز</h1>
          <p className="text-gray-500 font-bold">
            حصلت على <strong className="text-[#3B6E47]">{earned.length}</strong> من أصل <strong>{achievements.length}</strong> إنجاز
          </p>
        </div>

        {/* Achievements grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map(a => {
            const isEarned = earned.includes(a.key)
            return (
              <div
                key={a.key}
                className={`rounded-2xl shadow-lg overflow-hidden transition hover:-translate-y-1 ${
                  isEarned 
                    ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400" 
                    : "bg-white border-2 border-gray-200 opacity-60"
                }`}
              >
                <div className={`p-6 text-center ${isEarned ? "bg-yellow-400" : "bg-gray-100"}`}>
                  <div className="text-5xl mb-2">
                    {isEarned ? "🏅" : "🔒"}
                  </div>
                  <div className={`text-xs font-bold ${isEarned ? "text-yellow-900" : "text-gray-400"}`}>
                    {isEarned ? "مكتمل" : "غير مكتمل"}
                  </div>
                </div>
                <div className="p-6">
                  <div className="font-black text-lg text-[#0b3b6f] mb-2">{a.name_ar}</div>
                  <p className="text-sm text-gray-600 font-bold mb-4">{a.description_ar}</p>
                  <div className="flex items-center justify-between">
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                      isEarned 
                        ? "bg-[#3B6E47] text-white" 
                        : "bg-gray-200 text-gray-400"
                    }`}>
                      +{a.points_reward} نقطة
                    </div>
                    <span className={`text-2xl ${isEarned ? "opacity-100" : "opacity-30"}`}>
                      {isEarned ? "🏅" : "🔒"}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <div className="text-gray-400 font-bold">جاري تحميل الإنجازات...</div>
          </div>
        )}

      </main>
      <Footer />
    </>
  )
}
