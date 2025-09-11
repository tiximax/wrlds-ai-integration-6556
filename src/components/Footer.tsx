
import { ArrowRight, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from 'emailjs-com';

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // EmailJS configuration
      const EMAILJS_SERVICE_ID = "service_i3h66xg";
      const EMAILJS_TEMPLATE_ID = "template_fgq53nh";
      const EMAILJS_PUBLIC_KEY = "wQmcZvoOqTAhGnRZ3";
      
      const templateParams = {
        from_name: "Website Subscriber",
        from_email: email,
        message: `New subscription request from the website footer.`,
        to_name: 'Global Shopping Assistant Team',
        reply_to: email
      };
      
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default"
      });
      
      setEmail("");
    } catch (error) {
      console.error("Error sending subscription:", error);
      
      toast({
        title: "Error",
        description: "There was a problem subscribing. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="contact" className="bg-black text-white pt-16 pb-8 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 pb-10 border-b border-gray-700">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Global Shopping Assistant</h2>
              <p className="text-gray-400 text-sm">Dịch vụ Mua hộ Quốc tế Uy tín #1</p>
            </div>
            <p className="text-gray-300 mb-6">
              Chúng tôi cung cấp dịch vụ mua hộ toàn diện từ Nhật Bản, Hàn Quốc và Mỹ, giúp khách hàng tiếp cận các sản phẩm chất lượng cao với giá cả hợp lý và dịch vụ chuyên nghiệp.
            </p>
            <p className="text-gray-300 mb-6">
              Tầng 12, Tòa nhà Vietcombank<br />
              198 Trần Quốc Toản, Cầu Giấy, Hà Nội
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Công ty</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors">Tuyển dụng</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Liên hệ</h3>
            <form className="space-y-4" onSubmit={handleSubscribe}>
              <div>
                <input 
                  type="email" 
                  placeholder="Email của bạn"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <button 
                type="submit" 
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng ký..." : (
                  <>
                    Đăng ký nhận tin
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Global Shopping Assistant. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
