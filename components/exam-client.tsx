"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

type Question = {
  id: number
  text: string
  options: string[]
  correct: number
}

const QUESTION_BANK: Record<string, Question[]> = {
  math: [
    { id: 1, text: "ما قيمة نهاية (س² - 4)/(س - 2) عندما س تؤول إلى 2؟", options: ["2", "4", "0", "غير موجودة"], correct: 1 },
    { id: 2, text: "إذا كان ق(س) = 3س²، فما المشتقة الأولى ق'(س)؟", options: ["6س", "3س", "6", "س³"], correct: 0 },
    { id: 3, text: "ما ناتج التكامل ∫2س دس؟", options: ["س² + ث", "2س² + ث", "س + ث", "2 + ث"], correct: 0 },
    { id: 4, text: "ما قيمة sin(90°)؟", options: ["0", "1", "-1", "0.5"], correct: 1 },
    { id: 5, text: "إذا كان ق(س) = س³، فما ق'(2)؟", options: ["6", "12", "8", "3"], correct: 1 },
  ],
  arabic: [
    { id: 6, text: "ما إعراب كلمة (السماء) في جملة: السماءُ صافيةٌ؟", options: ["خبر مرفوع", "مبتدأ مرفوع", "فاعل مرفوع", "مفعول به"], correct: 1 },
    { id: 7, text: "ما نوع الأسلوب في جملة: هل درستَ جيداً؟", options: ["استفهام", "نهي", "أمر", "تعجب"], correct: 0 },
    { id: 8, text: "أيُّ الكلمات التالية مصدر؟", options: ["كَتَبَ", "كِتابة", "كاتب", "مكتوب"], correct: 1 },
    { id: 9, text: "ما علامة جزم الفعل المضارع الصحيح الآخر؟", options: ["الفتحة", "الضمة", "السكون", "الكسرة"], correct: 2 },
    { id: 10, text: "ما المفعول به في: قرأَ الطالبُ الكتابَ؟", options: ["قرأ", "الطالب", "الكتاب", "لا يوجد"], correct: 2 },
  ],
  deen: [
    { id: 11, text: "كم عدد أركان الإسلام؟", options: ["4", "5", "6", "7"], correct: 1 },
    { id: 12, text: "ما عدد أركان الإيمان؟", options: ["4", "5", "6", "7"], correct: 2 },
    { id: 13, text: "ما الركن الأول من أركان الإسلام؟", options: ["الصلاة", "الصوم", "الشهادتان", "الحج"], correct: 2 },
    { id: 14, text: "كم عدد ركعات صلاة الفجر؟", options: ["1", "2", "3", "4"], correct: 1 },
    { id: 15, text: "في أي شهر فُرض الصيام؟", options: ["رجب", "شعبان", "رمضان", "شوال"], correct: 2 },
  ],
  history: [
    { id: 16, text: "في أي عام تأسست إمارة شرق الأردن؟", options: ["1921", "1946", "1956", "1916"], correct: 0 },
    { id: 17, text: "من هو مؤسس الدولة الأردنية الحديثة؟", options: ["الملك عبدالله الثاني", "الأمير عبدالله بن الحسين", "الملك الحسين", "الشريف حسين"], correct: 1 },
    { id: 18, text: "متى استقل الأردن رسمياً؟", options: ["1921", "1946", "1948", "1956"], correct: 1 },
    { id: 19, text: "ما اسم معاهدة السلام بين الأردن وإسرائيل؟", options: ["أوسلو", "وادي عربة", "كامب ديفيد", "مدريد"], correct: 1 },
    { id: 20, text: "في أي عام بدأت ثورة العرب الكبرى؟", options: ["1914", "1916", "1918", "1920"], correct: 1 },
  ],
}

const getQuestions = (subjectId: string): Question[] => {
  return QUESTION_BANK[subjectId] || QUESTION_BANK["math"]
}

type Phase = "setup" | "exam" | "result" | "review"

export default function ExamClient() {
  const params = useSearchParams()
  const router = useRouter()
  const subjectId = params.get("subject") || "math"
  const subjectName = params.get("name") || "الرياضيات"

  const [phase, setPhase] = useState<Phase>("setup")
  const [minutes, setMinutes] = useState(10)
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimed, setIsTimed] = useState(false)
  const [score, setScore] = useState(0)
  const [toastMsg, setToastMsg] = useState("")

  const finish = useCallback(async (qs: Question[], ans: (number | null)[]) => {
    const correct = qs.filter((q, i) => ans[i] === q.correct).length
    const pct = Math.round((correct / qs.length) * 100)
    setScore(pct)
    setPhase("result")

    // Save to backend
    try {
      const res = await fetch("/api/exam/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionsAnswered: qs.length, pointsEarned: correct * 10 }),
      })
      const data = await res.json()
      if (data.newAchievements?.length > 0) {
        setToastMsg("مبروك! حصلت على إنجاز جديد!")
        setTimeout(() => setToastMsg(""), 4000)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (phase !== "exam" || !isTimed) return
    if (timeLeft <= 0) { finish(questions, answers); return }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, isTimed, timeLeft, questions, answers, finish])

  function startExam() {
    const qs = getQuestions(subjectId)
    setQuestions(qs)
    setAnswers(new Array(qs.length).fill(null))
    setCurrent(0)
    setTimeLeft(minutes * 60)
    setPhase("exam")
  }

  function selectAnswer(idx: number) {
    setAnswers(prev => {
      const next = [...prev]
      next[current] = idx
      return next
    })
    setTimeout(() => {
      if (current < questions.length - 1) setCurrent(c => c + 1)
      else finish(questions, answers.map((a, i) => i === current ? idx : a))
    }, 350)
  }

  function shareResult(platform: string) {
    const text = encodeURIComponent(`حصلت على ${score}% في اختبار ${subjectName} على منصة ToQuiz! جربوها الآن على toquiz.online`)
    const url = encodeURIComponent("https://toquiz.online")
    const links: Record<string, string> = {
      wa: `https://wa.me/?text=${text} ${url}`,
      tg: `https://t.me/share/url?url=${url}&text=${text}`,
      fb: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      x:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    }
    window.open(links[platform], "_blank")
  }

  const timerStr = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`
  const progress = questions.length ? ((current) / questions.length) * 100 : 0

  // -- SETUP PHASE --
  if (phase === "setup") {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/subjects" className="inline-flex items-center gap-2 text-sm text-[#3B6E47] font-bold mb-6 hover:underline">
          ← رجوع للمواد
        </Link>
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="text-5xl text-center mb-3">📝</div>
          <h1 className="text-2xl font-black text-center text-[#0b3b6f] mb-1">{subjectName}</h1>
          <p className="text-center text-gray-500 text-sm mb-8">اختر إعدادات الاختبار وابدأ</p>

          <div className="bg-[#f4f7f6] rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-black text-[#0b3b6f]">محاكاة امتحان وزاري</div>
              <div className="text-sm text-gray-500">مع عداد الوقت</div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-bold text-gray-600">تفعيل الوقت</span>
              <button
                onClick={() => setIsTimed(v => !v)}
                className={`w-12 h-6 rounded-full transition-colors ${isTimed ? "bg-[#3B6E47]" : "bg-gray-300"}`}
              >
                <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${isTimed ? "translate-x-6" : ""}`} />
              </button>
            </label>
          </div>

          {isTimed && (
            <div className="mb-6">
              <label className="block font-bold text-sm mb-2 text-[#0b3b6f]">مدة الاختبار</label>
              <select
                value={minutes}
                onChange={e => setMinutes(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#0b3b6f] text-sm"
              >
                <option value={10}>سهل — 10 دقائق</option>
                <option value={20}>متوسط — 20 دقيقة</option>
                <option value={30}>صعب — 30 دقيقة</option>
              </select>
            </div>
          )}

          <button
            onClick={startExam}
            className="w-full bg-[#3B6E47] hover:bg-[#2d5537] text-white font-black rounded-xl py-4 transition text-base"
          >
            ابدأ الاختبار الآن
          </button>
        </div>
      </main>
    )
  }

  // -- EXAM PHASE --
  if (phase === "exam") {
    const q = questions[current]
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#3B6E47] text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm">
            {toastMsg}
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-4 mb-4 flex items-center justify-between">
          <span className="font-black text-[#0b3b6f] text-base">{subjectName}</span>
          {isTimed && (
            <span className={`px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2 ${timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-red-50 text-red-500"}`}>
              ⏱ {timerStr}
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-100 h-2.5 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-[#3B6E47] transition-all rounded-full" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow p-8 text-center mb-4">
          <span className="text-xs text-gray-400 font-bold mb-4 block">
            السؤال {current + 1} من {questions.length}
          </span>
          <h2 className="text-xl font-black text-[#111] mb-8 leading-relaxed">{q.text}</h2>

          <div className="flex flex-col gap-3 max-w-md mx-auto text-right">
            {q.options.map((opt, idx) => {
              const selected = answers[current] === idx
              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(idx)}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 font-bold text-sm transition
                    ${selected
                      ? "bg-[#3B6E47] text-white border-[#3B6E47]"
                      : "bg-[#f4f7f6] border-transparent hover:border-[#3B6E47] text-[#111]"
                    }`}
                >
                  <span>{opt}</span>
                  <strong className="text-xs opacity-60">{["أ", "ب", "ج", "د"][idx]}</strong>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="border-2 border-[#3B6E47] text-[#3B6E47] px-5 py-2 rounded-xl font-bold text-sm disabled:opacity-30 hover:bg-[#3B6E47] hover:text-white transition"
          >
            ← السابق
          </button>
          {current === questions.length - 1 ? (
            <button
              onClick={() => finish(questions, answers)}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold text-sm transition"
            >
              إنهاء الاختبار ✓
            </button>
          ) : (
            <button
              onClick={() => setCurrent(c => c + 1)}
              className="bg-[#3B6E47] hover:bg-[#2d5537] text-white px-5 py-2 rounded-xl font-bold text-sm transition"
            >
              التالي →
            </button>
          )}
        </div>
      </main>
    )
  }

  // -- RESULT PHASE --
  if (phase === "result") {
    const correct = questions.filter((q, i) => answers[i] === q.correct).length
    const medal = score >= 90 ? "🥇" : score >= 70 ? "🥈" : score >= 50 ? "🥉" : "📚"
    return (
      <main className="max-w-xl mx-auto px-4 py-10">
        {toastMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#3B6E47] text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm">
            {toastMsg}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <div className="text-5xl mb-4">{medal}</div>
          <h2 className="text-2xl font-black text-[#0b3b6f] mb-4">انتهى الاختبار!</h2>

          <div className="text-lg font-black text-[#3B6E47] bg-green-50 border-2 border-dashed border-[#3B6E47] rounded-xl px-5 py-3 mb-6 inline-block">
            ﴿ إِنَّا لَا نُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا ﴾
          </div>

          <div className="w-40 h-40 rounded-full border-8 border-[#3B6E47] flex flex-col items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-black text-[#0b3b6f]">{score}%</span>
            <span className="text-xs text-gray-500">{correct}/{questions.length} صحيح</span>
          </div>

          <button
            onClick={() => setPhase("review")}
            className="bg-yellow-400 hover:bg-yellow-500 text-[#111] px-6 py-3 rounded-2xl font-black text-sm mb-4 inline-flex items-center gap-2 transition shadow"
          >
            🔍 مراجعة الأخطاء والإجابات
          </button>

          <div className="mt-4">
            <p className="text-sm text-gray-500 font-bold mb-3">شارك نتيجتك مع أصدقائك:</p>
            <div className="flex justify-center gap-3">
              {[
                { id: "wa", bg: "#25D366", label: "واتساب", icon: "💬" },
                { id: "tg", bg: "#0088cc", label: "تيليجرام", icon: "✈️" },
                { id: "fb", bg: "#1877F2", label: "فيسبوك", icon: "👤" },
                { id: "x",  bg: "#000",    label: "إكس",     icon: "✕" },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => shareResult(s.id)}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm hover:scale-110 transition"
                  style={{ background: s.bg }}
                  title={s.label}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button
              onClick={() => { setPhase("setup"); setCurrent(0); setAnswers([]); }}
              className="border-2 border-[#3B6E47] text-[#3B6E47] px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#3B6E47] hover:text-white transition"
            >
              إعادة المحاولة
            </button>
            <Link href="/" className="border-2 border-[#0b3b6f] text-[#0b3b6f] px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#0b3b6f] hover:text-white transition">
              الرئيسية
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // -- REVIEW PHASE --
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => setPhase("result")}
        className="inline-flex items-center gap-2 text-sm text-[#3B6E47] font-bold mb-6 hover:underline"
      >
        ← رجوع للنتيجة
      </button>
      <h2 className="text-xl font-black text-[#0b3b6f] mb-6 border-r-4 border-[#3B6E47] pr-3">
        مراجعة الإجابات
      </h2>
      <div className="flex flex-col gap-4">
        {questions.map((q, i) => {
          const userAns = answers[i]
          const isCorrect = userAns === q.correct
          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl shadow p-5 border-r-4 ${isCorrect ? "border-[#3B6E47]" : "border-red-400"}`}
            >
              <p className="font-black text-sm text-[#0b3b6f] mb-3">
                {i + 1}. {q.text}
              </p>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2
                      ${idx === q.correct ? "bg-green-100 text-green-700" : ""}
                      ${idx === userAns && !isCorrect ? "bg-red-100 text-red-600" : ""}
                      ${idx !== q.correct && idx !== userAns ? "text-gray-500" : ""}
                    `}
                  >
                    {idx === q.correct && <span>✓</span>}
                    {idx === userAns && !isCorrect && <span>✗</span>}
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
