import React, { useState } from 'react';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import { Link, useNavigate } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { CheckCircle, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import SecurityBadges from '@/components/trust/SecurityBadges';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AssurancePolicies from '@/components/trust/AssurancePolicies';

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const addressSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ tên'),
  phone: z.string().regex(/^(0\d{9}|\+84\d{9})$/, 'Số điện thoại không hợp lệ'),
  address: z.string().min(10, 'Địa chỉ quá ngắn (>= 10 ký tự)')
});

type AddressForm = z.infer<typeof addressSchema>;

const paymentSchema = z.object({
  method: z.enum(['cod'], { errorMap: () => ({ message: 'Vui lòng chọn phương thức thanh toán' }) })
});

type PaymentForm = z.infer<typeof paymentSchema>;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCart } = useSimpleCart();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const goNext = () => setStep((s) => (s < 4 ? ((s + 1) as any) : s));
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as any) : s));

  // Forms
  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { fullName: '', phone: '', address: '' }
  });

  const paymentForm = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { method: undefined as unknown as any }
  });

  return (
    <div data-testid="checkout-page" className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
        <Link to="/products" className="text-blue-600 hover:underline">Tiếp tục mua sắm</Link>
      </div>

      {/* Trust badges */}
      <div className="mb-4" data-testid="security-badges-checkout">
        <SecurityBadges compact />
      </div>

      {/* Assurance policies */}
      <div className="mb-4" data-testid="assurance-policies-checkout">
        <AssurancePolicies compact />
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-6">
        {['Địa chỉ', 'Thanh toán', 'Xem lại', 'Hoàn tất'].map((label, idx) => {
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
              <label className="block text-sm font-medium mb-1" htmlFor="fullName">Họ và tên</label>
              <input id="fullName" data-testid="fullName" className="w-full border rounded px-3 py-2" placeholder="Nguyễn Văn A" {...addressForm.register('fullName')} />
              {addressForm.formState.errors.fullName && (
                <p className="text-red-600 text-xs mt-1" data-testid="error-fullName">{addressForm.formState.errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">Số điện thoại</label>
              <input id="phone" data-testid="phone" className="w-full border rounded px-3 py-2" placeholder="0901234567" {...addressForm.register('phone')} />
              {addressForm.formState.errors.phone && (
                <p className="text-red-600 text-xs mt-1" data-testid="error-phone">{addressForm.formState.errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="address">Địa chỉ</label>
              <input id="address" data-testid="address" className="w-full border rounded px-3 py-2" placeholder="123 Đường ABC, Quận XYZ" {...addressForm.register('address')} />
              {addressForm.formState.errors.address && (
                <p className="text-red-600 text-xs mt-1" data-testid="error-address">{addressForm.formState.errors.address.message}</p>
              )}
            </div>
            <div className="flex justify-end">
              <EnhancedButton type="submit" data-testid="address-continue" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Tiếp tục
              </EnhancedButton>
            </div>
          </form>
        )}

        {step === 2 && (
          <form data-testid="step-payment" className="space-y-4" onSubmit={paymentForm.handleSubmit(() => goNext())}>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Phương thức thanh toán</label>
              <div className="flex items-center gap-3">
                <input id="payment-cod" data-testid="payment-cod" type="radio" value="cod" className="accent-blue-600" {...paymentForm.register('method')} />
                <label htmlFor="payment-cod">Thanh toán khi nhận hàng (COD)</label>
              </div>
              {paymentForm.formState.errors.method && (
                <p className="text-red-600 text-xs mt-1" data-testid="error-method">{paymentForm.formState.errors.method.message}</p>
              )}
            </div>
            <div className="flex justify-between">
              <EnhancedButton type="button" variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={goBack}>
                Quay lại
              </EnhancedButton>
              <EnhancedButton type="submit" data-testid="payment-continue" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Tiếp tục
              </EnhancedButton>
            </div>
          </form>
        )}

        {step === 3 && (
          <div data-testid="step-review" className="space-y-4">
            <div className="border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Sản phẩm ({totalItems})</span>
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
                Quay lại
              </EnhancedButton>
              <EnhancedButton data-testid="place-order" rightIcon={<CheckCircle className="w-4 h-4" />} onClick={() => setStep(4)}>
                Đặt hàng
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
