// =============================================================================
// Ravenshaw Moments
// File      : src/lib/payu/types.ts
// Purpose   : PayU integration type definitions
// =============================================================================

/**
 * Parameters required to submit a payment to PayU.
 * Returned by the server to the client for form submission.
 * Does NOT contain the Merchant Salt.
 */
export interface PayUSubmitParams {
  action: string;
  params: {
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    surl: string;
    furl: string;
    hash: string;
    udf1: string;
    udf2: string;
    udf3: string;
    udf4: string;
    udf5: string;
  };
}

/**
 * PayU callback response fields.
 * Parsed from the POST body sent by PayU to success/failure URLs.
 */
export interface PayUCallbackResponse {
  mihpayid: string;
  status: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  hash: string;
  key: string;
  error_Message?: string;
  bank_ref_num?: string;
  bankcode?: string;
  cardnum?: string;
  name_on_card?: string;
  mode?: string;
  unmappedstatus?: string;
  addedon?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  field9?: string;
  payment_source?: string;
  PG_TYPE?: string;
  net_amount_debit?: string;
}

/**
 * Server-side payment record shape for the initiation step.
 */
export interface PaymentInitiationRecord {
  paymentId: string;
  txnId: string;
  publicReference: string;
  amount: string;
  donorName: string;
  email: string;
  phone: string;
  message: string;
  visibility: "public" | "public_hide_amount" | "anonymous";
  purpose: string;
}
