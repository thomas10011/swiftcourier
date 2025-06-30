import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, getStatusColor } from "@/lib/utils";

import type { Package } from "@shared/schema";

export default function TrackingSection() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [showNoResults, setShowNoResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for tracking results from hero section
    const handleTrackingResult = (event: CustomEvent<Package>) => {
      setPackageData(event.detail);
      setShowNoResults(false);
    };

    window.addEventListener('showTrackingResult', handleTrackingResult as EventListener);
    return () => {
      window.removeEventListener('showTrackingResult', handleTrackingResult as EventListener);
    };
  }, []);

  const handleDetailedTrack = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking Number Required",
        description: "Please enter a tracking number to search.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPackageData(null);
    setShowNoResults(false);

    try {
      const response = await apiRequest('GET', `/api/track/${trackingNumber.trim()}`);
      const data = await response.json();
      setPackageData(data);
      setShowNoResults(false);
    } catch (error) {
      setPackageData(null);
      setShowNoResults(true);
      toast({
        title: "Package Not Found",
        description: "Please check your tracking number and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="track" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Track Your Package</h2>
          <p className="text-xl text-gray-600">Get detailed information about your shipment's current status and location</p>
        </div>

        {/* Tracking Input */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gray-50 p-8 rounded-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Enter your tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDetailedTrack()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button
                onClick={handleDetailedTrack}
                disabled={isLoading}
                className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <i className="fas fa-search mr-2"></i>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tracking Results */}
        {packageData && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
            {/* Package Status Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Tracking #{packageData.trackingNumber}
                </h3>
                <div className="flex items-center">
                  <Badge className={getStatusColor(packageData.status)}>
                    <i className="fas fa-check-circle mr-2"></i>
                    {packageData.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-semibold">{formatDate(packageData.updatedAt)}</p>
              </div>
            </div>

            {/* Package Details Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Sender & Receiver Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">From:</h5>
                    <p className="text-gray-600">{packageData.sender.name}</p>
                    <p className="text-gray-600">{packageData.sender.address}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">To:</h5>
                    <p className="text-gray-600">{packageData.receiver.name}</p>
                    <p className="text-gray-600">{packageData.receiver.address}</p>
                  </div>
                </div>
              </div>

              {/* Package Physical Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Package Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="text-gray-600">{packageData.packageDetails.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Weight:</span>
                    <span className="text-gray-600">{packageData.packageDetails.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Height:</span>
                    <span className="text-gray-600">{packageData.packageDetails.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Color:</span>
                    <span className="text-gray-600 flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                        style={{ backgroundColor: packageData.packageDetails.color.toLowerCase() }}
                      ></div>
                      {packageData.packageDetails.color}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package Photo */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Package Photo</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {packageData.photo ? (
                    <img
                      src={`/uploads/${packageData.photo}`}
                      alt="Package photo"
                      className="rounded-lg shadow-md w-full h-auto max-h-64 object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">
                      <i className="fas fa-image text-4xl mb-2"></i>
                      <p>No photo available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Current Location & Map */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Location</h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                  <span className="font-medium">{packageData.currentLocation.address}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Coordinates: {packageData.currentLocation.lat}, {packageData.currentLocation.lng}
                </p>
              </div>
              
              {/* Location Information */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-center text-gray-600">
                  <i className="fas fa-map text-4xl mb-2"></i>
                  <p>Map feature temporarily disabled</p>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                <i className="fas fa-sticky-note text-primary mr-2"></i>
                Tracking Notes
              </h4>
              <p className="text-gray-700">{packageData.adminNotes}</p>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {showNoResults && (
          <div className="text-center py-12">
            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Package Not Found</h3>
            <p className="text-gray-600">Please check your tracking number and try again.</p>
          </div>
        )}
      </div>
    </section>
  );
}
