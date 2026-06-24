'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface MapFollowControllerProps {
  center: [number, number] | null
  follow: boolean
  zoom?: number
}

export function MapFollowController({
  center,
  follow,
  zoom,
}: MapFollowControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (follow && center) {
      map.setView(center, zoom ?? map.getZoom(), { animate: true })
    }
  }, [center, follow, zoom, map])

  return null
}
