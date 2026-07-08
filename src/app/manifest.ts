import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ravenshaw Moments',
    short_name: 'Ravenshaw',
    description: 'The digital ecosystem for Ravenshaw University students and alumni.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#800000', // Ravenshaw Maroon
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
