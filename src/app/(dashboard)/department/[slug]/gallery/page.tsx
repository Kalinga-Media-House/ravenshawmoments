import { requireAuth } from '@/auth/guards/require-auth';
import { getAlbums } from '@/actions/department/gallery.actions';
import { AlbumForm } from './album-form';
import { AlbumCard } from './album-card';
import { Image as ImageIcon } from 'lucide-react';

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAuth();
  const { slug } = await params;
  
  // @ts-ignore
  const albumsResult = await getAlbums(slug);
  
  if (!albumsResult.success) {
    return (
      <div className="p-8 text-[#F5E6EA] bg-[#0F0A0B] min-h-screen">
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-lg p-6">
          // @ts-ignore
          <p className="text-[#9B3A4D]">Error loading albums: {albumsResult.error}</p>
        </div>
      </div>
    );
  }

  const albums = albumsResult.data || [];

  return (
    <div className="p-8 text-[#F5E6EA] bg-[#0F0A0B] min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gallery</h1>
          <p className="text-[#8B7078] text-sm mt-1">Manage departmental photo albums and event highlights.</p>
        </div>
        <AlbumForm slug={slug} />
      </div>

      {albums.length === 0 ? (
        <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#0F0A0B] rounded-full border border-[#2D1F23] flex items-center justify-center mb-4 text-[#8B7078]">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-[#F5E6EA] font-medium text-lg mb-2">No albums yet</h3>
          <p className="text-[#8B7078] max-w-md text-sm">
            Create an album to start sharing photos from departmental events, fests, and achievements.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album: any) => (
            <AlbumCard key={album.id} album={album} slug={slug} />
          ))}
        </div>
      )}
    </div>
  );
}
