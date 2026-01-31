import {Suspense} from 'react'
import {ConfirmNewsletterForm} from '@/components/ConfirmNewsletterForm'
import {redirect} from 'next/navigation'

async function ConfirmNewsletterContent({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect('/')
  }

  return <ConfirmNewsletterForm token={token} />
}

export default function ConfirmNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>
}) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <ConfirmNewsletterContent searchParams={searchParams} />
    </Suspense>
  )
}
