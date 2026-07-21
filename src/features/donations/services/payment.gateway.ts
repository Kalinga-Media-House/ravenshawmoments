export interface PaymentInitParams {
  amount: number;
  currency: string;
  receiptId: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
}

export interface PaymentInitResult {
  orderId: string;
  amount: number;
  currency: string;
  gatewayOptions: any;
}

export interface PaymentVerificationParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentRefundParams {
  paymentId: string;
  amount?: number;
}

export interface IPaymentGateway {
  initiatePayment(params: PaymentInitParams): Promise<PaymentInitResult>;
  verifySignature(params: PaymentVerificationParams): boolean;
  refund(params: PaymentRefundParams): Promise<boolean>;
  getPaymentStatus(paymentId: string): Promise<string>;
}
