export default function ServicesSection() {
  const services = [
    {
      title: "Express Delivery",
      icon: "fas fa-bolt",
      description: "Same-day and overnight delivery options for urgent shipments with guaranteed time-definite service.",
      features: ["Same-day delivery", "Next-day delivery", "Time-definite options"],
      gradient: true,
      color: "courier-gradient"
    },
    {
      title: "International Shipping",
      icon: "fas fa-globe",
      description: "Worldwide shipping with customs clearance support and international tracking capabilities.",
      features: ["220+ countries", "Customs support", "Duty management"],
      gradient: false,
      color: "text-accent"
    },
    {
      title: "E-commerce Solutions",
      icon: "fas fa-shopping-cart",
      description: "Integrated shipping solutions for online businesses with API integration and bulk shipping.",
      features: ["API integration", "Bulk shipping", "Returns management"],
      gradient: false,
      color: "text-green-600"
    },
    {
      title: "Freight Services",
      icon: "fas fa-truck",
      description: "Heavy and oversized shipment solutions with specialized handling and equipment.",
      features: ["LTL & FTL options", "Specialized handling", "White glove service"],
      gradient: false,
      color: "text-secondary"
    },
    {
      title: "Warehousing",
      icon: "fas fa-warehouse",
      description: "Secure storage and distribution services with inventory management and fulfillment.",
      features: ["Secure storage", "Inventory management", "Pick & pack services"],
      gradient: false,
      color: "text-primary"
    },
    {
      title: "Supply Chain Management",
      icon: "fas fa-link",
      description: "End-to-end supply chain optimization with analytics and strategic consulting services.",
      features: ["Chain optimization", "Analytics & reporting", "Strategic consulting"],
      gradient: true,
      color: "courier-accent-gradient"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive shipping and logistics solutions tailored to meet your unique needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl ${
                service.gradient
                  ? `${service.color} text-white`
                  : "bg-white border-2 border-gray-100 hover:shadow-xl transition-shadow"
              }`}
            >
              <i className="fas fa-truck text-4xl mb-6 text-[#004182]"></i>
              <h3 className={`text-xl font-bold mb-4 ${
                service.gradient ? "text-white" : "text-gray-900"
              }`}>
                {service.title}
              </h3>
              <p className={`mb-6 ${
                service.gradient ? "text-white" : "text-gray-600"
              }`}>
                {service.description}
              </p>
              <ul className={`text-sm space-y-2 ${
                service.gradient ? "text-white" : "text-gray-600"
              }`}>
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <i className={`fas fa-check mr-2 ${
                      service.gradient ? "text-white" : "text-green-600"
                    }`}></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
