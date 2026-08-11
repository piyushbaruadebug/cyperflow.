import 'dotenv/config'
import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST
const port = Number(process.env.SMTP_PORT || 587)
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS

if (!host || !user || !pass) {
  console.error('SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in your server environment first.')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user,
    pass,
  },
})

transporter.verify((error) => {
  if (error) {
    console.error('SMTP verification failed:')
    console.error(error)
    process.exit(1)
  }

  console.log('SMTP verification successful.')
  console.log(`Connected to ${host}:${port} as ${user}`)
})
