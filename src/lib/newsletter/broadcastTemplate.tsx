import React from 'react'
import type {Media, Newsletter, Post} from '@/payload-types'

interface BroadcastTemplateProps {
  newsletter: Newsletter
  posts: Array<{
    post: Post
    postText?: string | null
  }>
}

export default function broadcastTemplate({ newsletter, posts }: BroadcastTemplateProps) {
  const getImageUrl = (heroImage: Post['heroImage']): string => {
    const media = heroImage as Media
    return media?.sizes?.medium?.url || media?.url || ""
  }

  const getPostUrl = (post: Post): string => {
    return `https://www.liberatorch.com/posts/${post.slug}`
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{newsletter.subject || 'Newsletter'}</title>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", backgroundColor: '#f5f5f5' }}>
        <table role="presentation" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tr>
            <td align="center" style={{ padding: '40px 0' }}>
              <table role="presentation" style={{ width: '600px', maxWidth: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                {/* Header with logo */}
                <tr>
                  <td style={{ background: '#42A5F5', padding: '40px 20px', textAlign: 'center' }}>
                    <img src="https://www.liberatorch.com/logo_tagline_white.png" alt="Liberatorch" style={{ maxWidth: '500px', height: 'auto', display: 'block', margin: '0 auto' }} />
                  </td>
                </tr>

                {/* Introduction */}
                {newsletter.introduction && (
                  <tr>
                    <td style={{ padding: '40px 30px 20px', backgroundColor: '#ffffff' }}>
                      <p style={{ margin: 0, fontSize: '24px', lineHeight: '1.6', color: '#4a4a4a' }}>
                        {newsletter.introduction}
                      </p>
                    </td>
                  </tr>
                )}

                {/* Posts */}
                {posts.map((item, index) => {
                  const post = item.post
                  // const imageUrl = "https://www.liberatorch.com" + getImageUrl(post.heroImage)
                  const imageUrl = "https://images.newscientist.com/wp-content/uploads/2023/07/11181809/space-image-1.jpg?width=900"
                  const postUrl = getPostUrl(post)
                  const introText = item.postText

                  return (
                    <tr key={index}>
                      <td style={{ padding: index === 0 && !newsletter.introduction ? '40px 30px 30px' : '30px', backgroundColor: '#ffffff', borderTop: index > 0 ? '1px solid #e5e5e5' : 'none' }}>
                        {/* Post Image */}
                        <a href={postUrl} style={{ display: 'block', marginBottom: '20px' }}>
                          <img
                            src={imageUrl}
                            alt={post.title}
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '8px',
                              display: 'block'
                            }}
                          />
                        </a>

                        {/* Post Title */}
                        <h2 style={{ margin: '0 0 15px', fontSize: '36px', fontWeight: '700', color: '#1a1a1a', lineHeight: '1.3' }}>
                          <a href={postUrl} style={{ color: '#1a1a1a', textDecoration: 'none' }}>
                            {post.title}
                          </a>
                        </h2>

                        {/* Post Intro Text */}
                        {introText && (
                          <p style={{ margin: '0 0 20px', fontSize: '24px', lineHeight: '1.6', color: '#4a4a4a' }}>
                            {introText}
                          </p>
                        )}

                        {/* Read More Button */}
                        <table role="presentation" style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <tr>
                            <td align="left">
                              <a
                                href={postUrl}
                                style={{
                                  display: 'inline-block',
                                  padding: '12px 30px',
                                  background: '#42A5F5',
                                  color: '#ffffff',
                                  textDecoration: 'none',
                                  fontWeight: '600',
                                  fontSize: '20px',
                                  borderRadius: '2px',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                              >
                                Read More
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  )
                })}

                {/* Footer */}
                <tr>
                  <td style={{ padding: '30px', backgroundColor: '#42A5F5', textAlign: 'center', borderTop: '1px solid #e5e5e5' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td align="center">
                          <img src="https://www.liberatorch.com/favicon_white.png" alt="LiberatorCH Icon" style={{ width: '64px', height: '64px', marginBottom: '25px' }} />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: '26px', color: '#ffffff', lineHeight: '1.5', paddingBottom: '10px' }}>
                          © {new Date().getFullYear()} LiberatorCH. All rights reserved.
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontSize: '24px', color: '#cecece', paddingTop: '10px' }}>
                          <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={{ color: '#cecece', textDecoration: 'underline' }}>
                            Unsubscribe
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              {/* Email Client Notice */}
              <table width="600" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', marginTop: '20px' }}>
                <tr>
                  <td style={{ textAlign: 'center', fontSize: '24px', color: '#666666', lineHeight: '1.5' }}>
                    You&apos;re receiving this because you subscribed to our newsletter.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
