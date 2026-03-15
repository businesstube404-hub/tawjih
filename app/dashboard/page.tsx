import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/auth"
import sql from "@/lib/db"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user) redirect("/auth/login")

  const notifications = await sql`
    SELECT id, message, is_read, created_at
    FROM notifications WHERE user_id = ${user.id}
    ORDER BY created_at DESC LIMIT 5
  `
  const earnedAchievements = await sql`
    SELECT a.key, a.name_ar, a.description_ar, a.icon, ua.earned_at
    FROM user_achievements ua
    JOIN achievements a ON a.key = ua.achievement_key
    WHERE ua.user_id = ${user.id}
    ORDER BY ua.earned_at DESC
  `

  return (
    <>
      <Navbar />
      <DashboardClient
        user={user}
        notifications={notifications}
        achievements={earnedAchievements}
      />
      <Footer />
    </>
  )
}
