import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NavigationMenuContent } from '@/components/ui/navigation-menu';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MegaMenuItem, MegaMenuSection } from '@/data/mega-menu-data';

interface MegaMenuProps {
  sections: MegaMenuSection[];
  className?: string;
  featured?: {
    title: string;
    description: string;
    href: string;
    image: string;
    badge?: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 }
  }
};

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: 5 },
  tap: { scale: 0.95 }
};

export const MegaMenu: React.FC<MegaMenuProps> = ({ 
  sections, 
  className,
  featured 
}) => {
  return (
    <NavigationMenuContent>
      <motion.div
        className={cn("w-[800px] p-6", className)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="grid grid-cols-12 gap-6">
          {/* Featured Section */}
          {featured && (
            <motion.div 
              className="col-span-5"
              variants={itemVariants}
            >
              <Link
                to={featured.href}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 h-full block hover:shadow-lg transition-all duration-300"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    {featured.badge && (
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {featured.badge}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {featured.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    <span>Explore now</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
          
          {/* Menu Sections */}
          <div className={cn("grid gap-6", featured ? "col-span-7 grid-cols-2" : "col-span-12 grid-cols-3")}>
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                className="space-y-3"
                variants={itemVariants}
                transition={{ delay: sectionIndex * 0.05 }}
              >
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  {section.title}
                </h4>
                
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.href}
                      variants={itemVariants}
                      transition={{ delay: (sectionIndex * section.items.length + itemIndex) * 0.02 }}
                    >
                      <Link
                        to={item.href}
                        className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                      >
                        <motion.div
                          className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                          variants={iconVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          {item.icon}
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </h5>
                            {item.badge && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 group-hover:text-gray-600 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </NavigationMenuContent>
  );
};

