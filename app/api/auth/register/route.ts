import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import sql from "@/lib/db"
import { generateToken, generateInviteCode } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, inviteCode } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json({ error: "البريد الإلكتروني مسجل مسبقاً" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const myInviteCode = generateInviteCode(name)

    let invitedById: number | null = null
    if (inviteCode) {
      const inviter = await sql`SELECT id FROM users WHERE invite_code = ${inviteCode} LIMIT 1`
      if (inviter.length > 0) {
        invitedById = inviter[0].id
        // Grant +100 points to inviter
        await sql`UPDATE users SET points = points + 100 WHERE id = ${invitedById}`
        // Grant invite achievement
        await sql`
          INSERT INTO user_achievements (user_id, achievement_key)
          VALUES (${invitedById}, 'invite_1')
          ON CONFLICT DO NOTHING
        `
        await sql`
          INSERT INTO notifications (user_id, message)
          VALUES (${invitedById}, ${`تم تسجيل صديق جديد باستخدام رابط دعوتك! حصلت على 100 نقطة.`})
        `
      }
    }

    const [newUser] = await sql`
      INSERT INTO users (name, email, password_hash, invite_code, invited_by)
      VALUES (${name}, ${email}, ${passwordHash}, ${myInviteCode}, ${invitedById})
      RETURNING id, name, email, invite_code
    `

    // Send welcome notification
    await sql`
      INSERT INTO notifications (user_id, message)
      VALUES (${newUser.id}, ${'أهلاً بك في منصة ToQuiz! ابدأ مذاكرتك الآن وحقق إنجازاتك.'})
    `

    // Create session
    const token = generateToken()
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await sql`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (${newUser.id}, ${token}, ${expires.toISOString()})
    `

    const response = NextResponse.json({ success: true, user: newUser })
    response.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    })
    return response
  } catch (err) {
    console.error("[v0] register error:", err)
    return NextResponse.json({ error: "حدث خطأ، يرجى المحاولة مرة أخرى" }, { status: 500 })
  }
}
