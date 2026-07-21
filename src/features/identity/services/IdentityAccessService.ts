import { IdentityRepository } from '../repositories/IdentityRepository';
import { AccessLogRepository } from '../repositories/AccessLogRepository';
import { DeviceRepository } from '../repositories/DeviceRepository';

export class IdentityAccessService {
  /**
   * Validates a QR token and logs the access
   */
  static async processQrScan(
    qrToken: string, 
    scannerProfileId: string, 
    logType: string = 'qr_scan',
    entityId?: string, 
    entityType?: string,
    ipAddress?: string
  ) {
    try {
      // 1. Fetch card by token
      const card = await IdentityRepository.getCardByToken(qrToken);
      
      if (!card || !card.active || !card.digital_identities || card.digital_identities.status !== 'active') {
        // Log failed scan if possible (we don't know who it was though if token is invalid, log against scanner)
        await AccessLogRepository.logAccess(
          scannerProfileId, 
          logType, 
          false, 
          undefined, 
          entityId, 
          entityType, 
          undefined, 
          ipAddress
        );
        return { success: false, error: 'Invalid or expired QR token' };
      }

      const identityId = card.digital_identities.id;
      const ownerProfileId = card.digital_identities.profile_id;

      // 2. Log successful scan
      await AccessLogRepository.logAccess(
        ownerProfileId, 
        logType, 
        true, 
        identityId, 
        entityId, 
        entityType, 
        undefined, 
        ipAddress
      );

      return { 
        success: true, 
        identity: card.digital_identities 
      };
    } catch (err) {
      console.error('QR Scan Error:', err);
      return { success: false, error: 'Internal verification error' };
    }
  }

  /**
   * Validate a device fingerprint for login tracking
   */
  static async processDeviceLogin(
    profileId: string, 
    fingerprint: string, 
    browser: string, 
    os: string, 
    ipAddress: string, 
    country: string
  ) {
    const device = await DeviceRepository.registerDevice(profileId, fingerprint, browser, os, ipAddress, country);
    
    await AccessLogRepository.logAccess(
      profileId, 
      'device_login', 
      true, 
      undefined, 
      undefined, 
      undefined, 
      device.id, 
      ipAddress
    );
    
    return device;
  }
}
