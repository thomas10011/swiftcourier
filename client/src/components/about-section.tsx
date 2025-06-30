import warehousing from "@assets/warehousing.jpg";
export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About SwiftCourier</h2>
            <p className="text-lg text-gray-600 mb-6">
              Since 2010, SwiftCourier has been at the forefront of package delivery innovation, 
              connecting businesses and individuals across the globe with reliable, fast, and secure shipping solutions.
            </p>
            <p className="text-gray-600 mb-8">
              Our commitment to excellence has made us a trusted partner for over 100,000 customers worldwide. 
              With state-of-the-art tracking technology and a dedicated team of logistics professionals, 
              we ensure your packages reach their destination safely and on time.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary">2M+</div>
                <div className="text-gray-600">Packages Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">220+</div>
                <div className="text-gray-600">Countries Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">99.8%</div>
                <div className="text-gray-600">On-Time Delivery</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </div>
            </div>
          </div>
          <div>
            <img 
              src={warehousing} 
              alt="SwiftCourier warehouse facility" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
