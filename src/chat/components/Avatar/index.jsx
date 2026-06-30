import { useState } from 'react';
import './Avatar.css';

const FALLBACK = `${process.env.PUBLIC_URL || ''}/default-avatar.svg`;

/**
 * Avatar image with a local fallback when the remote avatar fails to load.
 * Accepts the same props as an <img> plus a `size` for convenience styling.
 */
export default function Avatar({ src, alt, size = 40, radius = 6, className = '', style, ...rest }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      className={`avatar ${className}`}
      src={failed ? FALLBACK : src}
      alt={alt || ''}
      style={{ width: size, height: size, borderRadius: radius, ...style }}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
