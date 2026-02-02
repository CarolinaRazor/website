import {Resend} from 'resend'
import {getPayload} from 'payload'
import config from '@payload-config'
import broadcastTemplate from './broadcastTemplate'
import type {Newsletter, Post} from '@/payload-types'

export async function generateBroadcast(): Promise<{
  success: boolean
  message: string
  broadcastId?: string
}> {
  try {
    const payload = await getPayload({ config })

    const { docs: newsletters } = await payload.find({
      collection: 'newsletters',
      sort: '-generated',
      limit: 1,
      depth: 3,
    })

    if (!newsletters || newsletters.length === 0) {
      return {
        success: false,
        message: 'No newsletters found. Please generate a newsletter first.',
      }
    }

    const newsletter = newsletters[0] as Newsletter

    // Check if latest newsletter is older than 2 days
    const newsletterDate = new Date(newsletter.generated)
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    if (newsletterDate < twoDaysAgo) {
      return {
        success: false,
        message: `No new newsletter.`,
      }
    }

    if (!newsletter.posts || newsletter.posts.length === 0) {
      return {
        success: false,
        message: 'The latest newsletter has no posts.',
      }
    }

    // needed to grab the hero images
    const postsWithImages = await Promise.all(
      newsletter.posts
        .filter(item => item.post)
        .map(async (item) => {
          const postId = typeof item.post === 'object' ? item.post.id : item.post
          const fullPost = await payload.findByID({
            collection: 'posts',
            id: postId,
            depth: 2,
          })
          return {
            post: fullPost as Post,
            postText: item.postText,
          }
        })
    )

    const posts = postsWithImages.filter(item => item.post)

    if (posts.length === 0) {
      return {
        success: false,
        message: 'No valid posts found in the newsletter.',
      }
    }

    const subject = newsletter.subject || 'Newsletter Update'

    const resend = new Resend(process.env.RESEND_API_KEY!)

    const result = await resend.broadcasts.create({
      segmentId: process.env.NEWSLETTER_SEGMENT_1!,
      from: `${process.env.NEWSLETTER_FROM_NAME} <${process.env.NEWSLETTER_FROM_ADDRESS}>`,
      subject,
      text: `View this newsletter at https://www.liberatorch.com`,
      react: broadcastTemplate({
        newsletter,
        posts,
      }),
      name: Date()
    })

    // send broadcast
    if (result.data?.id) {
      await resend.broadcasts.send(
        result.data?.id,
      );
      console.log("broadcast sent")
    }

    if (result.error) {
      return {
        success: false,
        message: `Failed to create broadcast: ${result.error.message}`,
      }
    }

    return {
      success: true,
      message: `Broadcast created successfully with ${posts.length} post${posts.length !== 1 ? 's' : ''}`,
      broadcastId: result.data?.id,
    }
  } catch (error) {
    console.error('Error generating broadcast:', error)
    return {
      success: false,
      message: `Failed to generate broadcast: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
