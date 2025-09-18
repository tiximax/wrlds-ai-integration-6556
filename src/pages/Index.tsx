
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

const Index = () => {
  // Fix any ID conflicts when the page loads
  useEffect(() => {
    const contactElements = document.querySelectorAll('[id="contact"]');
    if (contactElements.length > 1) {
      // If there are multiple elements with id="contact", rename one
      contactElements[1].id = 'contact-footer';
    }
  }, []);

  return (
    <PageLayout>
      <SEO 
        title="Global Shopping Assistant - Mua Hộ Quốc Tế" 
        description="Dịch vụ mua hộ, vận chuyển và thanh toán quốc tế từ Nhật Bản, Hàn Quốc, Mỹ về các nước Đông Nam Á. Uy tín - Nhanh chóng - Giá cả hợp lý."
        imageUrl="/og-image.png"
        keywords={['mua hộ quốc tế', 'vận chuyển từ Nhật', 'mua hộ Hàn Quốc', 'mua hộ Mỹ', 'gửi hàng Đông Nam Á', 'thanh toán quốc tế', 'shopping service', 'global shipping', 'cross-border shopping']}
      />
      <Hero />
      <Features />
      <FeaturedProducts />
      <TrustSignals />
      <WhyWrlds />
      <Projects />
      <BlogPreview />
    </PageLayout>
  );
};

export default Index;
