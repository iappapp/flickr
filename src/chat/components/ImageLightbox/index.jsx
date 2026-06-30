import { useEffect, useState } from 'react';
import './ImageLightbox.css';

export default function ImageLightbox({ images, index, onClose, onNavigate }) {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    setCurrent(index);
  }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, images.length]);

  if (!images || images.length === 0) return null;

  const go = (delta) => {
    const next = (current + delta + images.length) % images.length;
    setCurrent(next);
    onNavigate?.(next);
  };

  return (
    <div className="image-lightbox" onClick={onClose}>
      <img
        className="image-lightbox__img"
        src={images[current]}
        alt="预览"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="image-lightbox__close"
        onClick={onClose}
        type="button"
      >
        ×
      </button>
      {images.length > 1 && (
        <>
          <button
            className="image-lightbox__nav image-lightbox__nav--left"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            type="button"
          >
            ‹
          </button>
          <button
            className="image-lightbox__nav image-lightbox__nav--right"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            type="button"
          >
            ›
          </button>
          <div className="image-lightbox__index">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
