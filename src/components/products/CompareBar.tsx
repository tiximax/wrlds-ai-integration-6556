import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useCompare } from '@/contexts/CompareContext';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductComparisonTable from '@/components/products/ProductComparisonTable';

const CompareBar: React.FC = () => {
  const { items, remove, clear } = useCompare();
  const [open, setOpen] = React.useState(false);

  if (items.length === 0) return null;

  return (
    <div>
      {/* Floating button */}
      <div className="fixed bottom-20 right-4 z-50 md:bottom-6">
        <EnhancedButton
          variant="primary"
          size="lg"
          className="shadow-lg"
          onClick={() => setOpen(true)}
          data-testid="compare-open-button"
        >
          Compare ({items.length})
        </EnhancedButton>
      </div>

      {/* Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[80vh] overflow-y-auto" data-testid="compare-drawer">
          <DrawerHeader>
            <DrawerTitle>Compare Products</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(p => (
                <div key={p.id} className="border rounded-lg p-3 bg-white relative">
                  <button
                    className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
                    onClick={() => remove(p.id)}
                    aria-label="remove compare"
                    data-testid="compare-remove"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                  <div className="aspect-square overflow-hidden rounded bg-gray-50">
                    <img src={p.images[0]?.url} alt={p.images[0]?.alt || p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-2">
                    <Link to={`/products/${p.slug}`} className="font-medium text-sm line-clamp-2 hover:underline">
                      {p.name}
                    </Link>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(p.sellingPrice)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">⭐ {p.rating.average} ({p.rating.count})</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed comparison table (shows when >= 2 items) */}
            {items.length >= 2 ? (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">So sánh chi tiết</h4>
                <div className="rounded-lg border bg-white p-2">
                  <ProductComparisonTable items={items} />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">Thêm ít nhất 2 sản phẩm để so sánh chi tiết.</div>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <EnhancedButton variant="primary" size="lg">Close</EnhancedButton>
            </DrawerClose>
            <EnhancedButton variant="outline" size="lg" onClick={clear} data-testid="compare-clear">Clear All</EnhancedButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CompareBar;
