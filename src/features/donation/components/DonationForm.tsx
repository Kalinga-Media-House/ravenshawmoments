"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  IndianRupee,
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  Shield,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Check,
  Award,
  CreditCard,
  Heart
} from "lucide-react";
import {
  DONATION_PRESETS,
  DONATION_LIMITS,
  DONATION_CURRENCY,
  formatDonationAmount,
  validateDonationAmount,
  DEFAULT_CONTRIBUTION_PURPOSE,
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

type Step = 1 | 2 | 3;

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
    isPublic: true,
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

  // ==========================================================================
  // Navigation
  // ==========================================================================

  const goNext = () => {
    setSubmitError(null);
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(s + 1, 3) as Step);
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
        setSubmitError(result.error || "We could not start the secure payment process. Please try again.");
        setIsSubmitting(false);
        return;
      }
      setPayuParams(result);
    } catch {
      setSubmitError("Payment setup is temporarily unavailable. Please try again later.");
      setIsSubmitting(false);
    }
  };

  const effectiveAmount = getEffectiveAmount();

  return (
    <section id="donate" className="relative py-20 lg:py-28 bg-[#FFFDF8] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-[#3A0016]/5 to-transparent z-0" />
      <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-4xl">
        
        {isTestMode && (
          <div className="mb-8 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-sm font-bold uppercase tracking-widest max-w-fit mx-auto shadow-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>PayU Test Mode Active</span>
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-[#3A0016] font-serif mb-4">
            Become a Contributor
          </h2>
          <p className="text-[#3A0016]/70 text-lg">
            Follow the simple steps below to make your secure contribution.
          </p>
        </div>

        {/* Timeline Indicator */}
        <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#3A0016]/10 rounded-full z-0" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#D4AF37] to-[#C8A046] rounded-full z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          
          {[
            { id: 1, icon: Heart, label: "Amount" },
            { id: 2, icon: User, label: "Details" },
            { id: 3, icon: CreditCard, label: "Payment" }
          ].map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${s.id === step ? "bg-[#D4AF37] text-white scale-110" : s.id < step ? "bg-[#3A0016] text-white" : "bg-white text-[#3A0016]/40 border-2 border-[#3A0016]/10"}`}>
                {s.id < step ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={`absolute -bottom-8 w-32 text-center text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${s.id === step ? "text-[#D4AF37]" : s.id < step ? "text-[#3A0016]" : "text-[#3A0016]/40"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="mt-16 bg-white/70 backdrop-blur-xl border border-[#3A0016]/10 rounded-[2rem] shadow-2xl p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#3A0016]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10">
            {/* Step 1: Choose Amount */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-[#3A0016] mb-8 text-center font-serif">Choose Your Contribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                  {DONATION_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({ ...p, amount: preset, customAmount: "" }));
                        setErrors((p) => ({ ...p, amount: undefined }));
                      }}
                      className={`relative p-6 rounded-2xl text-center transition-all duration-300 ${
                        formData.amount === preset
                          ? "bg-gradient-to-br from-[#3A0016] to-[#4A0D1A] text-white shadow-[0_10px_30px_rgba(58,0,22,0.3)] border-[#D4AF37] border"
                          : "bg-white text-[#3A0016] border border-[#3A0016]/10 hover:border-[#D4AF37]/50 hover:shadow-lg hover:-translate-y-1"
                      }`}
                    >
                      <span className="text-2xl md:text-3xl font-black block">
                        {DONATION_CURRENCY.symbol}{preset.toLocaleString("en-IN")}
                      </span>
                    </button>
                  ))}
                </div>
                
                <div className="max-w-md mx-auto relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <IndianRupee className="w-5 h-5 text-[#3A0016]/50" />
                  </div>
                  <input
                    type="number"
                    placeholder="Custom Amount"
                    value={formData.customAmount}
                    onChange={(e) => {
                      setFormData(p => ({ ...p, customAmount: e.target.value, amount: null }));
                      setErrors(p => ({ ...p, amount: undefined }));
                    }}
                    className={`w-full pl-12 pr-6 py-4 rounded-xl bg-white border text-lg font-bold text-[#3A0016] placeholder:text-[#3A0016]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${errors.amount ? 'border-red-500' : 'border-[#3A0016]/10'}`}
                  />
                  {errors.amount && <p className="text-red-500 text-sm mt-2 text-center font-medium">{errors.amount}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Enter Details */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
                <h3 className="text-2xl font-black text-[#3A0016] mb-8 text-center font-serif">Your Details</h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-[#3A0016]/70 uppercase tracking-wider ml-1 mb-2 block">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                      className={`w-full px-5 py-4 rounded-xl bg-white border text-[#3A0016] font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${errors.fullName ? 'border-red-500' : 'border-[#3A0016]/10'}`}
                      placeholder="e.g. Subhas Chandra Bose"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName}</p>}
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-[#3A0016]/70 uppercase tracking-wider ml-1 mb-2 block">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                      className={`w-full px-5 py-4 rounded-xl bg-white border text-[#3A0016] font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${errors.email ? 'border-red-500' : 'border-[#3A0016]/10'}`}
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-[#3A0016]/70 uppercase tracking-wider ml-1 mb-2 block">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className={`w-full px-5 py-4 rounded-xl bg-white border text-[#3A0016] font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${errors.phone ? 'border-red-500' : 'border-[#3A0016]/10'}`}
                      placeholder="91XXXXXXXXXX"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                  </div>

                  <div 
                    onClick={() => setFormData(p => ({ ...p, isPublic: !p.isPublic }))}
                    className={`mt-6 p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${formData.isPublic ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-white border-[#3A0016]/10'}`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${formData.isPublic ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 border'}`}>
                      {formData.isPublic && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-bold text-[#3A0016]">Publicly recognize my contribution</p>
                      <p className="text-sm text-[#3A0016]/70 mt-1">Your name may appear on the Contributors board. Your donation amount will remain strictly private.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Secure Payment */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3A0016] to-[#4A0D1A] mx-auto flex items-center justify-center mb-6 shadow-xl">
                  <Shield className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl font-black text-[#3A0016] mb-2 font-serif">Secure Checkout</h3>
                <p className="text-[#3A0016]/70 mb-8">
                  You are about to make a secure contribution of <span className="font-black text-[#D4AF37] text-lg">{DONATION_CURRENCY.symbol}{effectiveAmount?.toLocaleString("en-IN")}</span>.
                </p>
                
                <div className="bg-white rounded-2xl p-6 border border-[#3A0016]/10 text-left mb-8 shadow-sm">
                  <div className="flex justify-between py-3 border-b border-[#3A0016]/5">
                    <span className="text-[#3A0016]/60 font-bold uppercase text-xs">Name</span>
                    <span className="text-[#3A0016] font-medium">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#3A0016]/5">
                    <span className="text-[#3A0016]/60 font-bold uppercase text-xs">Email</span>
                    <span className="text-[#3A0016] font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-[#3A0016]/60 font-bold uppercase text-xs">Visibility</span>
                    <span className="text-[#3A0016] font-medium">{formData.isPublic ? 'Public' : 'Anonymous'}</span>
                  </div>
                </div>

                {submitError && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                    {submitError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isSubmitting || hasSubmittedRef.current}
                  className="w-full flex items-center justify-center py-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A046] text-white font-black uppercase tracking-widest hover:shadow-[0_10px_25px_rgba(212,175,55,0.4)] transition-all hover:-translate-y-1 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard className="w-5 h-5 mr-3" /> Pay Securely via PayU</>
                  )}
                </button>
                <p className="text-xs text-[#3A0016]/50 mt-4 flex items-center justify-center">
                  <Shield className="w-3 h-3 mr-1" /> 256-bit SSL Encrypted Transaction
                </p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-12 pt-8 border-t border-[#3A0016]/10 flex items-center justify-between relative z-10">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                disabled={isSubmitting}
                className="flex items-center text-[#3A0016]/70 font-bold hover:text-[#3A0016] transition-colors uppercase tracking-wider text-sm disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
            ) : <div />}

            {step < 3 && (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center px-8 py-3 rounded-full bg-[#3A0016] text-white font-bold uppercase tracking-wider text-sm hover:bg-[#D4AF37] transition-all hover:shadow-lg"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      {payuParams && (
        <form ref={payuFormRef} method="POST" action={payuParams.action} style={{ display: "none" }}>
          {Object.entries(payuParams.params).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </section>
  );
}
