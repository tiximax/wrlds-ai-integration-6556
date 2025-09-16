import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/PageLayout';
import SimpleProductCard from '@/components/SimpleProductCard';
import { simpleProducts } from '@/data/simpleProducts';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams();

  // Filter products by category
  const categoryProducts = simpleProducts.filter(
    product => product.category.slug === categorySlug
  );

  const categoryName = categoryProducts.length > 0 
    ? categoryProducts[0].category.name 
    : 'Category';

  return (
    <PageLayout>
      <Helmet>
        <title>{categoryName} - Global Shopping Assistant</title>
        <meta name="description" content={`Browse ${categoryName} products from around the world.`} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{categoryName}</h1>
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