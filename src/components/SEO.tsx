import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  name?: string;
  imageUrl?: string;
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  category?: string;
  keywords?: string[];
  isBlogPost?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Global Shopping Assistant - Dịch vụ Mua hộ Quốc tế Uy tín #1',
  description = 'Dịch vụ mua hộ, vận chuyển và thanh toán quốc tế từ Nhật Bản, Hàn Quốc, Mỹ về Việt Nam và Đông Nam Á. Uy tín - Nhanh chóng - Giá cả hợp lý. Hỗ trợ 24/7.',
  type = 'website',
  name = 'Global Shopping Assistant',
  imageUrl = '/lovable-uploads/7d120ee6-3614-4b75-9c35-716d54490d67.png',
  publishDate,
  modifiedDate,
  author,
  category,
  keywords = ['mua hộ quốc tế', 'mua hộ Nhật Bản', 'mua hộ Hàn Quốc', 'mua hộ Mỹ', 'vận chuyển quốc tế', 'thanh toán quốc tế', 'shopping service', 'global shipping', 'cross-border ecommerce', 'international procurement'],
  isBlogPost = false
}) => {
  const location = useLocation();
  const currentUrl = `https://globalshoppingassistant.com${location.pathname}`;
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://globalshoppingassistant.com${imageUrl}`;

  // Enhanced keywords for specific posts
  const enhancedKeywords = location.pathname.includes('smart-ppe-revolution') 
    ? [
        ...keywords,
        'personal protective equipment',
        'workplace safety solutions',
        'smart safety gear',
        'construction safety technology',
        'industrial safety monitoring',
        'occupational health technology',
        'safety compliance',
        'worker protection systems',
        'smart hard hats',
        'connected safety equipment'
      ]
    : location.pathname.includes('wearable-safety-tech-protecting-workers-roi')
    ? [
        ...keywords,
        'workplace injury costs',
        'safety ROI',
        'workers compensation savings',
        'ergonomic sensors',
        'workplace safety investment',
        'safety technology ROI',
        'industrial wearables',
        'safety cost reduction',
        'occupational safety economics',
        'safety technology partnerships',
        'workplace injury statistics',
        'safety equipment financing',
        'injury prevention technology'
      ]
    : keywords;

  // Create comprehensive Organization JSON-LD structured data for shopping service
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://globalshoppingassistant.com/#organization',
    name: 'Global Shopping Assistant',
    url: 'https://globalshoppingassistant.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://globalshoppingassistant.com/lovable-uploads/7d120ee6-3614-4b75-9c35-716d54490d67.png',
      width: 512,
      height: 512
    },
    description: 'Dịch vụ mua hộ quốc tế uy tín từ Nhật Bản, Hàn Quốc, Mỹ về Việt Nam và Đông Nam Á',
    foundingDate: '2021',
    serviceArea: {
      '@type': 'GeoCircle',
      name: 'Southeast Asia',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 14.0583,
        longitude: 108.2772
      },
      geoRadius: '2000000'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: '+84-123-456-789',
        email: 'support@globalshoppingassistant.com',
        availableLanguage: ['Vietnamese', 'English'],
        hoursAvailable: '24/7'
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'sales@globalshoppingassistant.com',
        availableLanguage: ['Vietnamese', 'English']
      }
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '198 Trần Quốc Toản',
      addressLocality: 'Cầu Giấy',
      addressRegion: 'Hà Nội',
      postalCode: '100000',
      addressCountry: 'VN'
    },
    sameAs: [
      'https://www.facebook.com/globalshoppingassistant',
      'https://www.instagram.com/globalshoppingassistant',
      'https://zalo.me/globalshoppingassistant'
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'Digital Wallet'],
    currenciesAccepted: ['VND', 'USD', 'JPY', 'KRW'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'International Shopping Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Japan Shopping Service',
            description: 'Mua hộ từ Nhật Bản - Amazon, Rakuten, Yahoo Auction'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Korea Shopping Service',
            description: 'Mua hộ từ Hàn Quốc - Gmarket, Coupang, 11st'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'USA Shopping Service',
            description: 'Mua hộ từ Mỹ - Amazon US, eBay, Best Buy'
          }
        }
      ]
    }
  };

  // Enhanced BlogPosting JSON-LD structured data
  const blogPostStructuredData = isBlogPost && publishDate ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl
    },
    headline: title,
    image: {
      '@type': 'ImageObject',
      url: absoluteImageUrl,
      width: 1200,
      height: 630
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    author: {
      '@type': 'Organization',
      name: author || 'WRLDS Technologies',
      url: 'https://wrlds.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'WRLDS Technologies',
      logo: {
        '@type': 'ImageObject',
        url: 'https://wrlds.com/lovable-uploads/14ea3fe0-19d6-425c-b95b-4117bc41f3ca.png',
        width: 512,
        height: 512
      },
      url: 'https://wrlds.com'
    },
    description: description,
    keywords: enhancedKeywords.join(', '),
    articleSection: category,
    inLanguage: 'en-US',
    isAccessibleForFree: true
  } : null;

  // Add FAQ structured data for Smart PPE post
  const smartPPEFAQData = location.pathname.includes('smart-ppe-revolution') ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Smart PPE?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Smart PPE (Personal Protective Equipment) refers to traditional safety gear enhanced with sensors, connectivity, and intelligence. Unlike ordinary PPE that acts as a passive barrier, smart PPE actively monitors conditions and provides real-time alerts to prevent accidents.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does smart PPE improve workplace safety?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Smart PPE improves safety by providing real-time monitoring of environmental conditions, worker health metrics, and potential hazards. It can detect falls, monitor vital signs, sense toxic gases, and automatically alert emergency responders when needed.'
        }
      },
      {
        '@type': 'Question',
        name: 'What industries benefit from smart PPE?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Smart PPE benefits multiple industries including construction, manufacturing, oil & gas, fire & rescue, healthcare, mining, and any workplace where safety is paramount. Each industry can customize the technology to address specific safety challenges.'
        }
      }
    ]
  } : null;

  // Add FAQ structured data for Wearable Safety Tech ROI post
  const wearableSafetyROIFAQData = location.pathname.includes('wearable-safety-tech-protecting-workers-roi') ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much do workplace injuries cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'According to the National Safety Council, the average cost for a medically consulted work injury is $43,000 in 2023. With 2.2 injuries per 100 full-time workers, a 200-person site can expect about $215,000 in injury costs annually before accounting for downtime or replacement training.'
        }
      },
      {
        '@type': 'Question',
        name: 'What ROI can wearable safety technology deliver?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Real-world deployments show significant returns: one study found 54% lower OSHA recordables and 88% fewer lost workdays. Another warehouse study showed 62% of workers reduced risky movements by half, with total ergonomic hazards falling 39%.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do insurance companies support wearable safety technology?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, many insurers now bundle wearable device costs into workers compensation premiums. Employers keep the hardware as long as usage stays high because fewer claims leave insurers ahead financially. Regional carriers are expanding similar rebate schemes.'
        }
      }
    ]
  } : null;

  // Add comprehensive FAQ structured data for shopping service
  const shoppingServiceFAQData = location.pathname === '/' ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Dịch vụ mua hộ quốc tế là gì?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Dịch vụ mua hộ quốc tế là dịch vụ giúp bạn mua sắm các sản phẩm từ các quốc gia khác như Nhật Bản, Hàn Quốc, Mỹ và vận chuyển về Việt Nam. Chúng tôi xử lý toàn bộ quy trình từ đặt hàng, thanh toán đến vận chuyển và giao hàng tận nơi.'
        }
      },
      {
        '@type': 'Question',
        name: 'Có thể mua hộ từ những website nào?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Chúng tôi hỗ trợ mua hộ từ hầu hết các website lớn: Nhật Bản (Amazon JP, Rakuten, Yahoo Auction), Hàn Quốc (Gmarket, Coupang, 11st), Mỹ (Amazon US, eBay, Best Buy) và nhiều website khác. Nếu bạn có website cụ thể, hãy liên hệ để chúng tôi tư vấn.'
        }
      },
      {
        '@type': 'Question',
        name: 'Phí dịch vụ mua hộ là bao nhiêu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Phí dịch vụ mua hộ thường tín 5-10% giá trị đơn hàng tùy theo loại sản phẩm và độ phức tạp. Phí vận chuyển tính theo trọng lượng và kích thước thực tế. Chúng tôi cam kết minh bạch và cạnh tranh về giá cả.'
        }
      },
      {
        '@type': 'Question',
        name: 'Thời gian vận chuyển mất bao lâu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Thời gian vận chuyển tùy thuộc vào phương thức vận chuyển: Đường hàng không 7-14 ngày, đường biển 20-30 ngày, EMS nhanh 3-5 ngày. Chúng tôi có hệ thống theo dõi đơn hàng 24/7 và thông báo tiến độ thường xuyên.'
        }
      },
      {
        '@type': 'Question',
        name: 'Các hình thức thanh toán nào được hỗ trợ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Chúng tôi hỗ trợ nhiều hình thức thanh toán: Chuyển khoản ngân hàng, Ví điện tử (MoMo, ZaloPay), Thẻ tín dụng/ghi nợ, Tiền mặt tại các điểm giao dịch. Tất cả giao dịch đều an toàn và bảo mật.'
        }
      },
      {
        '@type': 'Question',
        name: 'Có chính sách bảo hành và đổi trả không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Chúng tôi cam kết: Kiểm tra chất lượng hàng hóa trước khi gửi, bảo hiểm hàng hóa trong quá trình vận chuyển, hỗ trợ đổi trả theo chính sách của từng shop, giải quyết khiếu nại 24/7. Khách hàng yên tâm 100% về chất lượng dịch vụ.'
        }
      }
    ]
  } : null;

  // Add Service schema for main services
  const servicesStructuredData = location.pathname === '/' ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Dịch vụ Mua hộ Quốc tế',
    description: 'Dịch vụ mua hộ, vận chuyển và thanh toán quốc tế chuyên nghiệp',
    provider: {
      '@type': 'Organization',
      name: 'Global Shopping Assistant',
      url: 'https://globalshoppingassistant.com'
    },
    serviceType: 'Shopping Service',
    areaServed: {
      '@type': 'Country',
      name: 'Vietnam'
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://globalshoppingassistant.com',
      serviceSmsNumber: '+84-123-456-789',
      servicePhone: '+84-123-456-789',
      availableLanguage: ['Vietnamese', 'English']
    },
    offers: {
      '@type': 'Offer',
      priceRange: '$$',
      priceCurrency: 'VND',
      availabilityEnds: '2025-12-31',
      availability: 'https://schema.org/InStock'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'International Shopping Services',
      itemListElement: [
        {
          '@type': 'Service',
          name: 'Mua hộ từ Nhật Bản',
          description: 'Dịch vụ mua hộ chuyên nghiệp từ các website Nhật Bản'
        },
        {
          '@type': 'Service',
          name: 'Mua hộ từ Hàn Quốc',
          description: 'Dịch vụ mua hộ sản phẩm K-beauty và thời trang Hàn Quốc'
        },
        {
          '@type': 'Service',
          name: 'Mua hộ từ Mỹ',
          description: 'Dịch vụ mua hộ điện tử và hàng hiệu từ Mỹ'
        }
      ]
    }
  } : null;

  // Combine keywords with any additional category terms
  const keywordString = category 
    ? [...enhancedKeywords, category.toLowerCase()].join(', ') 
    : enhancedKeywords.join(', ');

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      <meta name="keywords" content={keywordString} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={isBlogPost ? 'article' : type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Global Shopping Assistant" />
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:locale:alternate" content="en_US" />
      {isBlogPost && category && <meta property="article:section" content={category} />}
      {isBlogPost && publishDate && <meta property="article:published_time" content={publishDate} />}
      {isBlogPost && modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      {isBlogPost && <meta property="article:publisher" content="https://globalshoppingassistant.com" />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:site" content="@globalshoppingvn" />
      <meta name="twitter:creator" content="@globalshoppingvn" />
      
      {/* LinkedIn specific */}
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta name="author" content={author || name} />
      
      {/* Pinterest specific */}
      <meta name="pinterest:description" content={description} />
      <meta name="pinterest:image" content={absoluteImageUrl} />
      
      {/* Additional SEO meta tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationStructuredData)}
      </script>
      
      {blogPostStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(blogPostStructuredData)}
        </script>
      )}
      
      {smartPPEFAQData && (
        <script type="application/ld+json">
          {JSON.stringify(smartPPEFAQData)}
        </script>
      )}
      
      {wearableSafetyROIFAQData && (
        <script type="application/ld+json">
          {JSON.stringify(wearableSafetyROIFAQData)}
        </script>
      )}
      
      {shoppingServiceFAQData && (
        <script type="application/ld+json">
          {JSON.stringify(shoppingServiceFAQData)}
        </script>
      )}
      
      {servicesStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(servicesStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
