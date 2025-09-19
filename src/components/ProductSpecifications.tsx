import React from 'react';
import { Product } from '@/types/simple';

interface ProductSpecificationsProps {
  product: Product;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product }) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Product Specifications</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Origin:</span>
          <span className="font-medium">{product.origin.toUpperCase()}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium capitalize">{product.type.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Status:</span>
          <span className="font-medium capitalize">{product.status}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Stock:</span>
          <span className="font-medium">{product.stock} units</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Source:</span>
          <span className="font-medium">{product.sourceSite}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-1">
          <span className="text-gray-600">Category:</span>
          <span className="font-medium">{product.category.name}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecifications;