// might be better to use a payload collection for this

interface RateLimitEntry {
  count: number
  firstRequestTime: number
  lastRequestTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 mi
const MAX_REQUESTS_PER_WINDOW = 3 // Max email submissions per cycle

/**
 * Clean up old entries periodically to prevent memory leaks
 */
export function cleanupOldEntries() {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.lastRequestTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip)
    }
  }
}

// // Run cleanup every 30 minutes
// setInterval(cleanupOldEntries, 30 * 60 * 1000)

/**
 * Check if an IP address has exceeded the rate limit
 * @param ip - The IP address to check
 * @returns Object with allowed status and remaining wait time if blocked
 */
export function checkRateLimit(ip: string): {
  allowed: boolean
  remainingMinutes?: number
  requestsRemaining?: number
} {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry) {
    // First request from this IP
    rateLimitMap.set(ip, {
      count: 1,
      firstRequestTime: now,
      lastRequestTime: now,
    })
    return {
      allowed: true,
      requestsRemaining: MAX_REQUESTS_PER_WINDOW - 1,
    }
  }

  // Check if the window has expired
  const windowAge = now - entry.firstRequestTime
  if (windowAge > RATE_LIMIT_WINDOW_MS) {
    // Reset the window
    rateLimitMap.set(ip, {
      count: 1,
      firstRequestTime: now,
      lastRequestTime: now,
    })
    return {
      allowed: true,
      requestsRemaining: MAX_REQUESTS_PER_WINDOW - 1,
    }
  }

  // Within the window check if limit exceeded
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    const remainingMs = RATE_LIMIT_WINDOW_MS - windowAge
    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000))
    return {
      allowed: false,
      remainingMinutes,
      requestsRemaining: 0,
    }
  }

  // Increment count
  entry.count += 1
  entry.lastRequestTime = now
  rateLimitMap.set(ip, entry)

  return {
    allowed: true,
    requestsRemaining: MAX_REQUESTS_PER_WINDOW - entry.count,
  }
}

/**
 * Get the client IP address from the request
 */
export function getClientIp(request: Request): string {
  const headers = request.headers

  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  return 'unknown'
}
