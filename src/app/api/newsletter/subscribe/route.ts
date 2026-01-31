import {NextRequest, NextResponse} from 'next/server'
import {sendConfirmationEmail} from '@/lib/newsletter/sendEmail'
import {checkRateLimit, getClientIp} from '@/lib/newsletter/rateLimiter'

export async function POST(request: NextRequest) {
  try {
    // rate limit user if too many submissions
    const clientIp = getClientIp(request)
    const rateLimitCheck = checkRateLimit(clientIp)

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many subscription attempts. Please try again in ${rateLimitCheck.remainingMinutes} minute${rateLimitCheck.remainingMinutes !== 1 ? 's' : ''}.`,
          // waitTime: rateLimitCheck.remainingMinutes,
        },
        {status: 429}
      )
    }

    const {email} = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {success: false, message: 'Email is required'},
        {status: 400}
      )
    }

    const result = await sendConfirmationEmail(email)

    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      {success: false, message: 'An unexpected error occurred. Please try again later.'},
      {status: 500}
    )
  }
}
