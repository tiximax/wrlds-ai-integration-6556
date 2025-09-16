import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  MessageCircle,
  ExternalLink,
  Globe
} from 'lucide-react';

interface SocialLink {
  name: string;
  href: string;
  icon: any;
  color: string;
  hoverColor: string;
  description: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/globalshopping',
    icon: Facebook,
    color: 'text-blue-600',
    hoverColor: 'hover:bg-blue-600',
    description: 'Theo dõi fanpage để nhận thông tin mới nhất'
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/globalshopping',
    icon: Instagram,
    color: 'text-pink-600',
    hoverColor: 'hover:bg-gradient-to-br hover:from-pink-600 hover:to-purple-600',
    description: 'Khám phá hình ảnh sản phẩm mới nhất'
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/globalshopping',
    icon: Twitter,
    color: 'text-sky-500',
    hoverColor: 'hover:bg-sky-500',
    description: 'Cập nhật tin tức và xu hướng'
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/globalshopping',
    icon: Linkedin,
    color: 'text-blue-700',
    hoverColor: 'hover:bg-blue-700',
    description: 'Kết nối chuyên nghiệp và cơ hội việc làm'
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@globalshopping',
    icon: Youtube,
    color: 'text-red-600',
    hoverColor: 'hover:bg-red-600',
    description: 'Xem video review và hướng dẫn'
  },
  {
    name: 'Zalo',
    href: 'https://zalo.me/globalshopping',
    icon: MessageCircle,
    color: 'text-blue-500',
    hoverColor: 'hover:bg-blue-500',
    description: 'Hỗ trợ tư vấn qua Zalo'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const buttonVariants = {
  rest: { 
    scale: 1,
    rotate: 0
  },
  hover: { 
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

export const SocialLinks: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            <Globe className="w-5 h-5 text-blue-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-white">Kết nối với chúng tôi</h3>
        </div>
        <p className="text-gray-400 text-sm">
          Theo dõi để nhận thông tin và ưu đãi mới nhất
        </p>
      </motion.div>

      {/* Social Links Grid */}
      <motion.div 
        className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6 gap-3"
        variants={containerVariants}
      >
        {socialLinks.map((social, index) => (
          <motion.div
            key={social.name}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                group relative block p-3 rounded-xl bg-gray-800/50 border border-gray-700
                transition-all duration-300 hover:border-gray-600
                ${social.hoverColor} hover:text-white hover:shadow-lg
              `}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              {/* Icon */}
              <div className="flex items-center justify-center">
                <social.icon 
                  size={20} 
                  className={`${social.color} group-hover:text-white transition-colors duration-300`} 
                />
              </div>

              {/* Hover Effect Background */}
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: social.name === 'Instagram' 
                    ? 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' 
                    : undefined
                }}
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />

              {/* External Link Icon */}
              <motion.div
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                initial={{ scale: 0, rotate: -90 }}
                whileHover={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <ExternalLink size={10} className="text-gray-800" />
                </div>
              </motion.div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                  {social.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </motion.a>
          </motion.div>
        ))}
      </motion.div>

      {/* Follow Text */}
      <motion.div
        variants={itemVariants}
        className="text-center"
      >
        <motion.p 
          className="text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            🚀 Theo dõi để không bỏ lỡ ưu đãi đặc biệt!
          </motion.span>
        </motion.p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50"
      >
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="text-2xl font-bold text-blue-400"
            animate={{ 
              scale: [1, 1.05, 1],
              color: ['#60a5fa', '#3b82f6', '#60a5fa']
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            10K+
          </motion.div>
          <div className="text-xs text-gray-400">Người theo dõi</div>
        </motion.div>
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="text-2xl font-bold text-green-400"
            animate={{ 
              scale: [1, 1.05, 1],
              color: ['#4ade80', '#22c55e', '#4ade80']
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          >
            98%
          </motion.div>
          <div className="text-xs text-gray-400">Hài lòng</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
