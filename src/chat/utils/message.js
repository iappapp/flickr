export function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const pad = (n) => String(n).padStart(2, '0');
  if (sameDay) return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();
  if (isYesterday) return '昨天';
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function lastMessageText(message) {
  if (!message) return '';
  switch (message.type) {
    case 'text':
    case 'emoji':
      return message.content;
    case 'image':
      return '[图片]';
    case 'voice':
      return '[语音]';
    case 'video':
      return '[视频]';
    case 'file':
      return '[文件]';
    case 'system':
      return message.content;
    default:
      return '';
  }
}

// Date label for message dividers, e.g. "今天" / "昨天" / "3月4日".
// Optional translator `t` with today/yesterday/daysAgo keys.
export function dateLabel(ts, t) {
  const d = new Date(ts);
  const now = new Date();
  const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
  if (diffDays <= 0) return t?.today || '今天';
  if (diffDays === 1) return t?.yesterday || '昨天';
  if (diffDays < 7) return `${diffDays}${t?.daysAgo || '天前'}`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}
