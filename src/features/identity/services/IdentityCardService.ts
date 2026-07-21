import { IdentityRepository } from '../repositories/IdentityRepository';
import { AccessLogRepository } from '../repositories/AccessLogRepository';
import crypto from 'crypto';

export class IdentityCardService {
  /**
   * Generates a secure, signed QR token payload
   * In a real enterprise app, this would use JWTs with short expirations.
   * Here we simulate a signed token for demonstration.
   */
  private static generateSecureQrToken(identityId: string, identityNumber: string) {
    const payload = {
      sub: identityId,
      idNum: identityNumber,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hour expiry
      jti: crypto.randomUUID()
    };
    
    // In production, sign this with a secure secret (e.g., jsonwebtoken)
    // We base64 encode it for simplicity in this implementation
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    return token;
  }

  /**
   * Generates a new Digital ID Card or regenerates the QR token
   */
  static async issueOrUpdateCard(identityId: string, identityNumber: string, cardType: string = 'standard', templateConfig: any = {}) {
    // Generate new signed QR token
    const qrToken = this.generateSecureQrToken(identityId, identityNumber);
    
    // Store in DB
    const card = await IdentityRepository.generateCard(identityId, qrToken, cardType, templateConfig);
    
    // Log audit
    await IdentityRepository.logAudit(identityId, 'card_generated', identityId, { card_type: cardType });
    
    return card;
  }

  /**
   * Fetch a user's card
   */
  static async getUserCard(profileId: string) {
    const identity = await IdentityRepository.getIdentityByProfileId(profileId);
    if (!identity || !identity.identity_cards || identity.identity_cards.length === 0) {
      return null;
    }
    return identity.identity_cards[0];
  }

  /**
   * Admin regeneration of a user's card/QR
   */
  static async adminRegenerateCard(identityId: string, adminId: string, identityNumber: string) {
    const qrToken = this.generateSecureQrToken(identityId, identityNumber);
    const card = await IdentityRepository.generateCard(identityId, qrToken, 'premium');
    await IdentityRepository.logAudit(identityId, 'qr_regenerated_by_admin', adminId);
    return card;
  }
}
