import { ArrowRight, ShoppingCart, Globe, CreditCard, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  return <motion.div className="relative w-full" initial="hidden" animate="visible" variants={containerVariants}>
      <div className="banner-container relative overflow-hidden h-[50vh] sm:h-[60vh] md:h-[500px] lg:h-[550px] xl:h-[600px] w-full">
        <div className="absolute inset-0 w-full">
          {/* Shopping background with gradient */}
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
          {/* Shopping icons pattern overlay */}
          <div className="absolute inset-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white"></div>
        </div>
        
        <div className="banner-overlay bg-transparent pt-20 sm:pt-24 md:pt-32 w-full">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full">
            <motion.div className="w-full max-w-4xl text-center" variants={itemVariants}>
              <motion.h1 className="banner-title text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" variants={itemVariants}>
                {t('hero.title')}
              </motion.h1>
              <motion.p className="banner-subtitle text-gray-200 mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed" variants={itemVariants}>
                {t('hero.subtitle')}
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center items-center" variants={itemVariants}>
                {/* Styled as a button but using an anchor tag for project navigation */}
                <EnhancedButton 
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto min-h-[44px] shadow-lg hover:shadow-xl hover:shadow-gray-300/20 group"
                  onClick={e => {
                    e.preventDefault();
                    const projectsSection = document.getElementById('projects');
                    if (projectsSection) {
                      projectsSection.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />}
                >
                  {t('hero.viewServices')}
                </EnhancedButton>
                
                {/* Using the Button component from shadcn but with custom styling to match the explore button */}
                <EnhancedButton 
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-h-[44px] shadow-lg hover:shadow-xl hover:shadow-blue-300/20 group"
                  onClick={scrollToContact}
                  rightIcon={<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />}
                >
                  {t('hero.contactNow')}
                </EnhancedButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <motion.div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" variants={containerVariants} initial="hidden" animate="visible" transition={{
        delay: 0.6
      }}>
          <motion.div 
            className="group bg-white/95 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:border-blue-200/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden" 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <motion.div 
              className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-xl text-blue-600 mb-3 md:mb-4 relative z-10"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800 relative z-10">{t('hero.globalShopping')}</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed relative z-10">{t('hero.globalShoppingDesc')}</p>
          </motion.div>
          
          <motion.div 
            className="group bg-white/95 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:border-purple-200/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden" 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <motion.div 
              className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center rounded-xl text-purple-600 mb-3 md:mb-4 relative z-10"
              whileHover={{ rotate: -5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Globe className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800 relative z-10">{t('hero.internationalShipping')}</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed relative z-10">{t('hero.internationalShippingDesc')}</p>
          </motion.div>
          
          <motion.div 
            className="group bg-white/95 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:border-green-200/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden" 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <motion.div 
              className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center rounded-xl text-green-600 mb-3 md:mb-4 relative z-10"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CreditCard className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-800 relative z-10">{t('hero.flexiblePayment')}</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed relative z-10">{t('hero.flexiblePaymentDesc')}</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>;
};

export default Hero;
