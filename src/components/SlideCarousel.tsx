import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slide } from '@/pages/Index';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface SlideCarouselProps {
  slides: Slide[];
  theme: {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
  };
  onRegenerate?: () => void;
}

export const SlideCarousel = ({ slides, theme, onRegenerate }: SlideCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Slide Preview</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={slides.length <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {currentSlide + 1} of {slides.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={slides.length <= 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div 
          className={`aspect-[16/9] p-12 flex flex-col justify-center ${theme.primary} ${theme.text} relative`}
          style={{
            background: theme.primary.includes('gradient') ? 
              'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' : 
              undefined
          }}
        >
          {slide.type === 'cover' ? (
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold leading-tight">{slide.title}</h1>
              <div className="space-y-2">
                {slide.bullets.map((bullet, index) => (
                  <p key={index} className="text-xl opacity-90">{bullet}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">{slide.title}</h2>
              <ul className="space-y-4">
                {slide.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-current mt-3 flex-shrink-0"></div>
                    <span className="text-lg leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Slide number */}
          <div className="absolute bottom-6 right-6 text-sm opacity-70">
            {currentSlide + 1}
          </div>

          {slide.visual && (
            <div className="mt-4">
              <MarkdownRenderer>{slide.visual}</MarkdownRenderer>
              {slide.visualDescription && <p className="text-xs mt-1">{slide.visualDescription}</p>}
              {slide.source && <p className="text-xs text-gray-500 mt-1">Source: {slide.source}</p>}
            </div>
          )}
        </div>
      </Card>

      {/* Slide thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`flex-shrink-0 w-16 h-9 rounded border-2 transition-colors ${
              index === currentSlide 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="w-full h-full rounded-sm bg-gradient-to-br from-gray-100 to-gray-200"></div>
          </button>
        ))}
      </div>
      {/* Generate new slides button */}
      {onRegenerate && (
        <div className="flex justify-end mt-2">
          <Button onClick={onRegenerate} variant="secondary">
            Generate new slides
          </Button>
        </div>
      )}
    </div>
  );
};
