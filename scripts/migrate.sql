-- ToQuiz Database Schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  invite_code VARCHAR(20) UNIQUE NOT NULL,
  invited_by INT REFERENCES users(id) ON DELETE SET NULL,
  points INT DEFAULT 0,
  questions_solved INT DEFAULT 0,
  exams_completed INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  last_login_date DATE,
  login_streak INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  description_ar VARCHAR(255) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  points_reward INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  achievement_key VARCHAR(50) REFERENCES achievements(key) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_key)
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed achievements
INSERT INTO achievements (key, name_ar, description_ar, icon, points_reward) VALUES
  ('first_10', 'الخطوة الأولى', 'حل أول 10 أسئلة', 'fa-star', 50),
  ('questions_100', 'المئة الأولى', 'حل 100 سؤال', 'fa-trophy', 200),
  ('first_exam', 'أول اختبار', 'إكمال أول اختبار', 'fa-graduation-cap', 100),
  ('streak_7', 'أسبوع متواصل', 'الدخول للموقع 7 أيام متتالية', 'fa-fire', 150),
  ('invite_1', 'سفير التعلم', 'دعوة أول صديق', 'fa-user-plus', 100),
  ('questions_50', 'على الطريق', 'حل 50 سؤال', 'fa-medal', 100)
ON CONFLICT (key) DO NOTHING;
