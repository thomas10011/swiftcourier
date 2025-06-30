export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-shipping-fast text-2xl text-accent mr-2"></i>
              <span className="text-2xl font-bold">SwiftCourier</span>
            </div>
            <p className="text-gray-300 mb-4">Your trusted partner for fast, reliable, and secure package delivery worldwide.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-accent"><i className="fab fa-facebook text-xl"></i></a>
              <a href="#" className="text-gray-300 hover:text-accent"><i className="fab fa-twitter text-xl"></i></a>
              <a href="#" className="text-gray-300 hover:text-accent"><i className="fab fa-linkedin text-xl"></i></a>
              <a href="#" className="text-gray-300 hover:text-accent"><i className="fab fa-instagram text-xl"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-accent">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('track')} className="text-gray-300 hover:text-accent">
                  Track Package
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-accent">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="text-gray-300 hover:text-accent">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-accent">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-accent">Express Delivery</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent">International Shipping</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent">E-commerce Solutions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent">Freight Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-accent">Warehousing</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p><i className="fas fa-map-marker-alt mr-2"></i>123 Logistics Avenue, NY 10001</p>
              <p><i className="fas fa-phone mr-2"></i>+1 (555) 123-4567</p>
              <p><i className="fas fa-envelope mr-2"></i>info@swiftcourier.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 SwiftCourier. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
