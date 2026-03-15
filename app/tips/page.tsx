"use client"

import { useRef } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const DUAS = [
  { title: "دعاء المذاكرة", text: "اللهم إني أسألك فهم النبيين، وحفظ المرسلين، والملائكة المقربين." },
  { title: "دعاء التسهيل", text: "اللهم لا سهل إلا ما جعلته سهلاً، وأنت تجعل الحزن إذا شئت سهلاً." },
  { title: "دعاء النسيان", text: "اللهم يا جامع الناس ليوم لا ريب فيه، اجمع علي ضالتي." },
  { title: "من سورة طه", text: "﴿رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي﴾" },
  { title: "للتحصين", text: "قراءة آية الكرسي والمعوذتين لدفع التوتر والقلق وتصفية الذهن." },
]

const TIPS_BEFORE = [
  "النوم المبكر، لا تسهر أبداً ليلة الامتحان لتنشيط الذاكرة.",
  "تجهيز أدوات الامتحان والهوية من الليل لتجنب التوتر الصباحي.",
  "مراجعة العناوين الرئيسية والخرائط الذهنية بدلاً من قراءة التفاصيل.",
  "تناول فطور صحي وخفيف يمدك بالطاقة (مثل التمر).",
  "الابتعاد عن الطلاب المتوترين أمام قاعة الامتحان.",
]

const TIPS_DURING = [
  "قراءة دعاء التسهيل قبل استلام الورقة وأخذ نفس عميق.",
  "البدء بالأسئلة السهلة لرفع المعنويات وكسب الوقت.",
  "قراءة السؤال بتركيز كامل للآخر، ففهم السؤال نصف الإجابة.",
  "لا تتوقف طويلاً عند السؤال الصعب، اتركه للنهاية.",
  "تظليل الإجابات على ورقة الماسح الضوئي بحذر وبشكل مباشر.",
]

const TIPS_AFTER = [
  "القاعدة الذهبية: لا تراجع إجاباتك مع زملائك أو معلميك بعد الخروج أبداً!",
  "سلم أمرك لله، فما كتبه الله لك هو الخير.",
  "خذ قسطاً جيداً من الراحة والنوم قبل البدء بدراسة المادة الجديدة.",
  "ابدأ صفحة جديدة مع المادة القادمة بتركيز وعزيمة أقوى.",
]

const STORY_CONTENT = [
  { label: "دعاء المذاكرة", text: "اللهم إني أسألك فهم النبيين،\nوحفظ المرسلين،\nوالملائكة المقربين." },
  { label: "دعاء التسهيل", text: "اللهم لا سهل إلا ما جعلته سهلاً،\nوأنت تجعل الحزن إذا شئت سهلاً." },
  { label: "آية النجاح", text: "﴿رَبِّ اشْرَحْ لِي صَدْرِي\nوَيَسِّرْ لِي أَمْرِي﴾" },
]

export default function TipsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pageUrl = "https://toquiz.online/tips"
  const shareText = "نصائح وأدعية رائعة للطلاب من منصة ToQuiz! جربوها الآن"
  const enc = encodeURIComponent

  function generateStory(content: { label: string; text: string }) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = 540; canvas.height = 960
    const grad = ctx.createLinearGradient(0, 0, 0, 960)
    grad.addColorStop(0, "#0b3b6f"); grad.addColorStop(1, "#07254a")
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 540, 960)
    ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = "#fff"
    ctx.beginPath(); ctx.arc(480, 100, 200, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(60, 860, 160, 0, Math.PI * 2); ctx.fill()
    ctx.restore(); ctx.globalAlpha = 1
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 30px Cairo, Arial"; ctx.textAlign = "center"
    ctx.fillText("ToQuiz  |  توكويز", 270, 90)
    ctx.font = "16px Cairo, Arial"; ctx.fillStyle = "#a7c9e8"
    ctx.fillText("منصة تعليمية لجيل التوجيهي", 270, 120)
    ctx.strokeStyle = "#3B6E47"; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(80, 145); ctx.lineTo(460, 145); ctx.stroke()
    ctx.fillStyle = "#3B6E47"; ctx.beginPath()
    ctx.roundRect(170, 180, 200, 44, 22); ctx.fill()
    ctx.fillStyle = "#fff"; ctx.font = "bold 18px Cairo, Arial"
    ctx.fillText(content.label, 270, 208)
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 28px Cairo, Arial"
    content.text.split("\n").forEach((line, i) => ctx.fillText(line, 270, 360 + i * 55))
    ctx.fillStyle = "#a7c9e8"; ctx.font = "16px Cairo, Arial"
    ctx.fillText("toquiz.online", 270, 870)
    const link = document.createElement("a")
    link.download = `toquiz-story-${content.label}.jpg`
    link.href = canvas.toDataURL("image/jpeg", 0.92)
    link.click()
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-black text-[#0b3b6f] mb-1 border-r-4 border-[#3B6E47] pr-3">نصائح وأدعية للنجاح</h1>
          <p className="text-sm text-gray-500">استعن بالله ثم بهذه النصائح الذهبية</p>
        </div>

        {/* Duas */}
        <section className="bg-white rounded-2xl shadow p-6 border-t-4 border-[#0b3b6f]">
          <h2 className="font-black text-[#3B6E47] text-lg mb-4">آيات وأدعية مباركة</h2>
          <div className="flex flex-col gap-4">
            {DUAS.map(d => (
              <div key={d.title} className="bg-[#f4f7f6] rounded-xl p-4">
                <div className="font-black text-[#0b3b6f] text-sm mb-1">{d.title}</div>
                <p className="text-sm leading-relaxed text-gray-700">{d.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tips grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <section className="bg-white rounded-2xl shadow p-6 border-t-4 border-yellow-400">
            <h2 className="font-black text-[#3B6E47] text-lg mb-4">قبل الامتحان</h2>
            <ul className="flex flex-col gap-3">
              {TIPS_BEFORE.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                  <span className="text-[#3B6E47] font-black mt-0.5">•</span> {t}
                </li>
              ))}
            </ul>
          </section>
          <section className="bg-white rounded-2xl shadow p-6 border-t-4 border-blue-400">
            <h2 className="font-black text-[#3B6E47] text-lg mb-4">أثناء الامتحان</h2>
            <ul className="flex flex-col gap-3">
              {TIPS_DURING.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                  <span className="text-[#3B6E47] font-black mt-0.5">•</span> {t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="bg-white rounded-2xl shadow p-6 border-t-4 border-purple-400">
          <h2 className="font-black text-[#3B6E47] text-lg mb-4">بعد الامتحان</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS_AFTER.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed bg-[#f4f7f6] rounded-xl p-3">
                <span className="text-[#3B6E47] font-black mt-0.5">•</span> {t}
              </li>
            ))}
          </ul>
        </section>

        {/* Share section */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-black text-[#0b3b6f] text-lg mb-4 text-center">شارك الفائدة</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "واتساب",   bg: "#25D366", href: `https://wa.me/?text=${enc(shareText + " " + pageUrl)}` },
              { label: "تيليجرام", bg: "#0088cc", href: `https://t.me/share/url?url=${enc(pageUrl)}&text=${enc(shareText)}` },
              { label: "فيسبوك",   bg: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(pageUrl)}` },
            ].map(p => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition"
                style={{ background: p.bg }}
              >
                {p.label}
              </a>
            ))}
          </div>
        </section>

        {/* Story generator */}
        <section className="bg-[#0b3b6f] rounded-2xl p-6 text-white text-center">
          <h2 className="text-lg font-black mb-1">شارك على ستوري إنستجرام</h2>
          <p className="text-blue-200 text-sm mb-5">اختر دعاءً وحمّل صورة جاهزة بمقاس ستوري</p>
          <div className="flex flex-wrap justify-center gap-3">
            {STORY_CONTENT.map(c => (
              <button
                key={c.label}
                onClick={() => generateStory(c)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition"
              >
                {c.label}
              </button>
            ))}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <p className="text-blue-300 text-xs mt-4">ستُحمَّل الصورة مباشرة إلى جهازك</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
