import { RouteDetailPage } from '@/views/route-detail'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function RouteDetailPageRoute({ params }: PageProps) {
  const { slug } = await params
  return <RouteDetailPage slug={slug} />
}
