import {getPayload} from 'payload'
import config from '@payload-config'
import {getConfirmationEmailHtml, getConfirmationEmailText} from './emailTemplate'
import {isEmail} from 'validator'
import crypto from 'crypto'
import {getServerSideURL} from '@/utilities/getURL'
import {Resend} from 'resend'


/**
 * Validates and normalizes an email address
 * Returns normalized email or null if invalid
 */
function validateAndNormalizeEmail(email: string): string | null {
  const trimmed = email.trim()

  if (!isEmail(trimmed)) {
    return null
  }

  return trimmed.toLowerCase()
}

export async function sendConfirmationEmail(email: string): Promise<{
  success: boolean
  message: string
  waitTime?: number
}> {
  const normalizedEmail = validateAndNormalizeEmail(email)

  if (!normalizedEmail) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    }
  }

  const payload = await getPayload({config})

  // ensure email doesn't already exist
  const {docs} = await payload.find({
    collection: 'subscribers',
    where: {
      email: {equals: normalizedEmail},
    },
  })

  const existingConfirmation = docs[0]

  // sync local entry with resend if resend id exists
  if (existingConfirmation?.resend_id) {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const { data, error } = await resend.contacts.get({
      id: existingConfirmation.resend_id,
    });
    if (!error && data) {
      await payload.update({
        collection: 'subscribers',
        id: existingConfirmation.id,
        data: {
          subscribed: !data.unsubscribed,
        },
      })
      existingConfirmation.subscribed = !data.unsubscribed
    }
  }

  if (existingConfirmation?.subscribed) {
    return {
      success: false,
      message: 'This email is already confirmed and subscribed to our newsletter.',
    }
  }


  if (existingConfirmation?.lastSent) {
    const lastSentDate = new Date(existingConfirmation.lastSent)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastSentDate.getTime()) / (1000 * 60)

    if (diffMinutes < 15) {
      const remainingMinutes = Math.ceil(15 - diffMinutes)
      return {
        success: false,
        message: `Please wait ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} before requesting another confirmation email.`,
        waitTime: remainingMinutes,
      }
    }
  }

  let confirmationRecord = existingConfirmation

  if (!confirmationRecord) {
    confirmationRecord = await payload.create({
      collection: 'subscribers',
      data: {
        email: normalizedEmail,
        token: crypto.randomBytes(32).toString('hex'),
        subscribed: false,
        lastSent: new Date().toISOString(),
      },
    })
  } else {
    if (confirmationRecord.token == null || confirmationRecord.token === '') {
      confirmationRecord.token = crypto.randomBytes(32).toString('hex')
    }
    confirmationRecord = await payload.update({
      collection: 'subscribers',
      id: confirmationRecord.id,
      data: {
        lastSent: new Date().toISOString(),
        token: confirmationRecord.token,
      },
    })
  }

  const confirmUrl = `${getServerSideURL()}/confirm-newsletter?token=${confirmationRecord.token}`

  try {
    await payload.sendEmail({
      to: normalizedEmail,
      subject: 'Confirm Your Newsletter for The LiberatorCH',
      from: process.env.NEWSLETTER_FROM_ADDRESS ?? '',
      name: process.env.NEWSLETTER_FROM_NAME ?? '',
      html: getConfirmationEmailHtml(confirmUrl, normalizedEmail),
      text: getConfirmationEmailText(confirmUrl),
    })

    return {
      success: true,
      message: 'Confirmation email sent! Please check your inbox (and your spam folder).',
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return {
      success: false,
      message: 'Failed to send confirmation email. Please try again later.',
    }
  }
}
