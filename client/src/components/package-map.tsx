import { useEffect, useRef } from "react";

interface PackageMapProps {
  lat: number;
  lng: number;
  address: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function PackageMap({ lat, lng, address }: PackageMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        styles: [
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#757575" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9e9e9e" }],
          },
        ],
      });

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: address,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#1E40AF" stroke="white" stroke-width="4"/>
              <path d="M16 8L12 14H20L16 8Z" fill="white"/>
              <circle cx="16" cy="18" r="2" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold;">Package Location</h4>
            <p style="margin: 0; color: #666;">${address}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      mapInstanceRef.current = map;
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement("script");
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY environment variable.');
        return;
      }
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [lat, lng, address]);

  return (
    <div 
      ref={mapRef} 
      className="h-64 bg-gray-200 rounded-lg"
      style={{ minHeight: '256px' }}
    >
      {!window.google && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-map text-4xl text-gray-400 mb-2"></i>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
