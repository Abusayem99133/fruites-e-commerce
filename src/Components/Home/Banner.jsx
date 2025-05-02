import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const bannerImages = [
  {
    url: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Various fresh fruits",
  },
  {
    url: "https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Assorted fruits on display",
  },
  {
    url: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Fresh fruit arrangement",
  },
];

function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerImages.length) % bannerImages.length
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {bannerImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
          <img
            src={image.url}
            alt={image.alt}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
            Fresh, Organic Fruits
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fadeIn delay-200">
            Handpicked, naturally grown, and delivered fresh to your doorstep.
            Enjoy nature's goodness with our premium quality fruits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn delay-300">
            <Button
              size="lg"
              onClick={() => navigate("/fruits")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/about")}
              className="text-white border-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner;
