import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Star, TrendingUp } from 'lucide-react';
import { NewsletterSignup } from './footer/NewsletterSignup';
import { SocialLinks } from './footer/SocialLinks';
import { QuickLinks } from './footer/QuickLinks';
import SecurityBadges from '@/components/trust/SecurityBadges';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.6
    }
  }
};

const statsData = [
  { label: 'Khách hàng', value: '50K+', icon: Star },
  { label: 'Đơn hàng', value: '200K+', icon: TrendingUp },
  { label: 'Quốc gia', value: '15+', icon: MapPin },
  { label: 'Năm kinh nghiệm', value: '8+', icon: Clock }
];

const EnhancedFooter: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
            backgroundSize: '100px 100px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8"
      >
        {/* Stats Section */}
        <motion.div
          variants={sectionVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-3 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <stat.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
              </motion.div>
              <motion.div
                className="text-2xl font-bold text-white mb-1"
                animate={{ 
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.5
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Company Info */}
          <motion.div
            variants={sectionVariants}
            className="lg:col-span-4 space-y-6"
          >
            {/* Logo & Description */}
            <div>
              <motion.h2 
                className="text-2xl font-bold text-white mb-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Global Shopping Assistant
              </motion.h2>
              <motion.p 
                className="text-blue-400 text-sm font-medium mb-4"
                animate={{ 
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🚀 Dịch vụ Mua hộ Quốc tế Uy tín #1
              </motion.p>
              <p className="text-gray-300 leading-relaxed">
                Chúng tôi cung cấp dịch vụ mua hộ toàn diện từ Nhật Bản, Hàn Quốc và Mỹ, 
                giúp khách hàng tiếp cận các sản phẩm chất lượng cao với giá cả hợp lý và dịch vụ chuyên nghiệp.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <motion.div 
                className="flex items-start gap-3 group cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <div>
                  <p className="text-gray-300 group-hover:text-white transition-colors">
                    Tầng 12, Tòa nhà Vietcombank
                  </p>
                  <p className="text-gray-400 text-sm">
                    198 Trần Quốc Toản, Cầu Giấy, Hà Nội
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 group cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-green-500/20 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                </div>
                <div>
                  <p className="text-gray-300 group-hover:text-white transition-colors">
                    +84 24 1234 5678
                  </p>
                  <p className="text-gray-400 text-sm">Hotline 24/7</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 group cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <div>
                  <p className="text-gray-300 group-hover:text-white transition-colors">
                    support@globalshopping.vn
                  </p>
                  <p className="text-gray-400 text-sm">Email hỗ trợ</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={sectionVariants}
            className="lg:col-span-4"
          >
            <QuickLinks />
          </motion.div>

          {/* Newsletter & Social */}
          <motion.div
            variants={sectionVariants}
            className="lg:col-span-4 space-y-8"
          >
            <NewsletterSignup />
            <SocialLinks />
          </motion.div>
        </div>

        {/* Security Badges */}
        <div className="mb-10" data-testid="security-badges-footer">
          <SecurityBadges />
        </div>

        {/* Bottom Section */}
        <motion.div
          variants={sectionVariants}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <motion.p 
              className="text-gray-400 text-sm"
              whileHover={{ scale: 1.02 }}
            >
              © {new Date().getFullYear()} Global Shopping Assistant. 
              <span className="ml-1 text-blue-400">Tất cả quyền được bảo lưu.</span>
            </motion.p>

            {/* Additional Links */}
            <motion.div 
              className="flex items-center gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookies'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-300 relative group"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <motion.span
                    className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-blue-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Back to Top */}
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-all duration-300 border border-gray-700 hover:border-gray-600"
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                ↑
              </motion.div>
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                Về đầu trang
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default EnhancedFooter;
