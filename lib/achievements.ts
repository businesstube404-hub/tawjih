import sql from "./db"

export async function checkAndGrantAchievements(userId: number): Promise<string[]> {
  const [user] = await sql`SELECT questions_solved, exams_completed, login_streak FROM users WHERE id = ${userId}`
  if (!user) return []

  const [earned] = await sql`SELECT array_agg(achievement_key) as keys FROM user_achievements WHERE user_id = ${userId}`
  const earnedKeys: string[] = earned?.keys || []

  const toGrant: string[] = []

  if (user.questions_solved >= 10 && !earnedKeys.includes("first_10"))    toGrant.push("first_10")
  if (user.questions_solved >= 50 && !earnedKeys.includes("questions_50")) toGrant.push("questions_50")
  if (user.questions_solved >= 100 && !earnedKeys.includes("questions_100")) toGrant.push("questions_100")
  if (user.exams_completed >= 1 && !earnedKeys.includes("first_exam"))    toGrant.push("first_exam")
  if (user.login_streak >= 7 && !earnedKeys.includes("streak_7"))         toGrant.push("streak_7")

  if (toGrant.length === 0) return []

  for (const key of toGrant) {
    await sql`
      INSERT INTO user_achievements (user_id, achievement_key)
      VALUES (${userId}, ${key})
      ON CONFLICT DO NOTHING
    `
    const [ach] = await sql`SELECT points_reward FROM achievements WHERE key = ${key}`
    if (ach?.points_reward) {
      await sql`UPDATE users SET points = points + ${ach.points_reward} WHERE id = ${userId}`
    }
    await sql`
      INSERT INTO notifications (user_id, message)
      SELECT ${userId}, CONCAT('مبروك! حصلت على إنجاز جديد: ', name_ar)
      FROM achievements WHERE key = ${key}
    `
  }

  return toGrant
}
