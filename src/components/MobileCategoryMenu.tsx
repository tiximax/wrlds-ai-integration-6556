import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getRootCategories, getChildren } from '@/utils/categoryUtils';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Package, Tag } from 'lucide-react';

interface MobileCategoryMenuProps {
  isScrolled: boolean;
  onLinkClick: () => void;
}

const MobileCategoryMenu: React.FC<MobileCategoryMenuProps> = ({ isScrolled, onLinkClick }) => {
  const { t } = useTranslation();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const rootCategories = getRootCategories();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="space-y-1">
      {/* Categories Header */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium",
        isScrolled ? "text-gray-800" : "text-gray-100"
      )}>
        <Package className="w-4 h-4" />
        {t('navigation.categories')}
      </div>

      {/* Root Categories */}
      {rootCategories.map((category) => (
        <div key={category.id} className="space-y-1">
          <div className="flex items-center">
            <Link
              to={`/category/${category.slug}`}
              className={cn(
                "flex-1 block px-6 py-1.5 rounded-md text-sm",
                isScrolled 
                  ? "text-gray-700 hover:bg-gray-50" 
                  : "text-gray-200 hover:bg-gray-900"
              )}
              onClick={onLinkClick}
            >
              {category.name}
            </Link>
            <button
              onClick={() => toggleCategory(category.id)}
              className={cn(
                "p-1.5 rounded-md",
                isScrolled 
                  ? "text-gray-500 hover:text-gray-700" 
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              {expandedCategory === category.id ? 
                <ChevronUp className="w-4 h-4" /> : 
                <ChevronDown className="w-4 h-4" />
              }
            </button>
          </div>

          {/* Subcategories */}
          {expandedCategory === category.id && (
            <div className="space-y-1 ml-4 border-l border-gray-200 pl-2">
              {getChildren(category).map((subcategory) => (
                <Link
                  key={subcategory.id}
                  to={`/category/${category.slug}/${subcategory.slug}`}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1 rounded-md text-xs",
                    isScrolled 
                      ? "text-gray-600 hover:bg-gray-50" 
                      : "text-gray-300 hover:bg-gray-900"
                  )}
                  onClick={onLinkClick}
                >
                  <Tag className="w-3 h-3" />
                  {subcategory.name}
                  {subcategory.productCount && (
                    <span className={cn(
                      "ml-auto text-xs px-1.5 py-0.5 rounded-full",
                      isScrolled 
                        ? "bg-gray-100 text-gray-500" 
                        : "bg-gray-800 text-gray-400"
                    )}>
                      {subcategory.productCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* View All Products Link */}
      <Link
        to="/products"
        className={cn(
          "flex items-center justify-center gap-2 mx-3 mt-3 p-2 rounded-md text-sm font-medium",
          isScrolled 
            ? "bg-blue-50 text-blue-600 hover:bg-blue-100" 
            : "bg-gray-800 text-blue-400 hover:bg-gray-700"
        )}
        onClick={onLinkClick}
      >
        <Package className="w-4 h-4" />
        {t('navigation.viewAllProducts')}
      </Link>
    </div>
  );
};

export default MobileCategoryMenu;
