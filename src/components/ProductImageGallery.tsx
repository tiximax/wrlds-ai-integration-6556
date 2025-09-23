import React, { useState } from 'react';
import { ProductImage } from '@/types/simple';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { PinchZoom } from '@/components/ui/pinch-zoom';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi | null>(null);

  const primary = images.find((i) => i.isPrimary) || images[0];
  const ordered = [primary, ...images.filter((i) => i.id !== primary.id)].filter(Boolean) as ProductImage[];

  return (
    <div className="w-full">
      {/* Main image carousel */}
      <div className="relative">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {ordered.map((img, idx) => (
              <CarouselItem key={img.id}>
                <div
                  role="button"
                  aria-label="Zoom image"
                  onClick={() => {
                    setActiveIndex(idx);
                    setZoomOpen(true);
                  }}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
                >
                  {/* Desktop lens zoom */}
                  <div className="hidden lg:block w-full h-full">
                    {img?.url && (
                      React.createElement(require('@/components/ui/lens-zoom').default, {
                        src: img.url,
                        alt: img?.alt || productName,
                        zoom: 2,
                        className: 'w-full h-full'
                      })
                    )}
                  </div>
                  {/* Mobile/Tablet image */}
                  <div className="block lg:hidden w-full h-full">
                    <img
                      src={img.url}
                      alt={img.alt || productName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute inset-y-1/2 -translate-y-1/2 left-2 hidden sm:block">
            <CarouselPrevious />
          </div>
          <div className="absolute inset-y-1/2 -translate-y-1/2 right-2 hidden sm:block">
            <CarouselNext />
          </div>
        </Carousel>
      </div>

      {/* Thumbnails */}
      {ordered.length > 1 && (
        <>
          {/* Mobile: horizontal scroll */}
          <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto sm:hidden px-1">
            {ordered.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => {
                  setActiveIndex(idx);
                  api?.scrollTo(idx);
                }}
                className={cn(
                  'min-w-[64px] h-16 rounded-md overflow-hidden border flex-shrink-0',
                  activeIndex === idx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                )}
              >
                <img src={img.url} alt={img.alt || productName} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Desktop: grid */}
          <div className="mt-4 hidden sm:grid grid-cols-6 gap-2">
            {ordered.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => {
                  setActiveIndex(idx);
                  api?.scrollTo(idx);
                }}
                className={cn(
                  'aspect-square rounded-md overflow-hidden border',
                  activeIndex === idx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                )}
              >
                <img src={img.url} alt={img.alt || productName} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Zoom dialog */}
      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-5xl p-0">
          <div className="bg-black">
            <PinchZoom className="w-full h-full">
              <img
                src={ordered[activeIndex]?.url}
                alt={ordered[activeIndex]?.alt || productName}
                className="max-h-[80vh] w-auto mx-auto object-contain select-none pointer-events-none"
                draggable={false}
              />
            </PinchZoom>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageGallery;