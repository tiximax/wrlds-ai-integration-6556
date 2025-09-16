import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  FileText, 
  Package, 
  ShoppingBag, 
  BookOpen,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface QuickLink {
  title: string;
  href: string;
  icon: any;
  description: string;
  isExternal?: boolean;
}

const linkSections = {
  company: {
    title: 'Công ty',
    icon: Building2,
    links: [
      {
        title: 'Về chúng tôi',
        href: '/about',
        icon: Building2,
        description: 'Tìm hiểu về Global Shopping Assistant'
      },
      {
        title: 'Tuyển dụng',
        href: '/careers',
        icon: Users,
        description: 'Cơ hội nghề nghiệp tại GSA'
      },
      {
        title: 'Chính sách',
        href: '/privacy-policy',
        icon: FileText,
        description: 'Chính sách bảo mật và điều khoản'
      }
    ]
  },
  services: {
    title: 'Dịch vụ',
    icon: Package,
    links: [
      {
        title: 'Sản phẩm',
        href: '/products',
        icon: ShoppingBag,
        description: 'Khám phá sản phẩm từ khắp thế giới'
      },
      {
        title: 'Blog',
        href: '/blog',
        icon: BookOpen,
        description: 'Tin tức và hướng dẫn mua hàng'
      },
      {
        title: 'Liên hệ',
        href: '#contact',
        icon: Building2,
        description: 'Thông tin liên hệ và hỗ trợ'
      }
    ]
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

const LinkComponent: React.FC<{ link: QuickLink }> = ({ link }) => {
  const isExternal = link.isExternal || link.href.startsWith('http');
  
  const linkContent = (
    <motion.div
      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300 relative overflow-hidden"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Gradient on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 rounded-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Icon */}
      <motion.div
        className="relative z-10"
        whileHover={{ rotate: 5, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="p-1.5 rounded-md bg-gray-700/50 group-hover:bg-blue-500/20 transition-colors duration-300">
          <link.icon size={14} className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="flex-1 relative z-10">
        <div className="flex items-center gap-1">
          <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300">
            {link.title}
          </span>
          {isExternal && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ArrowUpRight size={12} className="text-gray-500 group-hover:text-blue-400" />
            </motion.div>
          )}
        </div>
        <motion.p 
          className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300"
          initial={{ opacity: 0.7 }}
          whileHover={{ opacity: 1 }}
        >
          {link.description}
        </motion.p>
      </div>

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.div>
  );

  return (
    <motion.li variants={linkVariants}>
      {isExternal ? (
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          {linkContent}
        </a>
      ) : (
        <Link to={link.href}>
          {linkContent}
        </Link>
      )}
    </motion.li>
  );
};

export const QuickLinks: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      {Object.entries(linkSections).map(([key, section]) => (
        <motion.div
          key={key}
          variants={sectionVariants}
          className="space-y-4"
        >
          {/* Section Header */}
          <motion.div
            className="flex items-center gap-2 pb-2 border-b border-gray-700/50"
            whileHover={{ x: 2 }}
          >
            <motion.div
              whileHover={{ 
                rotate: 360,
                scale: 1.1 
              }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 300
              }}
            >
              <section.icon className="w-5 h-5 text-blue-400" />
            </motion.div>
            <h3 className="text-lg font-bold text-white">{section.title}</h3>
            <motion.div
              animate={{ 
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2
              }}
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </motion.div>
          </motion.div>

          {/* Links */}
          <motion.ul 
            className="space-y-1"
            variants={containerVariants}
          >
            {section.links.map((link, index) => (
              <LinkComponent key={index} link={link} />
            ))}
          </motion.ul>

          {/* Additional Info */}
          <motion.div
            className="pt-2 mt-4 border-t border-gray-800/50"
            variants={linkVariants}
          >
            <motion.p 
              className="text-xs text-gray-500 italic"
              whileHover={{ scale: 1.02 }}
            >
              💡 {key === 'company' ? 'Tìm hiểu thêm về chúng tôi' : 'Khám phá dịch vụ đa dạng'}
            </motion.p>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};
