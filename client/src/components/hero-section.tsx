import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function HeroSection() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleQuickTrack = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking Number Required",
        description: "Please enter a tracking number to search.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('GET', `/api/track/${trackingNumber.trim()}`);
      const packageData = await response.json();
      
      // Scroll to tracking section and show results
      const trackingSection = document.getElementById('track');
      if (trackingSection) {
        trackingSection.scrollIntoView({ behavior: 'smooth' });
        // Trigger tracking display in tracking section
        const event = new CustomEvent('showTrackingResult', { detail: packageData });
        window.dispatchEvent(event);
      }
    } catch (error) {
      toast({
        title: "Package Not Found",
        description: "Please check your tracking number and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative">
      {/* Hero Background */}
      <div className="courier-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Fast, Reliable <br />
              <span className="text-accent">Package Delivery</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Track your packages in real-time with our advanced logistics network. 
              Delivering excellence across the globe with speed and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => scrollToSection('track')}
                className="bg-accent hover:bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Track Package
              </Button>
              <Button 
                onClick={() => scrollToSection('services')}
                variant="outline"
                className="bg-white hover:bg-gray-100 text-primary px-8 py-3 rounded-lg font-semibold transition-colors border-white"
              >
                Our Services
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Track Section */}
      <div className="bg-white shadow-xl -mt-12 relative z-10 max-w-4xl mx-auto rounded-xl p-8 mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Package Tracking</h2>
          <p className="text-gray-600">Enter your tracking number to get real-time updates</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter tracking number (e.g., 7F3KJ9ZQ)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickTrack()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button
            onClick={handleQuickTrack}
            disabled={isLoading}
            className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <i className="fas fa-search mr-2"></i>
            {isLoading ? 'Searching...' : 'Track Now'}
          </Button>
        </div>
      </div>
    </section>
  );
}
