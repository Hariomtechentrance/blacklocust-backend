import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const PeterEnglandFooter = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Newsletter submission logic
    console.log('Newsletter submission:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  const helpLinks = [
    { name: 'Order Status', to: '/faq/order-status' },
    { name: 'Delivery', to: '/faq/delivery' },
    { name: 'Returns', to: '/faq/returns' },
    { name: 'FAQs', to: '/faq' },
    { name: 'Shipping Policy', to: '/shipping-policy' },
    { name: 'Return and Cancellation Policy', to: '/return-policy' },
    { name: 'Contact Us', to: '/contact' }
  ];

  const aboutLinks = [
    { name: 'About Black Locust', to: '/about' },
    { name: 'Find a Store', to: '/store-locator' },
    { name: 'Blog', to: '/blog' },
    { name: 'Terms and Conditions', to: '/terms' },
    { name: 'Privacy Policy', to: '/privacy' },
    { name: 'Bulk Order', to: '/bulk-order' }
  ];

  const collections = [
    { name: 'Checked Collection', to: '/collection/checked-collection' },
    { name: 'Office Collection', to: '/collection/office-collection' },
    { name: 'Party Wear Collection', to: '/collection/party-wear-collection' },
    { name: 'Casual Collection', to: '/collection/casual-collection' },
    { name: 'New Collection', to: '/collection/new-collection' },
    { name: 'Polos', to: '/collection/polos' },
    { name: 'Denim', to: '/collection/denim' },
    { name: 'Trousers', to: '/collection/trousers' }
  ];

  return (
    <footer className="bg-[#1a1a1a] border-t border-gray-800">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-2xl lg:text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              JOIN THE BLACK LOCUST COMMUNITY
            </h2>
            <p 
              className="text-gray-300 mb-8"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Sign up for updates on the latest Black Locust collection, campaigns and videos.
            </p>
            <form 
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-[#B8972E] transition-colors duration-200"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#B8972E] text-white font-semibold uppercase tracking-wider hover:bg-[#8B7500] transition-all duration-300 transform hover:translate-y-[-2px]"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div>
              <h3 
                className="text-xl font-bold text-white mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                BLACK LOCUST
              </h3>
              <p 
                className="text-gray-300 text-sm leading-relaxed"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                India's most trusted fashion destination for online shopping for men. 
                Premium quality clothing designed for the modern gentleman.
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h4 
                className="text-white font-semibold mb-4"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                FOLLOW US
              </h4>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 text-white flex items-center justify-center rounded-full hover:bg-[#B8972E] transition-colors duration-200"
                >
                  <FaFacebookF size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 text-white flex items-center justify-center rounded-full hover:bg-[#B8972E] transition-colors duration-200"
                >
                  <FaTwitter size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 text-white flex items-center justify-center rounded-full hover:bg-[#B8972E] transition-colors duration-200"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 text-white flex items-center justify-center rounded-full hover:bg-[#B8972E] transition-colors duration-200"
                >
                  <FaYoutube size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 
              className="text-white font-semibold mb-4"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              COLLECTIONS
            </h4>
            <ul className="space-y-2">
              {collections.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 text-sm hover:text-[#B8972E] transition-colors duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 
              className="text-white font-semibold mb-4"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              NEED HELP?
            </h4>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 text-sm hover:text-[#B8972E] transition-colors duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 
              className="text-white font-semibold mb-4"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              ABOUT US
            </h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 text-sm hover:text-[#B8972E] transition-colors duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <FaPhone className="text-[#B8972E]" />
              <div>
                <p 
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  CUSTOMER CARE
                </p>
                <p 
                  className="text-gray-300 text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  +91 98765 43210
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-[#B8972E]" />
              <div>
                <p 
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  EMAIL US
                </p>
                <p 
                  className="text-gray-300 text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  support@blacklocust.com
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-[#B8972E]" />
              <div>
                <p 
                  className="text-white font-semibold text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  CORPORATE OFFICE
                </p>
                <p 
                  className="text-gray-300 text-sm"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Mumbai, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p 
                className="text-gray-400 text-sm"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                © 2024 Black Locust. All Rights Reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <img 
                src="https://img.icons8.com/color/48/visa.png" 
                alt="Visa" 
                className="h-8 w-auto"
              />
              <img 
                src="https://img.icons8.com/color/48/mastercard.png" 
                alt="Mastercard" 
                className="h-8 w-auto"
              />
              <img 
                src="https://img.icons8.com/color/48/amex.png" 
                alt="American Express" 
                className="h-8 w-auto"
              />
              <img 
                src="https://img.icons8.com/color/48/paypal.png" 
                alt="PayPal" 
                className="h-8 w-auto"
              />
              <img 
                src="https://img.icons8.com/color/48/gpay.png" 
                alt="Google Pay" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PeterEnglandFooter;
