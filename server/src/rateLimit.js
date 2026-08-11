import { createHash } from 'node:crypto'

const buckets = new Map()

const hash = (value) => createHash('sha256').update(String(value)).digest('hex').slice(0, 24)
const clientIp = (req) => req.ip || req.socket?.remoteAddress || 'unknown'
const accountIdentifier = (req) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  if (email) return `email:${email}`

  // Reset tokens are account-bound credentials. Hashing avoids retaining the raw token in memory.
  const token = String(req.body?.token ?? '').trim()
  return token ? `reset-token:${token}` : 'anonymous'
}

function limiter({ name, max, windowMs, key }) {
  return (req, res, next) => {
    const now = Date.now()
    const bucketKey = `${name}:${hash(key(req))}`
    let bucket = buckets.get(bucketKey)

    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs }
      buckets.set(bucketKey, bucket)
    }

    bucket.count += 1
    const remaining = Math.max(0, max - bucket.count)
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    res.set('RateLimit-Limit', String(max))
    res.set('RateLimit-Remaining', String(remaining))
    res.set('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)))

    if (bucket.count > max) {
      res.set('Retry-After', String(retryAfterSeconds))
      return res.status(429).json({ error: 'Too many requests. Please try again later.' })
    }

    return next()
  }
}

export const publicIpLimit = limiter({
  name: 'public-ip',
  max: 60,
  windowMs: 60_000,
  key: clientIp,
})

export function authLimits(endpoint, { ipMax, ipWindowMs, accountMax, accountWindowMs }) {
  return [
    limiter({ name: `auth:${endpoint}:ip`, max: ipMax, windowMs: ipWindowMs, key: clientIp }),
    limiter({ name: `auth:${endpoint}:account`, max: accountMax, windowMs: accountWindowMs, key: accountIdentifier }),
  ]
}

export function authenticatedLimits(scope, { userMax = 180, ipMax = 450, windowMs = 15 * 60_000 } = {}) {
  return [
    limiter({ name: `user:${scope}`, max: userMax, windowMs, key: (req) => req.userId }),
    limiter({ name: `user:${scope}:ip`, max: ipMax, windowMs, key: clientIp }),
  ]
}
