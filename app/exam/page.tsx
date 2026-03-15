import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ExamClient from "@/components/exam-client"
import { Suspense } from "react"

export default function ExamPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="text-center py-20 text-[#0b3b6f] font-bold">جاري تحميل الاختبار...</div>}>
        <ExamClient />
      </Suspense>
      <Footer />
    </>
  )
}
