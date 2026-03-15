import { cookies } from "next/headers"
import sql from "./db"

export interface SessionUser {
  id: number
  name: string
  email: string
  invite_code: string
  points: number
  questions_solved: number
  exams_completed: number
  streak_days: number
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value
    if (!token) return null

    const rows = await sql`
      SELECT u.id, u.name, u.email, u.invite_code, u.points, u.questions_solved, u.exams_completed, u.login_streak AS streak_days
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = ${token} AND s.expires_at > NOW()
      LIMIT 1
    `
    if (rows.length === 0) return null
    return rows[0] as SessionUser
  } catch {
    return null
  }
}

export function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export function generateInviteCode(name: string): string {
  const clean = name
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z\u0600-\u06FF0-9]/g, "")
    .substring(0, 8)
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `${clean}${rand}`
}
