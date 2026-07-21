'use server';

import { createClient } from '@/lib/supabase/server';
import { DonationRepository } from '../repositories/donation.repository';
import { FundraisingService } from '../services/fundraising.service';
import { MockPaymentGateway } from '../services/mock.payment.gateway';
import { Database } from '@/types/database.types';

async function getServices() {
  const supabase = await createClient();
  const repo = new DonationRepository(supabase);
  const gateway = new MockPaymentGateway();
  const service = new FundraisingService(repo, gateway);
  return { supabase, repo, service, gateway };
}

export async function initiateDonationAction(formData: FormData) {
  try {
    const { supabase, service } = await getServices();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();

    const amount = parseFloat(formData.get('amount') as string);
    const campaignId = formData.get('campaignId') as string | null;
    const isAnonymous = formData.get('isAnonymous') === 'true';
    const message = formData.get('message') as string;
    
    // We could extract entity target dynamically
    const targetEntityType = formData.get('targetEntityType') as Database['public']['Enums']['entity_type'] | null;
    const targetEntityId = formData.get('targetEntityId') as string | null;

    if (isNaN(amount) || amount <= 0) {
      return { error: 'Invalid amount' };
    }

    const result = await service.initiateDonation({
      amount,
      donorId: user?.id,
      campaignId: campaignId || undefined,
      isAnonymous,
      message,
      targetEntityType: targetEntityType || undefined,
      targetEntityId: targetEntityId || undefined,
      // For mock gateway
      donorName: user?.user_metadata?.full_name || 'Anonymous Donor',
      donorEmail: user?.email,
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to initiate donation:', error);
    return { error: error.message || 'Failed to initiate donation' };
  }
}

export async function verifyDonationAction(
  donationId: string, 
  orderId: string, 
  paymentId: string, 
  signature: string
) {
  try {
    const { service } = await getServices();
    const donation = await service.verifyAndCompleteDonation({
      donationId,
      orderId,
      paymentId,
      signature
    });

    return { success: true, donation };
  } catch (error: any) {
    console.error('Verification failed:', error);
    return { error: error.message || 'Verification failed' };
  }
}

export async function getCampaignsAction() {
  try {
    const { repo } = await getServices();
    const campaigns = await repo.getCampaigns({ activeOnly: true });
    return { success: true, data: campaigns };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getEndowmentFundsAction() {
  try {
    const { repo } = await getServices();
    const funds = await repo.getEndowmentFunds({ activeOnly: true });
    return { success: true, data: funds };
  } catch (error: any) {
    return { error: error.message };
  }
}
