import React, { useState } from 'react';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import { Link, useNavigate } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { CheckCircle, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import SecurityBadges from '@/components/trust/SecurityBadges';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AssurancePolicies from '@/components/trust/AssurancePolicies';
import { useAnalytics } from '@/contexts/AnalyticsContext';

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

type AddressForm = {
  fullName: string;
  phone: string;
  address: string;
};

type PaymentForm = {
  method?: 'cod' | 'card' | 'paypal';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
};

const LS_ADDR_KEY = 'checkout-address-v1';
const LS_PAY_KEY = 'checkout-payment-v1';

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCart } = useSimpleCart();
  const { track } = useAnalytics();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const goNext = () => setStep((s) => (s < 4 ? ((s + 1) as any) : s));
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as any) : s));

  // Track step changes
  React.useEffect(() => {
    try {
      track('checkout_step', { step, total_items: totalItems, total_price: totalPrice });
    } catch {}
  }, [step, totalItems, totalPrice]);

  // Load saved drafts
  // Dynamic schemas with i18n
  const addressSchema = useMemo(() => z.object({
    fullName: z.string().min(2, t('checkout.errors.fullName')),
    phone: z.string().regex(/^(0\d{9}|\+84\d{9})$/, t('checkout.errors.phone')),
    address: z.string().min(10, t('checkout.errors.address'))
  }), [t]);

  const paymentSchema = useMemo(() => z.object({
    method: z.enum(['cod', 'card', 'paypal'], { errorMap: () => ({ message: t('checkout.errors.method') }) }),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.method === 'card') {
      if (!/^\d{16}$/.test(data.cardNumber || '')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cardNumber'], message: t('checkout.errors.cardNumber') });
      }
      if ((data.cardName || '').trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cardName'], message: t('checkout.errors.cardName') });
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry || '')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cardExpiry'], message: t('checkout.errors.cardExpiry') });
      }
      if (!/^\d{3}$/.test(data.cardCvv || '')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cardCvv'], message: t('checkout.errors.cardCvv') });
      }
    }
  }), [t]);

  const savedAddress = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_ADDR_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const result = addressSchema.safeParse(parsed);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  }, [addressSchema]);

  const savedPayment = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_PAY_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const result = paymentSchema.safeParse(parsed);
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  }, [paymentSchema]);

  // Forms
  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: savedAddress ?? { fullName: '', phone: '', address: '' }
  });

  const paymentForm = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: savedPayment ?? { method: undefined as unknown as any }
  });

  // Persist drafts on change
  useEffect(() => {
    const subscription = addressForm.watch((value) => {
      try {
        localStorage.setItem(LS_ADDR_KEY, JSON.stringify(value));
      } catch {}
    });
    return () => subscription?.unsubscribe?.();
  }, [addressForm]);

  useEffect(() => {
    const subscription = paymentForm.watch((value) => {
      try {
        localStorage.setItem(LS_PAY_KEY, JSON.stringify(value));
      } catch {}
    });
    return () => subscription?.unsubscribe?.();
  }, [paymentForm]);

  return (
    <div data-testid="checkout-page" className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <h1 className="text-2xl font-bold">{t('checkout.title')}</h1>
          </div>
          <Link to="/products" className="text-blue-600 hover:underline">{t('checkout.continueShopping')}</Link>
        </div>

      {/* Trust badges */}
      <div className="mb-4" data-testid="security-badges-checkout">
        <SecurityBadges compact />
      </div>

      {/* Draft controls */}
      <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
        <span>{t('checkout.draft.notice')}</span>
        <button
          type="button"
          className="text-blue-600 hover:underline"
          data-testid="clear-saved"
          onClick={() => {
            try {
              localStorage.removeItem(LS_ADDR_KEY);
              localStorage.removeItem(LS_PAY_KEY);
            } catch {}
            addressForm.reset({ fullName: '', phone: '', address: '' });
            paymentForm.reset({ method: undefined as unknown as any });
            setStep(1);
          }}
>
          {t('checkout.draft.clearSaved')}
        </button>
      </div>

      {/* Assurance policies */}
      <div className="mb-4" data-testid="assurance-policies-checkout">
        <AssurancePolicies compact />
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-6">
        {[t('checkout.stepper.address'), t('checkout.stepper.payment'), t('checkout.stepper.review'), t('checkout.stepper.complete')].map((label, idx) => {
          const index = idx + 1;
          const active = step === index;
          const complete = step > index;
          return (
            <div key={label} className="flex items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border ${complete ? 'bg-green-600 text-white border-green-600' : active ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-500'}`}> {index} </div>
              <span className={`ml-2 text-sm ${active ? 'text-blue-600' : complete ? 'text-green-600' : 'text-gray-500'}`}>{label}</span>
              {index < 4 && <div className={`w-12 h-0.5 mx-3 ${step > index ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white border rounded-lg p-4">
        {step === 1 && (
          <form data-testid="step-address" className="space-y-4" onSubmit={addressForm.handleSubmit(() => goNext())}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="fullName">{t('checkout.labels.fullName')}</label>
              <input id="fullName" data-testid="fullName" className="w-full border rounded px-3 py-2" placeholder="Nguyễn Văn A" {...addressForm.register('fullName')} />
              {addressForm.formState.errors.fullName && (
                <p className="text-red-600 text-xs mt-1" data-testid="error-fullName">{addressForm.formState.errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">{t('checkout.labels.phone')}</label>
              <input id="phone" data-testid="phone" className="w-full border rounded px-3 py-2" placeholder="0901234567" {...addressForm.register('phone')} />
              {addressForm.formState.errors.phone && (
                <p className="text-red-600 text-xs mt-1" data-testid="error-phone">{addressForm.formState.errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="address">{t('checkout.labels.address')}</label>
              <input id="address" data-testid="address" className="w-full border rounded px-3 py-2" placeholder="123 Đường ABC, Quận XYZ" {...addressForm.register('address')} />
              {addressForm.formState.errors.address && (
                <p className="text-red-600 text-xs mt-1" data-testid="error-address">{addressForm.formState.errors.address.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <EnhancedButton type="submit" data-testid="address-continue" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t('checkout.actions.continue')}
              </EnhancedButton>
            </div>
          </form>
        )}

        {step === 2 && (
          <form data-testid="step-payment" className="space-y-4" onSubmit={paymentForm.handleSubmit(() => goNext())}>
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t('checkout.labels.paymentMethod')}</label>
              <div className="flex items-center gap-3">
                <input id="payment-cod" data-testid="payment-cod" type="radio" value="cod" className="accent-blue-600" {...paymentForm.register('method')} />
                <label htmlFor="payment-cod">{t('checkout.methods.cod')}</label>
              </div>
              <div className="flex items-center gap-3">
                <input id="payment-card" data-testid="payment-card" type="radio" value="card" className="accent-blue-600" {...paymentForm.register('method')} />
                <label htmlFor="payment-card">{t('checkout.methods.card')}</label>
              </div>
              <div className="flex items-center gap-3">
                <input id="payment-paypal" data-testid="payment-paypal" type="radio" value="paypal" className="accent-blue-600" {...paymentForm.register('method')} />
                <label htmlFor="payment-paypal">{t('checkout.methods.paypal')}</label>
              </div>
              {paymentForm.formState.errors.method && (
                <p className="text-red-600 text-xs mt-1" data-testid="error-method">{paymentForm.formState.errors.method.message}</p>
              )}

              {/* Card details */}
              {paymentForm.watch('method') === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2" data-testid="card-fields">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1" htmlFor="cardNumber">{t('checkout.labels.cardNumber')}</label>
                    <input id="cardNumber" data-testid="cardNumber" className="w-full border rounded px-3 py-2" placeholder="4111111111111111" {...paymentForm.register('cardNumber')} />
                    {paymentForm.formState.errors.cardNumber && (
                      <p className="text-red-600 text-xs mt-1" data-testid="error-cardNumber">{(paymentForm.formState.errors as any).cardNumber?.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="cardName">{t('checkout.labels.cardName')}</label>
                    <input id="cardName" data-testid="cardName" className="w-full border rounded px-3 py-2" placeholder="NGUYEN VAN A" {...paymentForm.register('cardName')} />
                    {paymentForm.formState.errors.cardName && (
                      <p className="text-red-600 text-xs mt-1" data-testid="error-cardName">{(paymentForm.formState.errors as any).cardName?.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="cardExpiry">{t('checkout.labels.cardExpiry')}</label>
                    <input id="cardExpiry" data-testid="cardExpiry" className="w-full border rounded px-3 py-2" placeholder="MM/YY" {...paymentForm.register('cardExpiry')} />
                    {paymentForm.formState.errors.cardExpiry && (
                      <p className="text-red-600 text-xs mt-1" data-testid="error-cardExpiry">{(paymentForm.formState.errors as any).cardExpiry?.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="cardCvv">{t('checkout.labels.cardCvv')}</label>
                    <input id="cardCvv" data-testid="cardCvv" className="w-full border rounded px-3 py-2" placeholder="123" {...paymentForm.register('cardCvv')} />
                    {paymentForm.formState.errors.cardCvv && (
                      <p className="text-red-600 text-xs mt-1" data-testid="error-cardCvv">{(paymentForm.formState.errors as any).cardCvv?.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* PayPal note */}
              {paymentForm.watch('method') === 'paypal' && (
                <p className="text-xs text-gray-600 mt-2">{t('checkout.methods.paypalNote')}</p>
              )}
            </div>
            <div className="flex justify-between">
              <EnhancedButton type="button" variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={goBack}>
                {t('checkout.actions.back')}
              </EnhancedButton>
              <EnhancedButton type="submit" data-testid="payment-continue" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t('checkout.actions.continue')}
              </EnhancedButton>
            </div>
          </form>
        )}

        {step === 3 && (
          <div data-testid="step-review" className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="review-summary">
              <div className="border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{t('checkout.summary.address')}</span>
                  <button className="text-xs text-blue-600 hover:underline" data-testid="edit-address" onClick={() => setStep(1)}>
                    {t('checkout.actions.edit')}
                  </button>
                </div>
                <div className="text-sm text-gray-700">
                  <div>{addressForm.getValues('fullName')}</div>
                  <div>{addressForm.getValues('phone')}</div>
                  <div>{addressForm.getValues('address')}</div>
                </div>
              </div>
              <div className="border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{t('checkout.summary.payment')}</span>
                  <button className="text-xs text-blue-600 hover:underline" data-testid="edit-payment" onClick={() => setStep(2)}>
                    {t('checkout.actions.edit')}
                  </button>
                </div>
                <div className="text-sm text-gray-700">
                  {paymentForm.getValues('method') === 'cod' && <div>{t('checkout.methods.cod')}</div>}
                  {paymentForm.getValues('method') === 'paypal' && <div>{t('checkout.methods.paypal')}</div>}
                  {paymentForm.getValues('method') === 'card' && (
                    <div>
                      {t('checkout.methods.card')}
                      <div>
                        {t('checkout.summary.cardEnding', { last4: (paymentForm.getValues('cardNumber') || '').slice(-4) })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t('checkout.summary.items', { count: totalItems })}</span>
                <span className="font-semibold text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <ul className="divide-y">
                {items.map((it) => (
                  <li key={it.id} className="py-2 flex items-center justify-between text-sm">
                    <span className="truncate mr-2">{it.product.name}</span>
                    <span>x{it.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between">
              <EnhancedButton variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={goBack}>
                {t('checkout.actions.back')}
              </EnhancedButton>
              <EnhancedButton data-testid="place-order" rightIcon={<CheckCircle className="w-4 h-4" />} onClick={() => { try { track('order_placed', { total_items: totalItems, total_price: totalPrice }); } catch {}; setStep(4); }}>
                {t('checkout.actions.placeOrder')}
              </EnhancedButton>
            </div>
          </div>
        )}

        {step === 4 && (
          <div data-testid="order-confirmation" className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold">Đặt hàng thành công!</h2>
            <p className="text-gray-600">Chúng tôi sẽ liên hệ để xác nhận và giao hàng sớm nhất.</p>
            <div className="flex items-center justify-center gap-3">
              <EnhancedButton onClick={() => { clearCart(); navigate('/'); }}>Về trang chủ</EnhancedButton>
              <Link to="/products"><EnhancedButton variant="secondary">Tiếp tục mua sắm</EnhancedButton></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
