import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET() {
  const user = await getSessionUser()

  const allAchievements = await sql`SELECT * FROM achievements ORDER BY id`

  if (!user) {
    return NextResponse.json({ achievements: allAchievements, earned: [] })
  }

  const earned = await sql`
    SELECT achievement_key, earned_at FROM user_achievements WHERE user_id = ${user.id}
  `
  const earnedKeys = earned.map((e: { achievement_key: string }) => e.achievement_key)

  return NextResponse.json({ achievements: allAchievements, earned: earnedKeys })
}
