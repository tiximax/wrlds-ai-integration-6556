import { Shield, Clock, Award, Users, Star, CheckCircle, Phone, MessageCircle, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TrustSignals = () => {
  const { t } = useLanguage();

  const trustFeatures = [
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Bảo hiểm 100%",
      description: "Bảo hiểm toàn bộ hàng hóa trong quá trình vận chuyển",
      color: "bg-green-50"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ tư vấn sẵn sàng hỗ trợ mọi lúc",
      color: "bg-blue-50"
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-600" />,
      title: "Uy tín 5+ năm",
      description: "Hơn 5 năm kinh nghiệm trong lĩnh vực mua hộ quốc tế",
      color: "bg-yellow-50"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: "5,000+ khách hàng",
      description: "Phục vụ hơn 5,000 khách hàng trên toàn khu vực",
      color: "bg-purple-50"
    }
  ];

  const testimonials = [
    {
      name: "Nguyễn Thị Mai",
      location: "Hà Nội",
      rating: 5,
      comment: "Dịch vụ tuyệt vời! Đặt mỹ phẩm Hàn Quốc và nhận được hàng chính hãng, đóng gói rất kỹ. Sẽ tiếp tục sử dụng.",
      product: "K-beauty set từ Hàn Quốc"
    },
    {
      name: "Trần Văn Hùng",
      location: "TP.HCM",
      rating: 5,
      comment: "Mua laptop từ Mỹ giá rẻ hơn trong nước rất nhiều. Nhân viên tư vấn nhiệt tình, giao hàng đúng hẹn.",
      product: "MacBook Pro từ Amazon US"
    },
    {
      name: "Lê Thị Hoa",
      location: "Đà Nẵng",
      rating: 5,
      comment: "Lần đầu sử dụng dịch vụ mua hộ, ban đầu có chút lo lắng nhưng kết quả rất hài lòng. Nhất định sẽ giới thiệu cho bạn bè.",
      product: "Đồ gia dụng từ Nhật Bản"
    }
  ];

  const stats = [
    {
      number: "12,000+",
      label: "Đơn hàng thành công",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      number: "98.5%",
      label: "Tỷ lệ hài lòng",
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      number: "15",
      label: "Quốc gia phục vụ",
      icon: <Globe className="w-5 h-5 text-blue-500" />
    },
    {
      number: "3-5 ngày",
      label: "Vận chuyển nhanh",
      icon: <Clock className="w-5 h-5 text-purple-500" />
    }
  ];

  const urgencyOffers = [
    {
      title: "🔥 Ưu đãi tháng này",
      description: "Giảm 10% phí dịch vụ cho đơn hàng đầu tiên",
      action: "Áp dụng ngay",
      expires: "Còn 15 ngày"
    },
    {
      title: "⚡ Miễn phí vận chuyển",
      description: "Cho đơn hàng trên 2 triệu VNĐ",
      action: "Mua ngay",
      expires: "Có thời hạn"
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Trust Features */}
        <motion.div 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến dịch vụ mua hộ quốc tế an toàn, uy tín và chuyên nghiệp nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="mb-16 bg-white rounded-2xl p-8 shadow-sm"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} className="text-center" variants={itemVariants}>
                <div className="flex items-center justify-center mb-2">
                  {stat.icon}
                  <span className="text-2xl md:text-3xl font-bold text-gray-800 ml-2">
                    {stat.number}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Customer Testimonials */}
        <motion.div 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-gray-600">
              Những phản hồi thực tế từ khách hàng đã sử dụng dịch vụ
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                    <div className="border-t pt-4">
                      <div className="font-semibold text-gray-800">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {testimonial.product}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Urgency Offers */}
        <motion.div 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {urgencyOffers.map((offer, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">
                          {offer.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{offer.description}</p>
                        <Badge variant="destructive" className="text-xs">
                          {offer.expires}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      onClick={scrollToContact}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      {offer.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center bg-blue-600 rounded-2xl p-8 text-white"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Sẵn sàng bắt đầu mua hộ quốc tế?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Hàng ngàn sản phẩm từ Nhật Bản, Hàn Quốc, Mỹ đang chờ bạn khám phá. 
            Liên hệ ngay để được tư vấn miễn phí!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={scrollToContact}
              className="bg-white text-blue-600 hover:bg-gray-100 flex items-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Gọi ngay: 0123.456.789
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={scrollToContact}
              className="border-white text-white hover:bg-white hover:text-blue-600 flex items-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat tư vấn 24/7
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignals;
