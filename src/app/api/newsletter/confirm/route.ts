import {NextRequest, NextResponse} from 'next/server'
import {getPayload} from 'payload'
import config from '@payload-config'
import type {Subscriber} from '@/payload-types'
import {Resend} from 'resend'

export async function POST(request: NextRequest) {
  try {
    const {token} = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        {success: false, message: 'Token is required'},
        {status: 400}
      )
    }

    const payload = await getPayload({config})

    const {docs} = await payload.find({
      collection: 'subscribers',
      where: {
        token: {equals: token},
      },
    })

    const confirmation = docs[0] as Subscriber | undefined

    if (!confirmation) {
      return NextResponse.json(
        {success: false, message: 'Invalid or expired confirmation link'},
        {status: 404}
      )
    }

    if (confirmation.confirmed) {
      return NextResponse.json(
        {success: false, message: 'This email has already been confirmed'},
        {status: 400}
      )
    }

    // Check if token is expired
    if (confirmation.lastSent) {
      const lastSentDate = new Date(confirmation.lastSent)
      const now = new Date()
      const diffHours = (now.getTime() - lastSentDate.getTime()) / (1000 * 60 * 60)

      if (diffHours > 24) {
        return NextResponse.json(
          {success: false, message: 'This confirmation link has expired. Please request a new one.'},
          {status: 410}
        )
      }
    }

    await payload.update({
      collection: 'subscribers',
      id: confirmation.id,
      data: {
        token: '',
        confirmed: true,
      },
    })

    // add contact to resend
    const resend = new Resend(process.env.RESEND_API_KEY!);

    await resend.contacts.create({
      email: confirmation.email,
      unsubscribed: false,
      segments: [{id: process.env.NEWSLETTER_SEGMENT_1!}]
    });

    return NextResponse.json({
      success: true,
      message: 'Your subscription has been confirmed! Welcome to our newsletter.',
    })
  } catch (error) {
    console.error('Newsletter confirmation error:', error)
    return NextResponse.json(
      {success: false, message: 'An unexpected error occurred. Please try again later.'},
      {status: 500}
    )
  }
}
