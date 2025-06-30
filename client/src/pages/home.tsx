import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import TrackingSection from "@/components/tracking-section";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import airplaneImage from "@assets/project-details_1751228254997.jpg";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Features Section */}
      <section className="relative py-32 bg-gray-50 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={airplaneImage} 
            alt="SwiftCourier airplane ready for worldwide delivery" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose SwiftCourier?</h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">We deliver more than packages - we deliver peace of mind with every shipment</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-white">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-clock text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Tracking</h3>
              <p className="text-gray-600">Monitor your package journey with live GPS tracking and instant status updates from pickup to delivery.</p>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-white">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-shield-alt text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Delivery</h3>
              <p className="text-gray-600">Your packages are protected with advanced security measures and comprehensive insurance coverage.</p>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-white">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-globe text-2xl text-accent"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Network</h3>
              <p className="text-gray-600">Extensive worldwide coverage with local expertise in over 220 countries and territories.</p>
            </div>
          </div>
        </div>
      </section>
      
      <HeroSection />
      <TrackingSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
