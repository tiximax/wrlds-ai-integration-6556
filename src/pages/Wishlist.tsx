import React from 'react';
import PageLayout from '@/components/PageLayout';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSimpleCart } from '@/contexts/SimpleCartContext';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useSimpleCart();

  const formatPrice = (price: number, currency = 'VND') => new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(price);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearWishlist}>
              <Trash2 className="w-4 h-4 mr-2" /> Clear all
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Danh sách yêu thích của bạn đang trống.</p>
            <Link to="/products">
              <Button>Khám phá sản phẩm</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(({ id, product }) => {
              const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
              return (
                <div key={id} className="border rounded-lg overflow-hidden bg-white">
                  <Link to={`/products/${product.slug}`}>
                    <div className="aspect-video bg-gray-100">
                      <img src={primaryImage?.url} alt={primaryImage?.alt || product.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="p-4 space-y-2">
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">{product.name}</h3>
                    </Link>
                    <div className="text-sm text-gray-600">{product.category.name}</div>
                    <div className="font-bold text-primary">{formatPrice(product.sellingPrice, product.currency)}</div>
                    <div className="flex gap-2 pt-2">
                      <Button data-testid="wishlist-add-to-cart" onClick={() => addToCart(product as any)} className="flex-1">
                        <ShoppingCart className="w-4 h-4 mr-2" /> Thêm vào giỏ
                      </Button>
                      <Button data-testid="wishlist-remove" aria-label="Remove from wishlist" variant="outline" onClick={() => removeFromWishlist(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default WishlistPage;