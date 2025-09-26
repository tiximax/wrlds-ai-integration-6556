
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, Mail, Linkedin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useEffect } from 'react';

const Careers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <PageLayout showContact={false}>
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Về trang chủ
              </Link>
              
              <motion.h1 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }} 
                className="text-4xl font-bold mb-6"
              >
                Gia nhập đội ngũ
              </motion.h1>
              
              <div className="prose prose-lg max-w-none">
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.5, delay: 0.2 }} 
                  className="text-xl text-gray-600 mb-4"
                >
                  Chúng tôi đang tìm kiếm những người đam mê đổi mới để cùng tạo ra sự khác biệt trong lĩnh vực mua hộ và logistics thông minh.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-xl text-gray-600 mb-12"
                >
                  Chúng tôi chào đón cả nhân sự toàn thời gian và thực tập sinh mong muốn đóng góp vào các giải pháp đột phá.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  <h2 className="text-3xl font-bold mb-6">Tại sao gia nhập WRLDS?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      {
                        title: "Đổi mới",
                        description: "Cùng làm việc với các công nghệ tiên tiến tạo ảnh hưởng đến nhiều ngành."
                      },
                      {
                        title: "Tác động",
                        description: "Tạo ra giải pháp nâng cao an toàn, hiệu suất và chất lượng cuộc sống."
                      },
                      {
                        title: "Phát triển",
                        description: "Phát triển kỹ năng của bạn trong lĩnh vực đang tăng trưởng nhanh với nhiều thách thức."
                      }
                    ].map((benefit, i) => (
                      <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-full">
                        <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mt-12">
                    <h3 className="font-bold text-xl mb-6">Liên hệ COO của chúng tôi</h3>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex flex-col items-center text-center">
                        <img 
                          src="/lovable-uploads/a9bb9110-964a-43b0-a5ab-7162140cd133.png"
                          alt="Love Anderberg"
                          className="w-32 h-32 rounded-full mb-4 object-cover filter grayscale"
                        />
                        <h3 className="text-xl font-bold text-gray-900">Love Anderberg</h3>
                        <p className="text-gray-600 mb-4">COO</p>
                        <div className="flex flex-col space-y-3">
                          <a href="mailto:love@wrlds.com" className="flex items-center text-gray-700 hover:text-blue-600">
                            <Mail className="w-5 h-5 mr-2" />
                            love@wrlds.com
                          </a>
                          <a 
                            href="https://www.linkedin.com/in/love-anderberg-67549a174/" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-700 hover:text-blue-600"
                          >
                            <Linkedin className="w-5 h-5 mr-2" />
                            Hồ sơ LinkedIn
                          </a>
                          <a href="tel:+46760149508" className="flex items-center text-gray-700 hover:text-blue-600">
                            <Phone className="w-5 h-5 mr-2" />
                            076-014 95 08
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
};

export default Careers;
