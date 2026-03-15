import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import sql from "@/lib/db"
import { checkAndGrantAchievements } from "@/lib/achievements"

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  const { questionsAnswered, pointsEarned } = await req.json()

  await sql`
    UPDATE users
    SET
      questions_solved = questions_solved + ${questionsAnswered || 0},
      exams_completed  = exams_completed + 1,
      points           = points + ${pointsEarned || 0}
    WHERE id = ${user.id}
  `

  const newAchievements = await checkAndGrantAchievements(user.id)

  return NextResponse.json({ success: true, newAchievements })
}
