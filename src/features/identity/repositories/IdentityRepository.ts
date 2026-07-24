import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

export class IdentityRepository {
  /**
   * Fetch a user's digital identity
   */
  static async getIdentityByProfileId(profileId: string) {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('digital_identities')
      .select('*, identity_cards(*)')
      .eq('profile_id', profileId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Fetch all identities with profile info (for admin)
   */
  static async getAllIdentities() {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('digital_identities')
      .select('*, profiles(id, full_name, email)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  /**
   * Update identity status
   */
  static async updateIdentityStatus(identityId: string, status: string) {
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from('digital_identities')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', identityId);
    if (error) throw error;
  }

  /**
   * Issue a new digital identity
   */
  static async createIdentity(profileId: string, identityType: string, identityNumber: string) {
    const supabase = (await createClient()) as any;
    
    // Set expiry 4 years from now by default
    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 4);

    const { data, error } = await supabase
      .from('digital_identities')
      .insert({
        profile_id: profileId,
        identity_type: identityType,
        identity_number: identityNumber,
        status: 'active',
        issue_date: issueDate.toISOString(),
        expiry_date: expiryDate.toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /**
   * Fetch verification requests
   */
  static async getVerificationRequests(status?: string) {
    const supabase = (await createClient()) as any;
    let query = supabase
      .from('identity_verification_requests')
      .select('*, profiles(id, full_name, email), identity_verification_documents(*)');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  /**
   * Create verification request
   */
  static async createVerificationRequest(profileId: string, identityType: string, documents: any[]) {
    const supabase = (await createClient()) as any;
    const { data: request, error: requestError } = await supabase
      .from('identity_verification_requests')
      .insert({ profile_id: profileId, identity_type: identityType })
      .select()
      .single();
      
    if (requestError) throw requestError;

    if (documents && documents.length > 0) {
      const docsToInsert = documents.map(doc => ({
        request_id: request.id,
        document_type: doc.type,
        document_url: doc.url
      }));
      const { error: docError } = await supabase
        .from('identity_verification_documents')
        .insert(docsToInsert);
      if (docError) throw docError;
    }

    return request;
  }

  /**
   * Update request status
   */
  static async updateVerificationRequest(requestId: string, status: string, reviewerId: string, notes?: string) {
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from('identity_verification_requests')
      .update({
        status,
        reviewer_id: reviewerId,
        reviewed_at: new Date().toISOString(),
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
    if (error) throw error;
  }

  /**
   * Fetch identity card by ID
   */
  static async getCard(cardId: string) {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('identity_cards')
      .select('*, digital_identities(*, profiles(*))')
      .eq('id', cardId)
      .single();
    if (error) throw error;
    return data;
  }
  
  /**
   * Get card by token (QR code scanning)
   */
  static async getCardByToken(token: string) {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('identity_cards')
      .select('*, digital_identities(*, profiles(*))')
      .eq('qr_code_hash', token)
      .eq('active', true)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Generate/Update Identity Card
   */
  static async generateCard(identityId: string, qrCodeHash: string, cardType: string = 'standard', templateConfig: any = {}) {
    const supabase = (await createClient()) as any;
    
    // Check if card exists
    const { data: existingCard } = await supabase
      .from('identity_cards')
      .select('id')
      .eq('identity_id', identityId)
      .single();

    if (existingCard) {
      const { data, error } = await supabase
        .from('identity_cards')
        .update({
          qr_code_hash: qrCodeHash,
          card_type: cardType,
          template_config: templateConfig,
          generated_at: new Date().toISOString(),
          active: true
        })
        .eq('id', existingCard.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('identity_cards')
        .insert({
          identity_id: identityId,
          qr_code_hash: qrCodeHash,
          card_type: cardType,
          template_config: templateConfig,
          active: true
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }

  /**
   * Log Identity Audit
   */
  static async logAudit(identityId: string, action: string, actorId: string, details: any = {}) {
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from('identity_audit_logs')
      .insert({
        identity_id: identityId,
        action,
        actor_id: actorId,
        details
      });
    if (error) throw error;
  }
}
