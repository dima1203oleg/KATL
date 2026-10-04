'use client';
import { useState } from 'react';

export function ProductMedia({
  label,
  productId,
}: {
  label: string;
  productId?: string;
}) {
  const media = [
    ...(productId ? [[`/design/products/${productId}.webp`, 'CATL Equipment Specification Visual']] : []),
    ['/design/tener-gallery.webp', 'Concept illustration'],
    ['/design/tener-hero.webp', 'Energy storage site concept illustration'],
  ];

  const [active, setActive] = useState(0);

  return (
    <div className="reference-gallery">
      <figure style={{ background: '#ffffff', border: 'none', padding: '10px' }}>
        <img
          src={media[active][0]}
          alt={media[active][1]}
          width="795"
          height="320"
          style={{ objectFit: 'contain', background: 'transparent' }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/design/tener-gallery.webp';
          }}
        />
        <figcaption>{label}</figcaption>
      </figure>
      <div className="media-thumbnails">
        {media.map(([src, alt], i) => (
          <button
            key={src}
            type="button"
            aria-label={alt}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            style={{ background: '#ffffff', borderColor: i === active ? 'var(--blue)' : '#e5e7eb' }}
          >
            <img
              src={src}
              alt=""
              width="120"
              height="80"
              style={{ objectFit: 'contain', background: '#ffffff' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/design/tener-gallery.webp';
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
