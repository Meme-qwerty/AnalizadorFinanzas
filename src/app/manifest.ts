import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AnalizadorFinanzas',
    short_name: 'AnalizaFinanzas',
    description: 'Inteligencia financiera personal para Chile',
    start_url: '/dashboard',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    categories: ['finance', 'productivity'],
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [],
  }
}
