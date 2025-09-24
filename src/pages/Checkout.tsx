import React, { useState } from 'react';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import { Link, useNavigate } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { CheckCircle, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Lock } from 'lucide-react';
import SecurityBadges from '@/components/trust/SecurityBadges';

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCart } = useSimpleCart();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const goNext = () => setStep((s) => (s < 4 ? ((s + 1) as any) : s));
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as any) : s));

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
          <div data-testid="step-address" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <input className="w-full border rounded px-3 py-2" placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input className="w-full border rounded px-3 py-2" placeholder="0901234567" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Địa chỉ</label>
              <input className="w-full border rounded px-3 py-2" placeholder="123 Đường ABC, Quận XYZ" />
            </div>
            <div className="flex justify-end">
              <EnhancedButton data-testid="address-continue" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={goNext}>
                Tiếp tục
              </EnhancedButton>
            </div>
          </div>
        )}

        {step === 2 && (
          <div data-testid="step-payment" className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Phương thức thanh toán</label>
              <div className="flex items-center gap-3">
                <input id="payment-mock" type="radio" name="payment" defaultChecked className="accent-blue-600" />
                <label htmlFor="payment-mock">Thanh toán khi nhận hàng (Mock)</label>
              </div>
            </div>
            <div className="flex justify-between">
              <EnhancedButton variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={goBack}>
                Quay lại
              </EnhancedButton>
              <EnhancedButton data-testid="payment-continue" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={goNext}>
                Tiếp tục
              </EnhancedButton>
            </div>
          </div>
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
