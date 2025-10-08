import React from 'react';
import { ShieldCheck, RefreshCw, BadgeCheck, Truck } from 'lucide-react';

const GuaranteeBadges: React.FC<{ className?: string }>= ({ className = '' }) => {
  const items = [
    { icon: ShieldCheck, title: 'Bảo hành chính hãng', desc: 'Cam kết sản phẩm chính hãng, đầy đủ bảo hành' },
    { icon: RefreshCw, title: 'Hoàn tiền 7 ngày', desc: 'Đổi trả/hoàn tiền trong 7 ngày nếu có lỗi' },
    { icon: BadgeCheck, title: 'Hàng mới 100%', desc: 'Nguyên seal/hộp, chưa qua sử dụng' },
    { icon: Truck, title: 'Miễn phí đổi cỡ', desc: 'Áp dụng cho một số ngành hàng (giày/quần áo)' },
  ];

  return (
    <section className={`w-full ${className}`} data-testid="guarantee-badges">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3 p-3 rounded-md border bg-white">
            <div className="shrink-0 p-2 rounded-md bg-gray-50 border">
              <Icon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">{title}</div>
              <div className="text-xs text-gray-600">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuaranteeBadges;