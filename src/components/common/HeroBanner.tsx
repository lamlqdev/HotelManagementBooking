import React, { ReactNode } from "react";

interface HeroBannerProps {
  imageUrl?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  imageUrl,
  title,
  description,
  children,
}) => {
  if (!imageUrl) return null;

  return (
    <div className="w-full h-[400px] md:h-[500px] relative rounded-lg overflow-hidden">
      <img
        src={imageUrl}
        alt="Hero banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
        <div className="hidden md:block text-center text-white max-w-4xl px-4 mb-8">
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-up">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 animate-fade-up animation-delay-200">
              {description}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default HeroBanner;
