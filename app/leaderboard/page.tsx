"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Player {
  id: number
  name: string
  points: number
  questions_solved: number
  exams_completed: number
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(d => setPlayers(d.leaderboard || []))
      .catch(() => {})
  }, [])

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-black text-[#0b3b6f] mb-2">لوحة الشرف - أفضل الطلاب</h1>
          <p className="text-gray-500 font-bold">قائمة أفضل 10 طلاب حسب النقاط الأعلى</p>
        </div>

        {/* Top 3 podium */}
        {players.length >= 3 && (
          <div className="flex items-end justify-center gap-6 mb-16">
            
            {/* 2nd place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-2xl font-black mb-2 shadow-lg">
                {players[1]?.name.charAt(0)}
              </div>
              <div className="bg-white rounded-2xl shadow-xl px-6 py-8 w-40 text-center border-t-4 border-gray-300">
                <div className="text-3xl mb-1">🥈</div>
                <div className="font-black text-sm text-[#0b3b6f] mb-1">{players[1]?.name}</div>
                <div className="text-2xl font-black text-gray-400 mb-1">{players[1]?.points}</div>
                <div className="text-xs text-gray-500 font-bold">نقطة</div>
              </div>
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center -mt-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white text-3xl font-black mb-2 shadow-2xl animate-pulse">
                {players[0]?.name.charAt(0)}
              </div>
              <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-48 text-center border-t-4 border-yellow-400">
                <div className="text-4xl mb-2">👑</div>
                <div className="font-black text-base text-[#0b3b6f] mb-1">{players[0]?.name}</div>
                <div className="text-3xl font-black text-yellow-500 mb-1">{players[0]?.points}</div>
                <div className="text-xs text-gray-500 font-bold">نقطة</div>
              </div>
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white text-2xl font-black mb-2 shadow-lg">
                {players[2]?.name.charAt(0)}
              </div>
              <div className="bg-white rounded-2xl shadow-xl px-6 py-8 w-40 text-center border-t-4 border-amber-600">
                <div className="text-3xl mb-1">🥉</div>
                <div className="font-black text-sm text-[#0b3b6f] mb-1">{players[2]?.name}</div>
                <div className="text-2xl font-black text-amber-600 mb-1">{players[2]?.points}</div>
                <div className="text-xs text-gray-500 font-bold">نقطة</div>
              </div>
            </div>
          </div>
        )}

        {/* Remaining players (4-10) */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#0b3b6f] text-white p-4 font-black text-center">باقي المراكز</div>
          <ul className="divide-y divide-gray-100">
            {players.slice(3).map((p, idx) => (
              <li key={p.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3B6E47] flex items-center justify-center text-white text-lg font-black shadow">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-[#0b3b6f]">{p.name}</div>
                    <div className="text-xs text-gray-500 font-bold">
                      {p.questions_solved} سؤال · {p.exams_completed} اختبار
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#3B6E47]">{p.points}</div>
                    <div className="text-xs text-gray-500 font-bold">نقطة</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-black text-sm">
                    #{idx + 4}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {players.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-gray-400 font-bold">لا يوجد طلاب في لوحة الشرف بعد</div>
          </div>
        )}

      </main>
      <Footer />
    </>
  )
}
