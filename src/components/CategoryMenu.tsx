import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getRootCategories, getChildren } from '@/utils/categoryUtils';
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronRight, Package, Tag } from 'lucide-react';

interface CategoryMenuProps {
  isScrolled: boolean;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ isScrolled }) => {
  const { t } = useLanguage();
  const rootCategories = getRootCategories();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger 
        className={cn(
          isScrolled 
            ? "text-gray-700 hover:text-gray-900" 
            : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
        )}
      >
        <Package className="w-4 h-4 mr-2" />
        {t('navigation.categories')}
      </NavigationMenuTrigger>
      
      <NavigationMenuContent>
        <div className="w-[600px] p-4">
          <div className="grid grid-cols-2 gap-6">
            {rootCategories.map((category) => (
              <div key={category.id} className="space-y-3">
                {/* Category Header */}
                <Link
                  to={`/category/${category.slug}`}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  {category.image && (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>

                {/* Subcategories */}
                <div className="space-y-1 ml-4">
                  {getChildren(category).map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      to={`/category/${category.slug}/${subcategory.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group text-sm"
                    >
                      <Tag className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />
                      <span className="text-gray-600 group-hover:text-gray-900">
                        {subcategory.name}
                      </span>
                      {subcategory.productCount && (
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {subcategory.productCount}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link
              to="/products"
              className="flex items-center justify-center gap-2 w-full p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              <Package className="w-4 h-4" />
              {t('navigation.viewAllProducts')}
            </Link>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default CategoryMenu;
