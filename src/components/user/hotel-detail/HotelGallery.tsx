import { IoClose, IoArrowBack, IoArrowForward } from "react-icons/io5";
import { useState } from "react";

interface HotelGalleryProps {
  images: string[];
}

const HotelGallery = ({ images }: HotelGalleryProps) => {
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {/* Hình ảnh chính */}
        <div
          className="md:col-span-4 aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => {
            setCurrentImageIndex(0);
            setShowGallery(true);
          }}
        >
          <img
            src={images[0]}
            alt="Main hotel image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hình ảnh phụ */}
        <div className="md:col-span-3 grid grid-cols-2 gap-2">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(index + 1);
                setShowGallery(true);
              }}
            >
              <img
                src={image}
                alt={`Hotel image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal Gallery */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <IoClose size={24} />
          </button>

          <button
            onClick={handlePrevImage}
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <IoArrowBack size={24} />
          </button>

          <button
            onClick={handleNextImage}
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <IoArrowForward size={24} />
          </button>

          <div className="w-full max-w-5xl max-h-[80vh] relative">
            <img
              src={images[currentImageIndex]}
              alt={`Gallery image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelGallery;
