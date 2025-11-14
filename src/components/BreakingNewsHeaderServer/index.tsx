import configPromise from '@payload-config'
import {getPayload} from 'payload'
import BreakingHeader from "@/components/BreakingNewsHeader";

export default async function BreakingHeaderServer() {
  const payload = await getPayload({ config: configPromise })
  const breaking = await payload.findGlobal({
    slug: 'breaking-header',
  })

  if (!breaking?.visible || !breaking?.text) return null

  return <BreakingHeader text={breaking.text} />
}
