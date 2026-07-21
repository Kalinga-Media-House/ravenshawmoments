import { DonationRepository } from '../repositories/donation.repository';
import { IPaymentGateway, PaymentInitParams } from './payment.gateway';
import { Database } from '@/types/database.types';

export class FundraisingService {
  constructor(
    private repository: DonationRepository,
    private paymentGateway: IPaymentGateway
  ) {}

  async initiateDonation(params: {
    amount: number;
    currency?: string;
    donorId?: string;
    isAnonymous?: boolean;
    message?: string;
    campaignId?: string;
    fundId?: string;
    targetEntityType?: Database['public']['Enums']['entity_type'];
    targetEntityId?: string;
    donorName?: string;
    donorEmail?: string;
  }) {
    // 1. Generate Receipt Number
    const receiptNumber = await this.repository.generateReceiptNumber();

    // 2. Initiate Payment via Gateway (Abstracted)
    const initParams: PaymentInitParams = {
      amount: params.amount,
      currency: params.currency || 'INR',
      receiptId: receiptNumber,
      donorName: params.donorName,
      donorEmail: params.donorEmail,
    };
    
    const paymentResult = await this.paymentGateway.initiatePayment(initParams);

    // 3. Create Pending Donation Record
    const donation = await this.repository.createDonation({
      amount: params.amount,
      base_amount: params.amount, // assuming INR for base
      currency: params.currency || 'INR',
      profile_id: params.donorId,
      is_anonymous: params.isAnonymous || false,
      message: params.message,
      receipt_number: receiptNumber,
      campaign_id: params.campaignId,
      fund_id: params.fundId,
      target_entity_type: params.targetEntityType,
      target_entity_id: params.targetEntityId,
      status: 'pending',
      payment_gateway_ref: paymentResult.orderId,
    });

    // 4. Log Audit
    await this.repository.logAudit(
      'donation',
      donation.id,
      'initiated',
      null,
      donation,
      params.donorId
    );

    return {
      donationId: donation.id,
      orderId: paymentResult.orderId,
      receiptNumber,
      gatewayOptions: paymentResult.gatewayOptions,
    };
  }

  async verifyAndCompleteDonation(params: {
    donationId: string;
    orderId: string;
    paymentId: string;
    signature: string;
  }) {
    // 1. Verify Signature
    const isValid = this.paymentGateway.verifySignature({
      orderId: params.orderId,
      paymentId: params.paymentId,
      signature: params.signature,
    });

    if (!isValid) {
      await this.repository.updateDonationStatus(params.donationId, 'failed');
      throw new Error('Payment signature verification failed');
    }

    // 2. Verify Status with Gateway
    const gatewayStatus = await this.paymentGateway.getPaymentStatus(params.paymentId);
    if (gatewayStatus !== 'successful') {
       throw new Error('Payment was not successful at gateway');
    }

    // 3. Update Donation Status
    const donation = await this.repository.updateDonationStatus(params.donationId, 'successful', params.paymentId);

    // 4. Update Campaign/Fund Totals
    if (donation.campaign_id) {
      await this.repository.incrementCampaignTotals(donation.campaign_id, donation.amount);
    }

    // 5. Audit Log
    await this.repository.logAudit(
      'donation',
      donation.id,
      'completed',
      { status: 'pending' },
      donation,
      donation.profile_id || undefined
    );

    // TODO: Trigger Notification
    return donation;
  }
}
