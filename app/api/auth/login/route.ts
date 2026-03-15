import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import sql from "@/lib/db"
import { generateToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "البريد وكلمة المرور مطلوبان" }, { status: 400 })
    }

    const [user] = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
    if (!user) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })
    }

    // Update streak and last login
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const lastLogin = user.last_login_date ? String(user.last_login_date).slice(0, 10) : null

    let newStreak = user.login_streak || 0
    if (lastLogin === yesterday) {
      newStreak += 1
    } else if (lastLogin !== today) {
      newStreak = 1
    }

    await sql`
      UPDATE users SET last_login_date = ${today}, login_streak = ${newStreak} WHERE id = ${user.id}
    `

    // Daily notification
    if (lastLogin !== today) {
      await sql`
        INSERT INTO notifications (user_id, message)
        VALUES (${user.id}, ${'مرحباً بعودتك! استمر في مذاكرتك وأكمل إنجازاتك اليومية.'})
      `
    }

    const token = generateToken()
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await sql`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expires.toISOString()})
    `

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        invite_code: user.invite_code,
        points: user.points,
        questions_solved: user.questions_solved,
        exams_completed: user.exams_completed,
      },
    })
    response.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    })
    return response
  } catch (err) {
    console.error("[v0] login error:", err)
    return NextResponse.json({ error: "حدث خطأ، يرجى المحاولة مرة أخرى" }, { status: 500 })
  }
}
