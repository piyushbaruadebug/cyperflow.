import Database from 'better-sqlite3'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dbFile = join(here, '..', 'data', 'PennyWise AI.db')

try {
  const db = new Database(dbFile, { readonly: true })
  console.log(`\n📦 Connected to SQLite database at: ${dbFile}\n`)

  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()

  for (const { name } of tables) {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${name}`).get().count
    console.log(`--- Table: ${name} (${count} rows) ---`)
    const rows = db.prepare(`SELECT * FROM ${name} LIMIT 5`).all()
    if (rows.length > 0) {
      console.table(rows)
    } else {
      console.log(' (No records)\n')
    }
  }
} catch (err) {
  console.error('Error opening database:', err.message)
}
