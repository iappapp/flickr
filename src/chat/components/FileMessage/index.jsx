import './FileMessage.css';

function humanSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function fileIcon(name) {
  if (!name) return '📄';
  const ext = name.split('.').pop().toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return '🖼️';
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return '🎬';
  if (['mp3', 'wav', 'm4a'].includes(ext)) return '🎵';
  if (['zip', 'rar', '7z', 'gz'].includes(ext)) return '🗜️';
  if (['pdf'].includes(ext)) return '📕';
  if (['doc', 'docx'].includes(ext)) return '📘';
  if (['xls', 'xlsx'].includes(ext)) return '📗';
  if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'go'].includes(ext)) return '💻';
  return '📄';
}

export default function FileMessage({ content }) {
  const data = typeof content === 'object' ? content : { name: String(content) };
  const { name, size, url } = data;
  return (
    <a
      className="bubble-file"
      href={url}
      download={name}
      target="_blank"
      rel="noreferrer"
    >
      <span className="bubble-file__icon">{fileIcon(name)}</span>
      <span className="bubble-file__meta">
        <span className="bubble-file__name">{name}</span>
        {size ? <span className="bubble-file__size">{humanSize(size)}</span> : null}
      </span>
      <span className="bubble-file__download">⬇</span>
    </a>
  );
}
