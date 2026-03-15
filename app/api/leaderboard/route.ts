import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET() {
  const rows = await sql`
    SELECT id, name, points, questions_solved, exams_completed
    FROM users
    ORDER BY points DESC
    LIMIT 10
  `
  return NextResponse.json({ leaderboard: rows })
}
