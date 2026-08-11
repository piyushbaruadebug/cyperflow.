import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { CATEGORIES, METHODS } from './categories.js'
import { db, newId } from './db.js'

const DEMO = {
  name: process.env.DEMO_NAME || 'Demo User',
  email: process.env.DEMO_EMAIL,
  password: process.env.DEMO_PASSWORD,
}

if (!DEMO.email || !DEMO.password) {
  throw new Error('Set DEMO_EMAIL and DEMO_PASSWORD in server/.env before running the seed script.')
}

const DESCRIPTIONS = {
  Food: ['Grocery run', 'Coffee shop', 'Team lunch', 'Pizza night', 'Farmers market'],
  Transport: ['Fuel top-up', 'Metro pass', 'Taxi ride', 'Car service', 'Parking fee'],
  Housing: ['Monthly rent', 'Home repairs', 'Cleaning service', 'Furniture'],
  Shopping: ['Sneakers', 'Winter jacket', 'Headphones', 'Kitchenware'],
  Entertainment: ['Cinema tickets', 'Streaming plan', 'Concert', 'Board game'],
  Health: ['Pharmacy', 'Dentist visit', 'Gym membership', 'Eye check-up'],
  Bills: ['Electricity bill', 'Internet plan', 'Phone bill', 'Water bill'],
  Other: ['Gift', 'Charity donation', 'Misc supplies', 'Subscription'],
}

const AMOUNT_RANGE = {
  Food: [8, 120],
  Transport: [5, 90],
  Housing: [700, 1400],
  Shopping: [20, 320],
  Entertainment: [10, 150],
  Health: [15, 260],
  Bills: [30, 220],
  Other: [10, 140],
}

const WEIGHTS = { Food: 8, Transport: 5, Housing: 1, Shopping: 4, Entertainment: 3, Health: 2, Bills: 3, Other: 2 }
const WEIGHT_TOTAL = CATEGORIES.reduce((sum, category) => sum + WEIGHTS[category], 0)

const BUDGETS = {
  Food: 600,
  Transport: 250,
  Housing: 1500,
  Shopping: 400,
  Entertainment: 200,
  Health: 300,
  Bills: 450,
  Other: 150,
}

const pick = (items) => items[Math.floor(Math.random() * items.length)]

function pickCategory() {
  let ticket = Math.random() * WEIGHT_TOTAL
  for (const category of CATEGORIES) {
    ticket -= WEIGHTS[category]
    if (ticket <= 0) return category
  }
  return 'Other'
}

function monthKeyOf(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const existing = db.prepare('SELECT id FROM profiles WHERE email = ?').get(DEMO.email)
if (existing) {
  db.prepare('DELETE FROM profiles WHERE id = ?').run(existing.id)
}

const userId = newId()
db.prepare('INSERT INTO profiles (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(
  userId,
  DEMO.name,
  DEMO.email,
  bcrypt.hashSync(DEMO.password, 10),
)

const insertExpense = db.prepare(
  'INSERT INTO expenses (id, user_id, amount, category, description, date, method) VALUES (?, ?, ?, ?, ?, ?, ?)',
)
const insertBudget = db.prepare('INSERT INTO budgets (id, user_id, month, category, amount) VALUES (?, ?, ?, ?, ?)')

const today = new Date()
let created = 0

db.transaction(() => {
  for (let offset = 0; offset < 6; offset += 1) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - offset, 1)
    const lastDay =
      offset === 0 ? today.getDate() : new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate()

    for (let i = 0; i < 24; i += 1) {
      const category = pickCategory()
      const [min, max] = AMOUNT_RANGE[category]
      const day = 1 + Math.floor(Math.random() * lastDay)
      const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day)

      insertExpense.run(
        newId(),
        userId,
        Math.round((min + Math.random() * (max - min)) * 100) / 100,
        category,
        pick(DESCRIPTIONS[category]),
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
        pick(METHODS),
      )
      created += 1
    }

    for (const category of CATEGORIES) {
      insertBudget.run(newId(), userId, monthKeyOf(monthStart), category, BUDGETS[category])
    }
  }
})()

console.log(`Seeded demo account ${DEMO.email} with ${created} expenses and 6 months of budgets.`)
