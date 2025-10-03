import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx'
import './index.css'
import './i18n/config'; // Initialize i18n
import { initMonitoring } from './lib/monitoring'; // Error tracking
import { initPerformanceMonitoring } from './lib/performance'; // Web Vitals

// Initialize Sentry monitoring (production only)
initMonitoring();

// Initialize Web Vitals tracking
initPerformanceMonitoring();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
