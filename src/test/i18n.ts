import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simple mock translations for testing
const resources = {
  en: {
    translation: {
      'common.home': 'Home',
      'products.title': 'Products',
      'products.meta.description': 'Browse our product collection',
      'products.meta.keywords': 'products, shopping, global',
      'products.subtitle': 'Discover amazing products',
      'products.resultsFound': 'results found',
      'categories.title': 'Categories'
    }
  },
  vi: {
    translation: {
      'common.home': 'Trang chủ',
      'products.title': 'Sản phẩm',
      'products.meta.description': 'Duyệt bộ sưu tập sản phẩm',
      'products.meta.keywords': 'sản phẩm, mua sắm, toàn cầu',
      'products.subtitle': 'Khám phá những sản phẩm tuyệt vời',
      'products.resultsFound': 'kết quả được tìm thấy',
      'categories.title': 'Danh mục'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
