import { useEffect, useRef } from "react";

interface HotelTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const HotelTabs = ({ activeTab, onTabChange }: HotelTabsProps) => {
  const tabs = ["tổng quan", "phòng", "đánh giá"];
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-100px 0px -80% 0px", // Điều chỉnh margin để phù hợp với vị trí tab
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onTabChange(entry.target.id);
        }
      });
    }, options);

    tabs.forEach((tab) => {
      const element = document.getElementById(tab);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [onTabChange]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    onTabChange(sectionId);
  };

  return (
    <div className="sticky top-0 bg-background z-40 border-b border-border mt-12 py-4">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => scrollToSection(tab)}
            className={`pb-4 px-2 ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary font-medium"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HotelTabs;
