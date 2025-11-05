"use client";

interface ImageViewerProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ImageViewer = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: ImageViewerProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/20 hover:bg-white/30 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all z-50"
        onClick={onClose}
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      {/* Previous Button */}
      <button
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all z-50 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* Image */}
      <img
        src={images[currentIndex]}
        alt="Selected Image"
        className="max-h-[85vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next Button */}
      <button
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all z-50 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>

      {/* Image Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm md:text-base">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};
