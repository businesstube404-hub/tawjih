import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

const SUBJECTS = [
  { id: "math",    name: "رياضيات",        icon: "🧮", count: "120 سؤال" },
  { id: "arabic",  name: "لغة عربية",      icon: "📖", count: "95 سؤال" },
  { id: "deen",    name: "تربية إسلامية",  icon: "🕌", count: "80 سؤال" },
  { id: "history", name: "تاريخ الأردن",   icon: "🏛️", count: "110 سؤال" },
  { id: "english", name: "لغة إنجليزية",   icon: "🔤", count: "100 سؤال" },
  { id: "science", name: "علوم",           icon: "🔬", count: "90 سؤال" },
  { id: "bio",     name: "أحياء",          icon: "🧬", count: "85 سؤال" },
  { id: "chem",    name: "كيمياء",         icon: "⚗️", count: "75 سؤال" },
  { id: "physics", name: "فيزياء",         icon: "⚛️", count: "88 سؤال" },
  { id: "geo",     name: "جغرافيا",        icon: "🌍", count: "70 سؤال" },
]

export default function SubjectsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-[#0b3b6f] mb-2 border-r-4 border-[#3B6E47] pr-3">
          اختر المادة وابدأ التحدي
        </h1>
        <p className="text-sm text-gray-500 mb-8">اختر المادة التي تريد التدرب عليها وابدأ امتحانك الآن</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {SUBJECTS.map(sub => (
            <Link
              key={sub.id}
              href={`/exam?subject=${sub.id}&name=${encodeURIComponent(sub.name)}`}
              className="bg-white rounded-2xl p-5 text-center border-2 border-transparent hover:border-[#3B6E47] shadow hover:shadow-md transition hover:-translate-y-1 group"
            >
              <div className="text-4xl mb-3">{sub.icon}</div>
              <h3 className="font-black text-[#0b3b6f] text-sm mb-1 group-hover:text-[#3B6E47] transition">{sub.name}</h3>
              <p className="text-xs text-gray-400">{sub.count}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
