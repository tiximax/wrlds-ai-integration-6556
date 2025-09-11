
import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <PageLayout>
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
Về chúng tôi - Global Shopping Assistant
            </motion.h1>
            
            <div className="prose prose-lg max-w-none">
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5, delay: 0.2 }} 
                className="text-xl text-gray-600 mb-12"
              >
Chúng tôi là đội ngũ chuyên gia tận tâm cung cấp dịch vụ mua hộ quốc tế uy tín, nhanh chóng và an toàn từ Nhật Bản, Hàn Quốc và Mỹ.
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold">Sứ mệnh của chúng tôi</h2>
                  <p className="text-gray-600">
                    Tại Global Shopping Assistant, chúng tôi có sứ mệnh kết nối khách hàng Việt Nam với các sản phẩm chất lượng cao từ Nhật Bản, Hàn Quốc và Mỹ.
                  </p>
                  <p className="text-gray-600">
                    Chúng tôi tin rằng mỗi người đều xứng đáng có quyền tiếp cận các sản phẩm tốt nhất thế giới mà không bị rào cản bởi khoảng cách địa lý.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
                >
                  <h3 className="text-2xl font-bold mb-4">Giá trị của chúng tôi</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Uy tín:</strong> Chúng tôi đặt uy tín là giá trị hàng đầu trong mọi giao dịch.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Chất lượng:</strong> Chúng tôi cam kết mang đến sản phẩm chính hãng, chất lượng cao nhất.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Tận tâm:</strong> Chúng tôi luôn lắng nghe và đáp ứng nhu cầu riêng của từng khách hàng.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-gray-700 mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Hiệu quả:</strong> Chúng tôi đo lường thành công bằng sự hài lòng thực sự của khách hàng.</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                  <p className="text-gray-600 mb-4">
                    Chúng tôi bắt đầu với mong muốn làm cho việc mua sắm quốc tế trở nên đưn giản và dễ dàng hơn 
                    cho người Việt Nam. Sau khi thành công trong việc xây dựng mạng lưới đối tác đáng tin cậy, 
                    chúng tôi đã dành hai năm đầu để hoàn thiện hệ thống.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Mục tiêu của chúng tôi là biến những thủ tục phức tạp trong mua hộ quốc tế thành các bước 
                    đơn giản, dễ hiểu. Trong thời gian này chúng tôi đã phục vụ hàng ngàn khách hàng - 
                    cách để chúng tôi đảm bảo rằng dịch vụ thực sự đáp ứng nhu cầu thực tế.
                  </p>
                  <p className="text-gray-600">
                    Năm 2023, chúng tôi cảm thấy đã đạt được trình độ cho phép bắt đầu làm việc ở quy mô lớn. 
                    Kể từ đó, chúng tôi tập trung vào dịch vụ mua hộ vì tiềm năng to lớn của thị trường 
                    thương mại điện tử xuyên biên giới từ các quốc gia hàng đầu.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-6">Đội ngũ của chúng tôi</h2>
                <p className="text-gray-600 mb-8">
                  Đội ngũ đa dạng của chúng tôi kết hợp chuyên môn về thương mại quốc tế, logistics, 
                  công nghệ thông tin và dịch vụ khách hàng để mang lại giải pháp toàn diện.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      name: "Nguyễn Minh Quân",
                      role: "CEO & Founder",
                      bio: "Lãnh đạo Global Shopping Assistant với tầm nhìn kết nối Việt Nam với thế giới qua dịch vụ mua hộ.",
                      image: "/lovable-uploads/aa5291bd-2417-4c1e-9a02-0bcc71a92507.png"
                    },
                    {
                      name: "Trần Hải Nam",
                      role: "Trưởng bộ phận Công nghệ",
                      bio: "Chuyên gia về hạ tầng đám mây và API để tích hợp dữ liệu liền mạch.",
                      image: "/lovable-uploads/e502f601-c519-43a8-86f5-5fa89ae50d2f.png"
                    },
                    {
                      name: "Lê Thị Hoa",
                      role: "Trưởng bộ phận Logistics",
                      bio: "Chuyên gia vận chuyển quốc tế, đảm bảo hàng hóa được giao đến tay khách hàng an toàn.",
                      image: "/lovable-uploads/3de85ddd-15e1-4216-9697-f91abb9a47ce.png"
                    },
                    {
                      name: "Phạm Văn Đức",
                      role: "COO",
                      bio: "Giám sát hoạt động hàng ngày và đảm bảo các mục tiêu kinh doanh được thực hiện hiệu quả.",
                      image: "/lovable-uploads/a9bb9110-964a-43b0-a5ab-7162140cd133.png"
                    }
                  ].map((member, i) => (
                    <Card key={i} className="bg-gray-50 border border-gray-100 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-32 h-32 relative mb-4 rounded-full overflow-hidden">
                            <img 
                              src={member.image} 
                              alt={member.name} 
                              className="w-full h-full object-cover filter grayscale" 
                            />
                          </div>
                          <h3 className="font-bold text-lg">{member.name}</h3>
                          <p className="text-gray-500 text-sm mb-2">{member.role}</p>
                          <p className="text-gray-600 text-sm">{member.bio}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <div className="mt-16 pt-8 border-t border-gray-200">
              <Link to="/careers" className="inline-flex items-center px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all group">
Tham gia đội ngũ 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
