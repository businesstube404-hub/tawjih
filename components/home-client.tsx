"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const SUBJECTS = [
  { id: "math",    name: "رياضيات",        icon: "🧮" },
  { id: "arabic",  name: "لغة عربية",      icon: "📖" },
  { id: "deen",    name: "تربية إسلامية",  icon: "🕌" },
  { id: "history", name: "تاريخ الأردن",   icon: "🏛️" },
  { id: "english", name: "لغة إنجليزية",   icon: "🔤" },
  { id: "science", name: "علوم",           icon: "🔬" },
  { id: "bio",     name: "أحياء",          icon: "🧬" },
  { id: "chem",    name: "كيمياء",         icon: "⚗️" },
]

const TESTIMONIALS = [
  { name: "أحمد خالد", stars: 5, text: "الموقع ساعدني كثيرًا في فهم نمط أسئلة الوزارة، التصميم مريح والمحاكاة حقيقية." },
  { name: "سارة محمود", stars: 5, text: "أفضل موقع لحل أسئلة التوجيهي بطريقة سهلة. التحديث التلقائي رهيب!" },
  { name: "عمر الفاروق", stars: 5, text: "النصائح والأدعية الموجودة بتعطي طاقة إيجابية وبتبعد التوتر قبل الامتحان." },
  { name: "ليان عبدالله", stars: 5, text: "تجربة الاختبار الوزاري مع العداد ممتازة جداً خلتني أتعود على ضغط الوقت." },
  { name: "يوسف علي",    stars: 5, text: "شكراً لمنصة ToQuiz، كنت خايف من مادة التاريخ بس بنك الأسئلة شمل كل الأفكار." },
  { name: "دانا زيدان",  stars: 4, text: "المنصة سهلة الاستخدام وتصميمها مريح للعين أثناء الدراسة لساعات طويلة." },
]

function Countdown() {
  const [time, setTime] = useState({ days: "00", hours: "00", mins: "00" })

  useEffect(() => {
    const examDate = new Date("June 20, 2026 00:00:00").getTime()
    function tick() {
      const dist = examDate - Date.now()
      if (dist < 0) return
      setTime({
        days:  String(Math.floor(dist / 86400000)).padStart(2, "0"),
        hours: String(Math.floor((dist % 86400000) / 3600000)).padStart(2, "0"),
        mins:  String(Math.floor((dist % 3600000) / 60000)).padStart(2, "0"),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-gradient-to-br from-[#0b3b6f] to-[#07254a] text-white rounded-2xl p-6 text-center shadow-lg">
      <h2 className="text-xl font-black mb-1">كم بقي للامتحان الوزاري؟</h2>
      <p className="text-sm text-blue-200 mb-4">استغل كل دقيقة قبل الامتحان</p>
      <div className="flex justify-center gap-4">
        {[{ v: time.days, l: "يوم" }, { v: time.hours, l: "ساعة" }, { v: time.mins, l: "دقيقة" }].map(({ v, l }) => (
          <div key={l} className="bg-white/10 backdrop-blur px-5 py-4 rounded-xl min-w-[70px]">
            <span className="block text-3xl font-black">{v}</span>
            <small className="text-blue-200 text-xs">{l}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomeClient() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-10">

      {/* Countdown */}
      <Countdown />

      {/* Stats */}
      <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-3 gap-4 text-center border-b-4 border-[#3B6E47]">
        {[
          { icon: "👥", value: "500+", label: "طالب طموح" },
          { icon: "📋", value: "1,200+", label: "سؤال وزاري" },
          { icon: "⏱️", value: "50+", label: "امتحان شامل" },
        ].map(s => (
          <div key={s.label}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-[#3B6E47]">{s.value}</div>
            <div className="text-xs text-gray-500 font-bold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Subjects */}
      <section>
        <h2 className="text-xl font-black text-[#0b3b6f] mb-4 border-r-4 border-[#3B6E47] pr-3">
          اختر المادة وابدأ التحدي
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SUBJECTS.map(sub => (
            <Link
              key={sub.id}
              href={`/exam?subject=${sub.id}&name=${encodeURIComponent(sub.name)}`}
              className="bg-white rounded-2xl p-5 text-center hover:border-[#3B6E47] border-2 border-transparent shadow hover:shadow-md transition hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-4xl mb-2">{sub.icon}</div>
              <div className="font-black text-[#0b3b6f] text-sm">{sub.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why ToQuiz */}
      <section>
        <h2 className="text-xl font-black text-[#0b3b6f] mb-4 border-r-4 border-[#3B6E47] pr-3">
          لماذا ToQuiz خيارك الأول؟
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { color: "#eab308", icon: "⚡", title: "تصحيح فوري وذكي", desc: "اعرف نتيجتك في أقل من ثانية مع تحليل دقيق لإجاباتك." },
            { color: "#e11d48", icon: "🛡️", title: "محاكاة وزارية دقيقة", desc: "عش جو الامتحان الحقيقي مع عداد الوقت وأنماط الأسئلة المعتمدة." },
            { color: "#3B6E47", icon: "🤲", title: "نصائح وأدعية للنجاح", desc: "قسم خاص لدعمك بالأدعية والنصائح الذهبية للتفوق." },
          ].map(c => (
            <div
              key={c.title}
              className="bg-white rounded-2xl p-6 text-center shadow hover:-translate-y-1 transition"
              style={{ borderBottom: `4px solid ${c.color}` }}
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-black text-[#0b3b6f] text-base mb-2">{c.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-xl font-black text-[#0b3b6f] mb-4 border-r-4 border-[#3B6E47] pr-3">
          ماذا يقول الطلاب عنا؟
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white rounded-2xl p-5 shadow border-r-4 border-[#0b3b6f]">
              <div className="flex justify-between items-center mb-2">
                <span className="font-black text-[#0b3b6f] text-sm">{t.name}</span>
                <span className="text-yellow-400 text-sm">{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</span>
              </div>
              <p className="text-sm text-gray-500 italic leading-relaxed">{`"${t.text}"`}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-br from-[#0b3b6f] to-[#07254a] rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-black mb-2">ابدأ تدريبك الآن</h2>
        <p className="text-blue-200 text-sm mb-5">انضم لمئات الطلاب الذين يستعدون للامتحان الوزاري</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/subjects" className="bg-[#3B6E47] hover:bg-[#2d5537] text-white px-6 py-3 rounded-xl font-black transition text-sm">
            ابدأ الاختبار
          </Link>
          <Link href="/tips" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-black transition text-sm">
            نصائح وأدعية
          </Link>
        </div>
      </div>

    </main>
  )
}
