"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
                    className="size-8 rounded-full opacity-80 hover:opacity-100"
                    size="icon"
                    variant="secondary"
                    onClick={goToPrevious}
                >
                    <ChevronLeft className="size-4" />
                    <span className="sr-only">Image précédente</span>
                </Button>
                <Button
                    className="size-8 rounded-full opacity-80 hover:opacity-100"
                    size="icon"
                    variant="secondary"
                    onClick={goToNext}
                >
                    <ChevronRight className="size-4" />
                    <span className="sr-only">Image suivante</span>
                </Button>
            </div>

            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`size-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-primary/30"}`}
                        onClick={() => setCurrentIndex(index)}
                    >
                        <span className="sr-only">Image {index + 1}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
