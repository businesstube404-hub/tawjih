import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ notifications: [] })

  const notifications = await sql`
    SELECT id, message, is_read, created_at
    FROM notifications
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
    LIMIT 20
  `
  return NextResponse.json({ notifications })
}

export async function POST() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })

  await sql`UPDATE notifications SET is_read = TRUE WHERE user_id = ${user.id}`
  return NextResponse.json({ success: true })
}
