"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/presentation/components/ui/button";

interface EstablishmentGalleryProps {
  images: string[];
}

export function EstablishmentGallery({ images }: EstablishmentGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className="h-[300px] w-full bg-cover bg-center transition-all duration-500 ease-in-out md:h-[400px]"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      />

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full opacity-80 hover:opacity-100"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Image précédente</span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full opacity-80 hover:opacity-100"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Image suivante</span>
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-primary/30"}`}
            onClick={() => setCurrentIndex(index)}
          >
            <span className="sr-only">Image {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
