import { IPaymentGateway, PaymentInitParams, PaymentInitResult, PaymentVerificationParams, PaymentRefundParams } from './payment.gateway';

export class MockPaymentGateway implements IPaymentGateway {
  async initiatePayment(params: PaymentInitParams): Promise<PaymentInitResult> {
    return {
      orderId: `mock_order_${Date.now()}`,
      amount: params.amount,
      currency: params.currency,
      gatewayOptions: { mock: true, provider: 'MockGateway' }
    };
  }

  verifySignature(params: PaymentVerificationParams): boolean {
    // In a real gateway, verify the HMAC/SHA256 signature
    return params.signature === 'mock_valid_signature' || params.signature === 'demo_success';
  }

  async refund(params: PaymentRefundParams): Promise<boolean> {
    console.log(`Mock refunding payment ${params.paymentId} for amount ${params.amount}`);
    return true;
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    return 'successful';
  }
}
