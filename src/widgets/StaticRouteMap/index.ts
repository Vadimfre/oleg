import dynamic from 'next/dynamic'

export const StaticRouteMap = dynamic(
  () => import('./ui/StaticRouteMap').then((m) => m.StaticRouteMap),
  {
    ssr: false,
  },
)
