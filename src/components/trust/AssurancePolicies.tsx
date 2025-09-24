import React from 'react';
import { RefreshCw, ShieldCheck, Headphones } from 'lucide-react';

const items = [
  {
    icon: RefreshCw,
    title: '30-day Returns',
    desc: 'Đổi trả dễ dàng trong 30 ngày nếu không hài lòng.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    desc: 'Thanh toán an toàn, mã hóa SSL, bảo vệ dữ liệu.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Hỗ trợ khách hàng 24/7, phản hồi nhanh chóng.',
  },
];

const AssurancePolicies: React.FC<{ compact?: boolean; className?: string }>= ({ compact = false, className = '' }) => {
  return (
    <section className={`w-full ${className}`} data-testid="assurance-policies">
      <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'} gap-3`}>
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className={`flex items-start gap-3 rounded-md border bg-white ${compact ? 'p-2' : 'p-3'}`}>
            <div className={`shrink-0 rounded-md ${compact ? 'p-1.5' : 'p-2'} bg-gray-50 border`}>
              <Icon className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-gsa-primary`} />
            </div>
            <div className="min-w-0">
              <div className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>{title}</div>
              <div className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AssurancePolicies;