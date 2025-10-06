import { getPayload } from 'payload'
import config from '@payload-config'
import { PostCard } from '@/components/PostCard'
import type { Post } from '@/payload-types'

export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayload({ config })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 20,
    sort: '-createdAt',
    where: { _status: { equals: 'published' } },
    depth: 1,
  })

  // const featured = posts?.[0] ?? null
  const featuredGlobal = await payload.findGlobal({
    slug: 'featured-article',
  });

  let featuredArticle: Post | null = null;

  if (featuredGlobal?.article) {
    const articleId = typeof featuredGlobal.article === 'number'
      ? featuredGlobal.article
      : featuredGlobal.article.id;

    const res = await payload.find({
      collection: 'posts',
      where: { id: { equals: articleId } },
      depth: 2,
    });

    featuredArticle = res.docs?.[0] ?? null;
  } else if (posts?.[0]) {
    featuredArticle = posts[0];
  }

  const remaining = (posts ?? []).filter((p) => p?.id !== featuredArticle?.id)

  const colCount = 3
  const postsPerCol = 2
  const columns = Array.from({ length: colCount }, (_, i) =>
    remaining.slice(i * postsPerCol, (i + 1) * postsPerCol)
  )

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Grid layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5 xl:gap-8">
        {/* Left column */}
        <div className="xl:col-span-1 space-y-6">
          {columns[0].map((p) => (
            <PostCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>

        {/* Featured article */}
        <div className="xl:col-span-2">
          {featuredArticle ? <PostCard post={featuredArticle as Post} size="medium" /> : null}
        </div>

        {/* Middle column */}
        <div className="xl:col-span-1 space-y-6">
          {columns[1].map((p) => (
            <PostCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>

        {/* Right column */}
        <div className="xl:col-span-1 space-y-6">
          {columns[2].map((p) => (
            <PostCard key={p.id} post={p as Post} size="small" />
          ))}
        </div>
      </div>

      {/* Call To Action - Remove Later
       */}
      <section
        className="mt-12 rounded-md p-8 text-center"
        style={{ backgroundColor: 'hsl(var(--primary) / 0.12)' }}
      >
        <h2 className="text-xl font-bold" style={{ color: `hsl(var(--foreground))` }}>
          Join our team
        </h2>
        <p
          className="mt-2 max-w-2xl mx-auto"
          style={{ color: `hsl(var(--muted-foreground))` }}
        >
          If you love telling stories through writing, photography, or filmmaking, we would love to hear from you!
        </p>
        <a
          href="mailto:editors@carolinarazor.com"
          className="inline-block mt-4 px-6 py-2 rounded-md font-semibold"
          style={{
            backgroundColor: `hsl(var(--primary))`,
            color: `hsl(var(--primary-foreground))`,
          }}
        >
          Email us
        </a>
      </section>
    </main>
  )
}
