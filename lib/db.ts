import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

type SqlValue = string | number | boolean | null | undefined

async function sql(
  strings: TemplateStringsArray,
  ...values: SqlValue[]
): Promise<Record<string, SqlValue>[]> {
  let query = ""
  const params: SqlValue[] = []

  strings.forEach((str, i) => {
    query += str
    if (i < values.length) {
      params.push(values[i])
      query += `$${params.length}`
    }
  })

  const client = await pool.connect()
  try {
    const result = await client.query(query, params)
    return result.rows
  } finally {
    client.release()
  }
}

export default sql
