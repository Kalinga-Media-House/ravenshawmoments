'use server';

import { createClient } from '@/lib/supabase/server';
import { DigitalMagazineService } from '../services/magazine.service';
import { Database } from '@/types/database.types';

export async function getAllPublicationsAction(entityType?: Database['public']['Enums']['entity_type'], entityId?: string) {
  const supabase = await createClient();
  const service = new DigitalMagazineService(supabase as any);
  return service.getAllPublications(entityType, entityId);
}

export async function getPublicationDetailsAction(slug: string) {
  const supabase = await createClient();
  const service = new DigitalMagazineService(supabase as any);
  return service.getPublicationDetails(slug);
}

export async function getEditionReaderAction(publicationId: string, editionSlug: string) {
  const supabase = await createClient();
  const service = new DigitalMagazineService(supabase as any);
  return service.getEditionReader(publicationId, editionSlug);
}

export async function trackDownloadAction(editionId: string) {
  const supabase = await createClient();
  const service = new DigitalMagazineService(supabase as any);
  await service.trackDownload(editionId);
}

export async function subscribeAction(email: string, publicationId?: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  let profileId = undefined;
  if (session?.user?.id) {
    const { data: profile } = await supabase.from('profiles').select('id').eq('auth_user_id', session.user.id).single();
    if (profile) profileId = (profile as any).id;
  }

  const service = new DigitalMagazineService(supabase as any);
  await service.subscribe(email, publicationId, profileId);
}
