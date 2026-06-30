import { useEffect, useMemo, useState } from 'react';
import { emojiCategories } from '../../data/mockData';
import './EmojiPicker.css';

const RECENT_KEY = 'chat.emoji.recent';
const RECENT_MAX = 24;

function loadRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export default function EmojiPicker({ onPick }) {
  const [activeCat, setActiveCat] = useState(emojiCategories[0].key);
  const [keyword, setKeyword] = useState('');
  const [recent, setRecent] = useState(loadRecent);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  const recordRecent = (emoji) => {
    setRecent((prev) => {
      const next = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, RECENT_MAX);
      saveRecent(next);
      return next;
    });
  };

  const handlePick = (emoji) => {
    recordRecent(emoji);
    onPick(emoji);
  };

  const flatAll = useMemo(
    () => emojiCategories.flatMap((c) => c.emojis),
    []
  );

  const visibleEmojis = useMemo(() => {
    const kw = keyword.trim();
    if (kw) {
      // No keyword metadata for emojis; do a simple contains filter on the
      // category label so searching "动物" shows animal emojis.
      const matchedCats = emojiCategories
        .filter((c) => c.label.includes(kw))
        .flatMap((c) => c.emojis);
      return matchedCats.length ? matchedCats : flatAll;
    }
    if (activeCat === 'recent') return recent;
    return emojiCategories.find((c) => c.key === activeCat)?.emojis || [];
  }, [keyword, activeCat, recent, flatAll]);

  const tabs = [{ key: 'recent', label: '最近' }, ...emojiCategories];

  return (
    <div className="emoji-picker">
      <div className="emoji-picker__search">
        <input
          type="text"
          placeholder="搜索分类（如：动物）"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="emoji-picker__grid">
        {visibleEmojis.length === 0 && (
          <div className="emoji-picker__empty">暂无表情</div>
        )}
        {visibleEmojis.map((emoji, idx) => (
          <button
            key={`${emoji}-${idx}`}
            className="emoji-picker__item"
            onClick={() => handlePick(emoji)}
            type="button"
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="emoji-picker__tabs">
        {tabs.map((cat) => (
          <button
            key={cat.key}
            className={`emoji-picker__tab ${activeCat === cat.key && !keyword ? 'is-active' : ''}`}
            onClick={() => {
              setKeyword('');
              setActiveCat(cat.key);
            }}
            type="button"
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
