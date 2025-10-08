
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Projects from '@/components/Projects';
import WhyWrlds from '@/components/WhyWrlds';
import BlogPreview from '@/components/BlogPreview';
import TrustSignals from '@/components/TrustSignals';
import FeaturedProducts from '@/components/FeaturedProducts';
import SEO from '@/components/SEO';
import { useEffect } from 'react';
// REMOVED: Fake live activity feed damages trust - replaced with static trust badges
// import LiveActivityFeed from '@/components/trust/LiveActivityFeed';
import { Helmet } from 'react-helmet-async';
import { simpleProducts } from '@/data/simpleProducts';

const Index = () => {
  // Fix any ID conflicts when the page loads
  useEffect(() => {
    const contactElements = document.querySelectorAll('[id="contact"]');
    if (contactElements.length > 1) {
      // If there are multiple elements with id="contact", rename one
      contactElements[1].id = 'contact-footer';
    }
  }, []);

  // Preload featured product primary image for LCP improvement
  const fp = simpleProducts?.[0];
  const fpImg = fp?.images?.find(i => i.isPrimary) || fp?.images?.[0];

  return (
    <PageLayout>
      <SEO 
        title="Global Shopping Assistant - Mua Hộ Quốc Tế" 
        description="Dịch vụ mua hộ, vận chuyển và thanh toán quốc tế từ Nhật Bản, Hàn Quốc, Mỹ về các nước Đông Nam Á. Uy tín - Nhanh chóng - Giá cả hợp lý."
        imageUrl="/og-image.png"
        keywords={['mua hộ quốc tế', 'vận chuyển từ Nhật', 'mua hộ Hàn Quốc', 'mua hộ Mỹ', 'gửi hàng Đông Nam Á', 'thanh toán quốc tế', 'shopping service', 'global shipping', 'cross-border shopping']}
      />

      {fpImg?.url && (
        <Helmet>
          <link rel="preload" as="image" href={fpImg.url} />
          {/* Prefetch popular routes for faster first navigation */}
          <link rel="prefetch" as="document" href="/products" />
          <link rel="prefetch" as="document" href="/search" />
        </Helmet>
      )}

      <Hero />
      <Features />
      <FeaturedProducts />
      <TrustSignals />
      {/* REMOVED: Fake live activity feed - see P0.3 audit finding */}
      {/* <LiveActivityFeed /> */}
      <WhyWrlds />
      <Projects />
      <BlogPreview />
    </PageLayout>
  );
};

export default Index;
