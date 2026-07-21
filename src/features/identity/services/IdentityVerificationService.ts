import { IdentityRepository } from '../repositories/IdentityRepository';
import { IdentityCardService } from './IdentityCardService';

export class IdentityVerificationService {
  /**
   * Submit a new verification request
   */
  static async submitRequest(profileId: string, identityType: string, documents: any[]) {
    // Ensure no existing active identity
    const existing = await IdentityRepository.getIdentityByProfileId(profileId);
    if (existing && existing.status === 'active') {
      throw new Error("User already has an active digital identity.");
    }

    return await IdentityRepository.createVerificationRequest(profileId, identityType, documents);
  }

  /**
   * Approve verification request (Admin only)
   */
  static async approveRequest(requestId: string, adminId: string, profileId: string, identityType: string, identityNumber: string) {
    // 1. Update request status
    await IdentityRepository.updateVerificationRequest(requestId, 'approved', adminId);

    // 2. Create the digital identity
    const identity = await IdentityRepository.createIdentity(profileId, identityType, identityNumber);

    // 3. Issue the Digital ID Card (Premium by default for verified)
    await IdentityCardService.issueOrUpdateCard(identity.id, identityNumber, 'premium');

    // 4. Log Audit
    await IdentityRepository.logAudit(identity.id, 'verified', adminId, { request_id: requestId });

    return identity;
  }

  /**
   * Reject verification request (Admin only)
   */
  static async rejectRequest(requestId: string, adminId: string, notes: string) {
    await IdentityRepository.updateVerificationRequest(requestId, 'rejected', adminId, notes);
  }

  /**
   * Suspend an active identity (Admin only)
   */
  static async suspendIdentity(identityId: string, adminId: string, reason: string) {
    await IdentityRepository.updateIdentityStatus(identityId, 'suspended');
    await IdentityRepository.logAudit(identityId, 'suspended', adminId, { reason });
  }

  /**
   * Restore a suspended identity (Admin only)
   */
  static async restoreIdentity(identityId: string, adminId: string, reason: string) {
    await IdentityRepository.updateIdentityStatus(identityId, 'active');
    await IdentityRepository.logAudit(identityId, 'restored', adminId, { reason });
  }

  /**
   * Revoke an identity completely (Admin only)
   */
  static async revokeIdentity(identityId: string, adminId: string, reason: string) {
    await IdentityRepository.updateIdentityStatus(identityId, 'revoked');
    await IdentityRepository.logAudit(identityId, 'revoked', adminId, { reason });
  }
}
