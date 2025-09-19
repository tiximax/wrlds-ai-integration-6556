import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/PageLayout';
import SimpleProductCard from '@/components/SimpleProductCard';
import { simpleProducts } from '@/data/simpleProducts';
import { getCategoryBySlug, getChildren, buildBreadcrumbs } from '@/utils/categoryUtils';
import CategoryBreadcrumbs from '@/components/CategoryBreadcrumbs';

const CategoryPage: React.FC = () => {
  const { categorySlug, subcategorySlug } = useParams();

  // Resolve category/subcategory using taxonomy when possible
  const { targetSlug, categoryName, crumbs } = useMemo(() => {
    let name = 'Category';
    let slug = categorySlug || '';

    const base = categorySlug ? getCategoryBySlug(categorySlug) : undefined;
    const sub = base && subcategorySlug ? base.children?.find(c => c.slug === subcategorySlug) : undefined;

    if (sub) {
      name = sub.name;
      slug = sub.slug;
    } else if (base) {
      name = base.name;
      slug = base.slug;
    }

    // Build breadcrumbs if taxonomy matched; otherwise fall back to simple path
    let breadcrumbs = [] as { id: string; name: string; url: string }[];
    if (sub || base) {
      const b = buildBreadcrumbs((sub || base)!);
      // Map to required shape (buildBreadcrumbs already includes home)
      breadcrumbs = b.map(x => ({ id: x.id, name: x.name, url: x.url }));
    } else {
      breadcrumbs = [
        { id: 'home', name: 'Home', url: '/' },
        { id: 'category', name: 'Category', url: `/category/${categorySlug || ''}` },
      ];
    }

    return { targetSlug: slug, categoryName: name, crumbs: breadcrumbs };
  }, [categorySlug, subcategorySlug]);

  // Filter products by resolved slug (exact match)
  const categoryProducts = simpleProducts.filter(
    product => product.category.slug === targetSlug
  );

  return (
    <PageLayout>
      <Helmet>
        <title>{categoryName} - Global Shopping Assistant</title>
        <meta name="description" content={`Browse ${categoryName} products from around the world.`} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <CategoryBreadcrumbs crumbs={crumbs} />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
          <p className="text-gray-600">
            {categoryProducts.length} products found
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <SimpleProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products found in this category</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CategoryPage;