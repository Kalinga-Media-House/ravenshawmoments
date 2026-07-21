"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  IndianRupee,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Shield,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  DONATION_PRESETS,
  DONATION_LIMITS,
  DONATION_CURRENCY,
  MAX_MESSAGE_LENGTH,
  formatDonationAmount,
  validateDonationAmount,
  DEFAULT_CONTRIBUTION_PURPOSE,
  PAYU_PRODUCT_INFO,
} from "../config/donation";

// =============================================================================
// Types
// =============================================================================

interface DonationFormData {
  amount: number | null;
  customAmount: string;
  fullName: string;
  email: string;
  phone: string;
  isPublic: boolean;
  purpose: string;
}

interface FormErrors {
  amount?: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS: Record<Step, string> = {
  1: "Contribution",
  2: "Your Information",
  3: "Recognition",
  4: "Review",
  5: "Secure Payment",
};

// =============================================================================
// Component
// =============================================================================

export function DonationForm({
  isTestMode,
}: {
  isTestMode: boolean;
}) {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<DonationFormData>({
    amount: null,
    customAmount: "",
    fullName: "",
    email: "",
    phone: "",
    isPublic: false,
    purpose: DEFAULT_CONTRIBUTION_PURPOSE,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const payuFormRef = useRef<HTMLFormElement>(null);
  const [payuParams, setPayuParams] = useState<{
    action: string;
    params: Record<string, string>;
  } | null>(null);
  const hasSubmittedRef = useRef(false);

  // Auto-submit the hidden PayU form when params are ready
  useEffect(() => {
    if (payuParams && payuFormRef.current && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      payuFormRef.current.submit();
    }
  }, [payuParams]);

  // Get the effective amount
  const getEffectiveAmount = useCallback((): number | null => {
    if (formData.amount !== null) return formData.amount;
    if (formData.customAmount.trim()) {
      const num = Number(formData.customAmount);
      if (Number.isFinite(num) && num > 0) return num;
    }
    return null;
  }, [formData.amount, formData.customAmount]);

  // ==========================================================================
  // Validation
  // ==========================================================================

  const validateStep1 = (): boolean => {
    const amount = getEffectiveAmount();
    const amountError = validateDonationAmount(amount);
    if (amountError) {
      setErrors((prev) => ({ ...prev, amount: amountError }));
      return false;
    }
    setErrors((prev) => ({ ...prev, amount: undefined }));
    return true;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    let valid = true;

    const name = formData.fullName.trim();
    if (!name) {
      newErrors.fullName = "Full name is required.";
      valid = false;
    } else if (name.length > 200) {
      newErrors.fullName = "Full name is too long.";
      valid = false;
    }

    const email = formData.email.trim();
    if (!email) {
      newErrors.email = "Email address is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    const phone = formData.phone.trim().replace(/[\s-]/g, "");
    if (!phone) {
      newErrors.phone = "Phone number is required.";
      valid = false;
    } else if (!/^[+]?[0-9]{10,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number.";
      valid = false;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return valid;
  };

  const validateStep3 = (): boolean => {
    return true;
  };

  // ==========================================================================
  // Navigation
  // ==========================================================================

  const goNext = () => {
    setSubmitError(null);
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((s) => Math.min(s + 1, 5) as Step);
  };

  const goBack = () => {
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 1) as Step);
  };

  // ==========================================================================
  // Payment Submission
  // ==========================================================================

  const handlePayment = async () => {
    if (isSubmitting || hasSubmittedRef.current) return;

    const amount = getEffectiveAmount();
    if (!amount) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/payments/payu/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          isPublic: formData.isPublic,
          purpose: formData.purpose,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(
          result.error || "We could not start the secure payment process. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      // Set PayU form params to trigger auto-submit
      setPayuParams(result);
    } catch {
      setSubmitError(
        "Payment setup is temporarily unavailable. Please try again later."
      );
      setIsSubmitting(false);
    }
  };

  // ==========================================================================
  // Render Helpers
  // ==========================================================================

  const effectiveAmount = getEffectiveAmount();

  return (
    <section
      aria-labelledby="donation-form-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto">
        {/* Test Mode Badge */}
        {isTestMode && (
          <div className="mb-6 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-900/30 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>PayU Test Mode</span>
          </div>
        )}

        <div className="bg-white shadow-sm rounded-3xl border border-[#8F0028]/10 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-[#8F0028]/10">
            <h2
              id="donation-form-heading"
              className="text-xl sm:text-2xl font-black text-[#171214] tracking-tight"
            >
              Make a Contribution
            </h2>
            <p className="text-xs text-[#756A6E] mt-1 font-medium">
              Your contribution supports the continued development and
              preservation of Ravenshaw Moments.
            </p>

            {/* Step Indicator */}
            <nav
              aria-label="Contribution steps"
              className="mt-5 flex items-center gap-1"
            >
              {([1, 2, 3, 4, 5] as Step[]).map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                        s < step
                          ? "bg-green-600 border-green-500 text-[#171214]"
                          : s === step
                            ? "bg-[var(--color-rm-maroon)] border-[#E8B83F]/30 text-[#8F0028]"
                            : "bg-white border-[#8F0028]/10 text-[#756A6E]"
                      }`}
                      aria-current={s === step ? "step" : undefined}
                    >
                      {s < step ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        s
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider text-center leading-tight ${
                        s === step ? "text-[#171214]" : "text-[#756A6E]"
                      } hidden sm:block`}
                    >
                      {STEP_LABELS[s]}
                    </span>
                  </div>
                  {s < 5 && (
                    <div
                      className={`h-px flex-1 mx-1 ${
                        s < step ? "bg-green-600" : "bg-white"
                      }`}
                    />
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Step Content */}
          <div className="p-6 sm:p-8 min-h-[280px]">
            {/* Step 1: Amount */}
            {step === 1 && (
              <fieldset>
                <legend className="text-sm font-black text-[#8F0028] uppercase tracking-wider mb-4">
                  Choose Your Contribution
                </legend>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {DONATION_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({
                          ...p,
                          amount: preset,
                          customAmount: "",
                        }));
                        setErrors((p) => ({ ...p, amount: undefined }));
                      }}
                      className={`relative p-4 rounded-xl text-center font-bold border transition-all ${
                        formData.amount === preset
                          ? "bg-[var(--color-rm-maroon)] border-[#E8B83F]/30 text-[#8F0028] shadow-lg"
                          : "bg-white border-[#8F0028]/10 text-[#171214] hover:border-[#8F0028]/10"
                      }`}
                      aria-pressed={formData.amount === preset}
                    >
                      <span className="text-lg">
                        {DONATION_CURRENCY.symbol}
                        {preset.toLocaleString("en-IN")}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <label
                    htmlFor="custom-amount"
                    className="text-xs font-bold text-[#756A6E] uppercase tracking-wider"
                  >
                    Or enter a custom amount ({DONATION_CURRENCY.code})
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#756A6E]">
                      <IndianRupee className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <input
                      id="custom-amount"
                      type="number"
                      inputMode="numeric"
                      min={DONATION_LIMITS.min}
                      max={DONATION_LIMITS.max}
                      step="1"
                      placeholder={`${DONATION_LIMITS.min} to ${DONATION_LIMITS.max.toLocaleString("en-IN")}`}
                      value={formData.customAmount}
                      onChange={(e) => {
                        setFormData((p) => ({
                          ...p,
                          customAmount: e.target.value,
                          amount: null,
                        }));
                        setErrors((p) => ({ ...p, amount: undefined }));
                      }}
                      onFocus={() => {
                        setFormData((p) => ({ ...p, amount: null }));
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-[#171214] placeholder:text-[#756A6E] focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)]/50 transition-colors ${
                        errors.amount
                          ? "border-red-500/60"
                          : "border-[#8F0028]/10"
                      }`}
                      aria-invalid={!!errors.amount}
                      aria-describedby={
                        errors.amount ? "amount-error" : undefined
                      }
                    />
                  </div>
                  {errors.amount && (
                    <p
                      id="amount-error"
                      className="text-xs text-red-400 font-medium"
                      role="alert"
                    >
                      {errors.amount}
                    </p>
                  )}
                </div>
              </fieldset>
            )}

            {/* Step 2: Contributor Information */}
            {step === 2 && (
              <fieldset className="space-y-5">
                <legend className="text-sm font-black text-[#8F0028] uppercase tracking-wider mb-4">
                  Your Information
                </legend>

                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="donor-name"
                    className="text-xs font-bold text-[#756A6E] uppercase tracking-wider flex items-center gap-1"
                  >
                    <User className="w-3.5 h-3.5" aria-hidden="true" />
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="donor-name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        fullName: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-[#171214] placeholder:text-[#756A6E] focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)]/50 ${
                      errors.fullName
                        ? "border-red-500/60"
                        : "border-[#8F0028]/10"
                    }`}
                    placeholder="Enter your full name"
                    required
                    aria-invalid={!!errors.fullName}
                    aria-describedby={
                      errors.fullName ? "name-error" : undefined
                    }
                  />
                  {errors.fullName && (
                    <p
                      id="name-error"
                      className="text-xs text-red-400 font-medium"
                      role="alert"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="donor-email"
                    className="text-xs font-bold text-[#756A6E] uppercase tracking-wider flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="donor-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        email: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-[#171214] placeholder:text-[#756A6E] focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)]/50 ${
                      errors.email
                        ? "border-red-500/60"
                        : "border-[#8F0028]/10"
                    }`}
                    placeholder="your.email@example.com"
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={
                      errors.email ? "email-error" : undefined
                    }
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-xs text-red-400 font-medium"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label
                    htmlFor="donor-phone"
                    className="text-xs font-bold text-[#756A6E] uppercase tracking-wider flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="donor-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        phone: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-[#171214] placeholder:text-[#756A6E] focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)]/50 ${
                      errors.phone
                        ? "border-red-500/60"
                        : "border-[#8F0028]/10"
                    }`}
                    placeholder="91XXXXXXXXXX"
                    required
                    aria-invalid={!!errors.phone}
                    aria-describedby={
                      errors.phone ? "phone-error" : undefined
                    }
                  />
                  {errors.phone && (
                    <p
                      id="phone-error"
                      className="text-xs text-red-400 font-medium"
                      role="alert"
                    >
                      {errors.phone}
                    </p>
                  )}
                  <p className="text-[10px] text-[#756A6E]">
                    Required by the payment provider for transaction
                    communication only.
                  </p>
                </div>
              </fieldset>
            )}

            {/* Step 3: Recognition & Privacy */}
            {step === 3 && (
              <fieldset className="space-y-6">
                <legend className="text-sm font-black text-[#8F0028] uppercase tracking-wider mb-4">
                  Recognition and Privacy
                </legend>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-[#171214]">
                    Would you like your name to appear in the Contributors section?
                  </p>

                  <div
                    role="checkbox"
                    aria-checked={formData.isPublic}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        setFormData((p) => ({ ...p, isPublic: !p.isPublic }));
                      }
                    }}
                    onClick={() =>
                      setFormData((p) => ({ ...p, isPublic: !p.isPublic }))
                    }
                    className={`relative w-full rounded-2xl border transition-all duration-300 ease-in-out cursor-pointer p-5 flex items-start gap-4 ${
                      formData.isPublic
                        ? "bg-[#8F0028]/10 border-[#E8B83F]/30 shadow-[0_0_15px_rgba(238,197,126,0.15)]"
                        : "bg-white border-[#8F0028]/10 hover:border-[#8F0028]/10"
                    }`}
                  >
                    <div
                      className={`mt-1 w-6 h-6 flex-shrink-0 rounded flex items-center justify-center border transition-all duration-300 ${
                        formData.isPublic
                          ? "bg-[#8F0028] border-[#E8B83F] text-black"
                          : "bg-[#8F0028]/5 border-[#8F0028]/10"
                      }`}
                    >
                      {formData.isPublic && <Check className="w-4 h-4" strokeWidth={3} />}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-[#171214] leading-tight">
                          Display my name publicly
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase self-start sm:self-auto ${
                            formData.isPublic
                              ? "bg-[#8F0028] text-black"
                              : "bg-white text-[#756A6E]"
                          }`}
                        >
                          {formData.isPublic
                            ? "Public Recognition"
                            : "Anonymous"}
                        </span>
                      </div>
                      <p className="text-xs text-[#756A6E] leading-relaxed pr-2">
                        Your name may appear in the Contributors section if your
                        contribution meets the recognition criteria. Your
                        contribution amount will always remain private.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#756A6E] pt-2 border-t border-[#8F0028]/10">
                    Your donation amount, contact details, and payment information
                    will never be displayed publicly.
                  </p>
                </div>
              </fieldset>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5">
                <p className="text-sm font-black text-[#8F0028] uppercase tracking-wider">
                  Review Your Contribution
                </p>

                <div className="space-y-3">
                  <ReviewRow
                    label="Contribution Amount"
                    value={
                      effectiveAmount
                        ? formatDonationAmount(effectiveAmount)
                        : "Not specified"
                    }
                  />
                  <ReviewRow label="Currency" value={DONATION_CURRENCY.code} />
                  <ReviewRow label="Contributor Name" value={formData.fullName} />
                  <ReviewRow label="Email" value={formData.email} />
                  <ReviewRow label="Phone" value={formData.phone} />
                  <ReviewRow
                    label="Public Recognition"
                    value={
                      formData.isPublic
                        ? "Display my name publicly"
                        : "Anonymous"
                    }
                  />
                  <ReviewRow
                    label="Contribution Purpose"
                    value={formData.purpose}
                  />
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#8F0028]/10 text-[10px] text-[#756A6E] leading-relaxed">
                  <p>
                    Your contribution supports the continued development,
                    preservation, infrastructure, and approved community
                    initiatives of Ravenshaw Moments.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Payment */}
            {step === 5 && (
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8F0028]/10 border border-[#E8B83F]/30 text-[#8F0028] mx-auto">
                  <Shield className="w-8 h-8" aria-hidden="true" />
                </div>

                <div className="space-y-2">
                  <p className="text-lg font-black text-[#171214]">
                    Secure Payment via PayU
                  </p>
                  <p className="text-sm text-[#756A6E] max-w-md mx-auto">
                    You will be securely redirected to PayU to complete your
                    contribution of{" "}
                    <span className="text-[#8F0028] font-bold">
                      {effectiveAmount
                        ? formatDonationAmount(effectiveAmount)
                        : ""}
                    </span>
                    . Your payment information is handled entirely by PayU.
                  </p>
                </div>

                {submitError && (
                  <div
                    className="p-3 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-medium"
                    role="alert"
                  >
                    {submitError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isSubmitting || hasSubmittedRef.current}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#8F0028] text-white text-sm font-black uppercase tracking-wider hover:bg-[#8F0028]/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Preparing Secure Payment...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" aria-hidden="true" />
                      <span>Proceed to PayU</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[#756A6E]">
                  Payment credentials are handled securely by PayU. Ravenshaw
                  Moments does not store card, UPI, or banking details.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          {step < 5 && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white border border-[#8F0028]/10 text-[#171214] text-xs font-bold uppercase tracking-wider hover:bg-white transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[var(--color-rm-maroon)] border border-[#E8B83F]/30 text-[#8F0028] text-xs font-black uppercase tracking-wider hover:bg-[#8F0028]/10 transition-all"
              >
                {step === 4 ? "Continue to Payment" : "Continue"}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {step === 5 && step > 1 && (
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <button
                type="button"
                onClick={goBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white border border-[#8F0028]/10 text-[#171214] text-xs font-bold uppercase tracking-wider hover:bg-white transition-all disabled:opacity-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                Edit Contribution
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden PayU Redirect Form */}
      {payuParams && (
        <form
          ref={payuFormRef}
          method="POST"
          action={payuParams.action}
          style={{ display: "none" }}
          aria-hidden="true"
        >
          {Object.entries(payuParams.params).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </section>
  );
}

// =============================================================================
// Review Row Component
// =============================================================================

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-[#8F0028]/10 last:border-0">
      <span className="text-xs font-bold text-[#756A6E] uppercase tracking-wider shrink-0">
        {label}
      </span>
      <span className="text-sm text-[#171214] font-medium text-right break-words min-w-0">
        {value}
      </span>
    </div>
  );
}
