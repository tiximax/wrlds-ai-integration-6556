import React from 'react';
import { ShieldCheck, Lock, CreditCard, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecurityBadgesProps {
  className?: string;
  compact?: boolean;
}

const SecurityBadges: React.FC<SecurityBadgesProps> = ({ className, compact = false }) => {
  const items = [
    { icon: ShieldCheck, label: 'SSL 256-bit', desc: 'Mã hóa an toàn' },
    { icon: CreditCard, label: 'Thanh toán bảo mật', desc: 'PCI DSS compliant' },
    { icon: BadgeCheck, label: 'Đảm bảo mua sắm', desc: 'Hoàn tiền theo chính sách' },
  ];

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3 text-gray-600', className)}>
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2 text-xs">
            <it.icon className="w-4 h-4 text-green-600" />
            <span className="font-medium">{it.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-4', className)} data-testid="security-badges">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <it.icon className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-sm font-semibold text-gray-900">{it.label}</div>
            <div className="text-xs text-gray-500">{it.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SecurityBadges;
