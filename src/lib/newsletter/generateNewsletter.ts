import {getPayload} from 'payload'
import config from '@payload-config'
import type {Newsletter} from '@/payload-types'


export async function generateNewsletter(): Promise<{
  success: boolean
  message: string
  newsletter?: Newsletter
}> {
  const payload = await getPayload({ config })

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  try {
    const { docs: recentPosts } = await payload.find({
      collection: 'posts',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            publishedAt: {
              greater_than_equal: sevenDaysAgo.toISOString(),
            },
          },
        ],
      },
      sort: '-publishedAt',
      limit: 20,
    })

    if (recentPosts.length === 0) {
      return {
        success: false,
        message: 'No posts published in the last 7 days.',
      }
    }

    let subject: string
    if (recentPosts.length === 1) {
      subject = recentPosts[0].title
    } else if (recentPosts.length === 2) {
      subject = `${recentPosts[0].title} & ${recentPosts[1].title}`
    } else {
      const remaining = recentPosts.length - 2
      subject = `${recentPosts[0].title}, ${recentPosts[1].title} & ${remaining} more`
    }

    const newsletter = await payload.create({
      collection: 'newsletters',
      draft: false,
      data: {
        generated: new Date().toISOString(),
        generated_tz: 'America/New_York',
        subject,
        posts: recentPosts.map(post => ({
          post: post.id,
          postText: post.featuredtext,
        })),
      },
    })

    return {
      success: true,
      message: `Newsletter generated successfully with ${recentPosts.length} post${recentPosts.length !== 1 ? 's' : ''}.`,
      newsletter,
    }
  } catch (error) {
    console.error('Error generating newsletter:', error)
    return {
      success: false,
      message: `Failed to generate newsletter: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
