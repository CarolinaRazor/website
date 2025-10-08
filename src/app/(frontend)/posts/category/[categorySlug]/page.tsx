import { redirect } from 'next/navigation'

type Props = {
  params: {
    categorySlug: string
  }
}

export default async function CategoryRedirect({ params }: Props) {
  const { categorySlug } = await params
  return redirect(`/posts/category/${categorySlug}/1`)
}
