import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShoppingCart, DollarSign, Users, Clock4, Rocket, Zap, Sparkles, ArrowRight, Award, Target, Shield, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const AnimatedCounter = ({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const inView = useInView(countRef, {
    once: true,
    margin: "-100px"
  });
  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let animationFrame: number;
    const startAnimation = (timestamp: number) => {
      startTime = timestamp;
      animate(timestamp);
    };
    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = progress * end;
      setCount(currentCount);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(startAnimation);
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, inView]);
  return <span ref={countRef} className="font-bold tabular-nums">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>;
};

const WhyWrlds = () => {
  const isMobile = useIsMobile();
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
  return <section id="why-wrlds" className="relative py-16 md:py-24 bg-white overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12 md:mb-16" initial="hidden" whileInView="visible" viewport={{
        once: true,
        margin: "-100px"
      }} variants={containerVariants}>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Tại sao chọn chúng tôi?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 text-lg max-w-3xl mx-auto">
            Trong lĩnh vực mua hộ quốc tế, chúng tôi mang đến sự đưn giản và chuyên nghiệp để đảm bảo thành công của bạn
          </motion.p>
        </motion.div>
        
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" initial="hidden" whileInView="visible" viewport={{
        once: true,
        margin: "-100px"
      }} variants={containerVariants}>
          <motion.div variants={itemVariants} className="bg-gray-100 p-6 rounded-xl border border-gray-200 text-center hover:bg-gray-200 transition-all">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-gray-900 text-2xl lg:text-3xl font-bold mb-3">
              <AnimatedCounter end={2} suffix=".1T" /> USD
            </h3>
            <p className="text-gray-700">Thị trường thương mại điện tử xuyên biên giới dự kiến đạt mức này vào năm 2030</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-gray-100 p-6 rounded-xl border border-gray-200 text-center hover:bg-gray-200 transition-all">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-gray-900 text-2xl lg:text-3xl font-bold mb-3">
              <AnimatedCounter end={5000} suffix="+" /> 
            </h3>
            <p className="text-gray-700">
              Khách hàng đã tin tưởng và sử dụng dịch vụ mua hộ của chúng tôi
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-gray-100 p-6 rounded-xl border border-gray-200 text-center hover:bg-gray-200 transition-all">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-700" />
            </div>
            <h3 className="text-gray-900 text-2xl lg:text-3xl font-bold mb-3">
              <AnimatedCounter end={25} suffix="%" />
            </h3>
            <p className="text-gray-700">
              Tiết kiệm chi phí so với việc mua trực tiếp tại các nước này
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{
          once: true,
          margin: "-100px"
        }} variants={containerVariants}>
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Chúng tôi mang lại gì cho bạn
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi biến ý tưởng mua sắm của bạn thành hiện thực với những lợi ích cụ thể
            </p>
          </motion.div>
          
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full p-3 mr-4">
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Sản phẩm đa dạng</h4>
                  <p className="text-gray-700">Tiếp cận hàng triệu sản phẩm từ các quốc gia hàng đầu thế giới.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full p-3 mr-4">
                  <Sparkles className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Dịch vụ uy tín</h4>
                  <p className="text-gray-700">Quy trình minh bạch, thông tin rõ ràng, hỗ trợ nhiệt tình 24/7.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full p-3 mr-4">
                  <Zap className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Mua sắm tiện lợi</h4>
                  <p className="text-gray-700">Chỉ cần gửi link sản phẩm, chúng tôi lo tất cả các thủ tục phức tạp.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start">
                <div className="bg-gray-200 rounded-full p-3 mr-4">
                  <Rocket className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Vận chuyển nhanh</h4>
                  <p className="text-gray-700">Cam kết giao hàng nhanh nhất và an toàn nhất đến tay bạn.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center mt-10">
            <Link 
              to="/development-process" 
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all group"
            >
Tìm hiểu thêm về quy trình dịch vụ của chúng tôi
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>;
};

export default WhyWrlds;
