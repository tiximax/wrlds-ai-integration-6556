
import React from 'react';
import { Mail, Linkedin, Phone } from 'lucide-react';

const ContactInfo = () => {
  return (
    <section id="contact-info" className="bg-gradient-to-b from-white to-black text-white relative py-[15px] md:py-[25px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block mb-3 px-3 py-1 bg-white text-black rounded-full text-sm font-medium">
            Liên hệ chúng tôi
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Liên hệ ngay hôm nay
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Bản có thắc mắc về dịch vụ mua hộ quốc tế của chúng tôi? Hãy liên hệ để chúng tôi có thể tư vấn và hỗ trợ bản một cách tốt nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Felix's Contact Info */}
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img 
                src="/lovable-uploads/aa5291bd-2417-4c1e-9a02-0bcc71a92507.png"
                alt="Nguyễn Minh Quân"
                className="w-32 h-32 rounded-full mb-4 object-cover filter grayscale"
              />
              <h3 className="text-xl font-bold text-gray-900">Nguyễn Minh Quân</h3>
              <p className="text-gray-600 mb-4">CEO & Founder</p>
              <div className="flex flex-col space-y-3">
                <a href="mailto:contact@globalshoppingassistant.com" className="flex items-center text-gray-700 hover:text-blue-600">
                  <Mail className="w-5 h-5 mr-2" />
                  contact@globalshoppingassistant.com
                </a>
                <a 
                  href="#" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>

          {/* Love's Contact Info */}
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img 
                src="/lovable-uploads/a9bb9110-964a-43b0-a5ab-7162140cd133.png"
                alt="Phạm Văn Đức"
                className="w-32 h-32 rounded-full mb-4 object-cover filter grayscale"
              />
              <h3 className="text-xl font-bold text-gray-900">Phạm Văn Đức</h3>
              <p className="text-gray-600 mb-4">COO</p>
              <div className="flex flex-col space-y-3">
                <a href="mailto:support@globalshoppingassistant.com" className="flex items-center text-gray-700 hover:text-blue-600">
                  <Mail className="w-5 h-5 mr-2" />
                  support@globalshoppingassistant.com
                </a>
                <a 
                  href="#" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn Profile
                </a>
                <a href="tel:+84901234567" className="flex items-center text-gray-700 hover:text-blue-600">
                  <Phone className="w-5 h-5 mr-2" />
                  090 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
