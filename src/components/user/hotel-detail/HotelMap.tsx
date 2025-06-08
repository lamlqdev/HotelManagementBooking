import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface HotelMapProps {
  address: string;
}

const HotelMap = ({ address }: HotelMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Khởi tạo bản đồ
    const map = L.map(mapRef.current).setView([10.762622, 106.660172], 13); // Mặc định là TP.HCM
    mapInstanceRef.current = map;

    // Thêm tile layer từ OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Tìm kiếm địa chỉ bằng Nominatim API
    const searchAddress = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const location = L.latLng(parseFloat(lat), parseFloat(lon));

          // Cập nhật vị trí bản đồ
          map.setView(location, 15);

          // Thêm marker
          L.marker(location).addTo(map).bindPopup(address).openPopup();
        }
      } catch (error) {
        console.error("Error searching address:", error);
      }
    };

    searchAddress();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [address]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default HotelMap;
