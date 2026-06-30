// Persistence layer: serialize conversations to localStorage while storing
// media Blobs in IndexedDB. Media messages keep only metadata (mediaKey) in
// the serialized form; on load we rebuild Object URLs from IndexedDB.

import { putMedia, getMedia } from './mediaDB';

const STATE_KEY = 'chat.state.v1';

const MEDIA_TYPES = new Set(['image', 'voice', 'video', 'file']);

// Extract a Blob from a runtime media message content.
// Returns { blob, meta } or null if not a media message / no runtime url.
function extractMedia(type, content) {
  if (!MEDIA_TYPES.has(type)) return null;
  if (typeof content !== 'object') return null;
  const { url, duration, mime, name, size } = content;
  if (!url) return null;
  // We can only persist Blob-backed object URLs; remote http(s) URLs (mock
  // data) are kept as-is and not stored in IndexedDB.
  if (/^blob:/.test(url)) {
    // Fetch the blob from the object URL.
    return { url, meta: { duration, mime, name, size } };
  }
  return null;
}

async function blobFromObjectUrl(url) {
  const res = await fetch(url);
  return res.blob();
}

// Serialize: returns a plain state object safe for localStorage.
// Also persists any new blob media into IndexedDB and rewrites content to
// reference mediaKey + metadata instead of the runtime object URL.
export async function saveState(conversations) {
  const serializable = [];
  for (const conv of conversations) {
    const messages = [];
    for (const m of conv.messages) {
      const media = extractMedia(m.type, m.content);
      if (media) {
        try {
          const blob = await blobFromObjectUrl(media.url);
          const mediaKey = `${conv.id}:${m.id}`;
          await putMedia(mediaKey, blob);
          messages.push({
            ...m,
            content: {
              mediaKey,
              duration: media.meta.duration,
              mime: media.meta.mime || blob.type,
              name: media.meta.name,
              size: media.meta.size || blob.size,
            },
          });
          continue;
        } catch (err) {
          console.warn('persist media failed', err);
        }
      }
      messages.push(m);
    }
    const { ...convRest } = conv;
    serializable.push({ ...convRest, messages });
  }
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(serializable));
  } catch (err) {
    console.warn('saveState failed', err);
  }
}

// Load: read from localStorage and rebuild Object URLs for media messages
// from IndexedDB. Returns conversations ready for in-memory use, or null.
export async function loadState() {
  let raw = null;
  try {
    raw = localStorage.getItem(STATE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) return null;

  for (const conv of parsed) {
    for (const m of conv.messages) {
      if (
        typeof m.content === 'object' &&
        m.content &&
        m.content.mediaKey
      ) {
        try {
          const blob = await getMedia(m.content.mediaKey);
          if (blob) {
            m.content = { ...m.content, url: URL.createObjectURL(blob) };
          }
        } catch (err) {
          console.warn('load media failed', err);
        }
      }
    }
  }
  return parsed;
}

export function clearState() {
  try {
    localStorage.removeItem(STATE_KEY);
  } catch {
    /* ignore */
  }
}
