import React from 'react';
import type { Product } from '@/types/simple';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ProductComparisonTableProps {
  items: Product[];
  className?: string;
}

// Format helpers
const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

const ProductComparisonTable: React.FC<ProductComparisonTableProps> = ({ items, className }) => {
  if (!items || items.length < 2) {
    return null;
  }

  // Standardized attribute rows
  const rows: { key: string; label: string; render: (p: Product) => React.ReactNode }[] = [
    { key: 'name', label: 'Tên sản phẩm', render: (p) => p.name },
    { key: 'price', label: 'Giá bán', render: (p) => formatCurrency(p.sellingPrice, p.currency) },
    { key: 'origin', label: 'Xuất xứ', render: (p) => p.origin.toUpperCase() },
    { key: 'status', label: 'Trạng thái', render: (p) => p.status.replaceAll('_', ' ') },
    { key: 'rating', label: 'Đánh giá', render: (p) => `${p.rating.average} (${p.rating.count})` },
    { key: 'stock', label: 'Tồn kho', render: (p) => p.stock },
    { key: 'tags', label: 'Tags', render: (p) => p.tags.slice(0, 6).join(', ') || '-' },
  ];

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop/Table layout */}
      <div className="hidden md:block" data-testid="comparison-table">
        <Table>
          <TableCaption>So sánh chi tiết giữa các sản phẩm đã chọn</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Thuộc tính</TableHead>
              {items.map((p) => (
                <TableHead key={p.id} className="min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-50">
                      <img src={p.images[0]?.url} alt={p.images[0]?.alt || p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-medium line-clamp-2">{p.name}</div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key}>
                <TableCell className="font-medium text-gray-600">{row.label}</TableCell>
                {items.map((p) => (
                  <TableCell key={p.id}>{row.render(p)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile stacked layout */}
      <div className="md:hidden">
        <div className="space-y-4">
          {items.map((p) => (
            <div key={p.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded overflow-hidden bg-gray-50">
                  <img src={p.images[0]?.url} alt={p.images[0]?.alt || p.name} className="w-full h-full object-cover" />
                </div>
                <div className="font-semibold line-clamp-2">{p.name}</div>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {rows.map((row) => (
                  <React.Fragment key={row.key}>
                    <dt className="text-gray-500">{row.label}</dt>
                    <dd>{row.render(p)}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonTable;