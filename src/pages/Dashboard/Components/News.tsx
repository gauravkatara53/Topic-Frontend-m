import React, { useEffect, useRef, useState } from "react";
import { fetchNews } from "@/services/newService";
import { showError } from "@/utils/errorHandler";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  date: string;
  link: string;
}

const CARD_HEIGHT = 120; // card height in px (should match Tailwind)
const VISIBLE_CARDS = 2;

const News: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews();
        if (Array.isArray(data)) {
          setNewsItems(data);
        }
      } catch (err) {
        showError(err);
      }
    };
    loadNews();
  }, []);

  useEffect(() => {
    if (paused || newsItems.length <= VISIBLE_CARDS) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= newsItems.length - VISIBLE_CARDS ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [paused, newsItems]);

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffY) > 30) {
      if (diffY > 0 && currentIndex < newsItems.length - VISIBLE_CARDS) {
        setCurrentIndex((prev) => prev + 1); // swipe up
      } else if (diffY < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1); // swipe down
      }
    }
    touchStartY.current = null;
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-left">
        NEWS
      </h1>

      <div
        className="bg-white rounded-lg shadow-lg overflow-hidden relative h-[370px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={containerRef}
          className="transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateY(-${currentIndex * CARD_HEIGHT}px)`,
          }}
        >
          <div className="flex flex-col">
            {newsItems.map((item) => (
              <a
                key={item._id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className="bg-gray-50 rounded-xl shadow-sm p-4 mx-3 my-2 flex flex-col justify-between border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all"
                  style={{ minHeight: `${CARD_HEIGHT - 10}px` }}
                >
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-1 line-clamp-1 text-left">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-700 line-clamp-2 text-left">
                      {item.content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 text-right mt-1 ">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
