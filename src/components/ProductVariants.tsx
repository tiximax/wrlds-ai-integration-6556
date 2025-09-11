import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Check } from 'lucide-react';
import { Product, ProductVariant } from '@/types/product';

interface ProductVariantsProps {
  product: Product;
  selectedVariants: Record<string, string>;
  onVariantChange: (variantType: string, value: string) => void;
  onPriceChange?: (newPrice: number) => void;
}

interface VariantGroup {
  name: string;
  options: { value: string; label: string; available: boolean; priceAdjustment?: number; stock?: number }[];
}

const ProductVariants: React.FC<ProductVariantsProps> = ({
  product,
  selectedVariants,
  onVariantChange,
  onPriceChange
}) => {
  // Group variants by type (e.g., size, color, etc.)
  const variantGroups: Record<string, VariantGroup> = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return {};
    }

    const groups: Record<string, VariantGroup> = {};

    product.variants.forEach(variant => {
      // Extract variant type from name (assuming format like "Size: L", "Color: Red")
      const parts = variant.name.split(':');
      const type = parts[0]?.trim() || 'Option';
      const value = parts[1]?.trim() || variant.value;

      if (!groups[type]) {
        groups[type] = {
          name: type,
          options: []
        };
      }

      const existing = groups[type].options.find(opt => opt.value === value);
      if (!existing) {
        groups[type].options.push({
          value: value,
          label: value,
          available: variant.stock > 0,
          priceAdjustment: variant.priceAdjustment,
          stock: variant.stock
        });
      }
    });

    return groups;
  }, [product.variants]);

  // Calculate current price with variant adjustments
  const currentPrice = useMemo(() => {
    let price = product.sellingPrice;
    
    Object.entries(selectedVariants).forEach(([type, value]) => {
      const group = variantGroups[type];
      const option = group?.options.find(opt => opt.value === value);
      if (option?.priceAdjustment) {
        price += option.priceAdjustment;
      }
    });

    return price;
  }, [product.sellingPrice, selectedVariants, variantGroups]);

  // Check if current selection is in stock
  const isInStock = useMemo(() => {
    // If no variants, use product stock
    if (Object.keys(variantGroups).length === 0) {
      return product.stock > 0;
    }

    // Check if all selected variants are available
    return Object.entries(selectedVariants).every(([type, value]) => {
      const group = variantGroups[type];
      const option = group?.options.find(opt => opt.value === value);
      return option?.available;
    });
  }, [selectedVariants, variantGroups, product.stock]);

  // Get current stock for selected variants
  const currentStock = useMemo(() => {
    if (Object.keys(variantGroups).length === 0) {
      return product.stock;
    }

    // Find the minimum stock among selected variants
    let minStock = product.stock;
    Object.entries(selectedVariants).forEach(([type, value]) => {
      const group = variantGroups[type];
      const option = group?.options.find(opt => opt.value === value);
      if (option?.stock !== undefined) {
        minStock = Math.min(minStock, option.stock);
      }
    });

    return minStock;
  }, [selectedVariants, variantGroups, product.stock]);

  // Handle variant selection
  const handleVariantSelect = (type: string, value: string) => {
    onVariantChange(type, value);
    
    // Calculate new price and notify parent
    const newSelectedVariants = { ...selectedVariants, [type]: value };
    let newPrice = product.sellingPrice;
    
    Object.entries(newSelectedVariants).forEach(([variantType, variantValue]) => {
      const group = variantGroups[variantType];
      const option = group?.options.find(opt => opt.value === variantValue);
      if (option?.priceAdjustment) {
        newPrice += option.priceAdjustment;
      }
    });

    onPriceChange?.(newPrice);
  };

  // If no variants, don't render anything
  if (Object.keys(variantGroups).length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Options</h3>
        
        {Object.entries(variantGroups).map(([type, group]) => (
          <div key={type} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                {group.name}
              </label>
              {selectedVariants[type] && (
                <span className="text-sm text-gray-500">
                  Selected: {selectedVariants[type]}
                </span>
              )}
            </div>

            {/* Button-style selector for sizes/colors */}
            {(type.toLowerCase() === 'size' || type.toLowerCase() === 'color') ? (
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const isSelected = selectedVariants[type] === option.value;
                  const isDisabled = !option.available;

                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      disabled={isDisabled}
                      onClick={() => handleVariantSelect(type, option.value)}
                      className={`relative ${
                        isDisabled 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:border-gray-400'
                      } ${
                        type.toLowerCase() === 'color' 
                          ? 'min-w-[3rem] h-10' 
                          : 'min-w-[2.5rem]'
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 absolute top-1 right-1" />
                      )}
                      
                      {/* Color preview for color variants */}
                      {type.toLowerCase() === 'color' && (
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                          style={{ 
                            backgroundColor: option.value.toLowerCase() === 'multicolor' 
                              ? 'transparent' 
                              : option.value.toLowerCase()
                          }}
                        />
                      )}
                      
                      {option.label}
                      
                      {option.priceAdjustment && option.priceAdjustment !== 0 && (
                        <span className="ml-1 text-xs">
                          ({option.priceAdjustment > 0 ? '+' : ''}{option.priceAdjustment.toLocaleString('vi-VN')}₫)
                        </span>
                      )}
                      
                      {isDisabled && (
                        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Out</span>
                        </div>
                      )}
                    </Button>
                  );
                })}
              </div>
            ) : (
              /* Dropdown selector for other variant types */
              <Select 
                value={selectedVariants[type] || ''} 
                onValueChange={(value) => handleVariantSelect(type, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Choose ${group.name.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {group.options.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      disabled={!option.available}
                      className="flex justify-between items-center"
                    >
                      <span>{option.label}</span>
                      {option.priceAdjustment && option.priceAdjustment !== 0 && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({option.priceAdjustment > 0 ? '+' : ''}{option.priceAdjustment.toLocaleString('vi-VN')}₫)
                        </span>
                      )}
                      {!option.available && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Stock info for selected option */}
            {selectedVariants[type] && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                {(() => {
                  const selectedOption = group.options.find(opt => opt.value === selectedVariants[type]);
                  if (!selectedOption) return null;

                  if (!selectedOption.available) {
                    return (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>Out of stock</span>
                      </div>
                    );
                  }

                  if (selectedOption.stock && selectedOption.stock < 5) {
                    return (
                      <div className="flex items-center gap-1 text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>Only {selectedOption.stock} left</span>
                      </div>
                    );
                  }

                  return (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span>In stock</span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Price and Stock Summary */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {currentPrice.toLocaleString('vi-VN')} ₫
            </div>
            {currentPrice !== product.sellingPrice && (
              <div className="text-sm text-gray-500">
                Base price: {product.sellingPrice.toLocaleString('vi-VN')} ₫
              </div>
            )}
          </div>
          
          <div className="text-right">
            {isInStock ? (
              <div className="text-green-600 text-sm">
                ✓ {currentStock} in stock
              </div>
            ) : (
              <div className="text-red-600 text-sm">
                ✗ Out of stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;
