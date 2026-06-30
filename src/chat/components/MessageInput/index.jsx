import { useMemo, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useI18n } from '../../i18n';
import { users } from '../../data/mockData';
import EmojiPicker from '../EmojiPicker';
import VoiceRecorder from '../VoiceRecorder';
import './MessageInput.css';

export default function MessageInput() {
  const { sendMessage, activeConversation } = useChat();
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [mention, setMention] = useState(null); // { query, start, end }

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const groupMembers = useMemo(() => {
    if (!activeConversation || activeConversation.type !== 'group') return [];
    return (activeConversation.memberIds || [])
      .filter((id) => id !== 'u_me')
      .map((id) => users[id])
      .filter(Boolean);
  }, [activeConversation]);

  const mentionCandidates = useMemo(() => {
    if (!mention) return [];
    const q = mention.query.toLowerCase();
    return groupMembers.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 6);
  }, [mention, groupMembers]);

  const detectMention = (value, cursor) => {
    if (groupMembers.length === 0) return null;
    const before = value.slice(0, cursor);
    const match = before.match(/@([^\s@]*)$/);
    if (!match) return null;
    const start = cursor - match[0].length;
    // The @ must be at start or preceded by whitespace.
    if (start > 0 && !/\s/.test(value[start - 1])) return null;
    return { query: match[1], start, end: cursor };
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    const cursor = e.target.selectionStart;
    setMention(detectMention(value, cursor));
  };

  const insertMention = (user) => {
    if (!mention) return;
    const before = text.slice(0, mention.start);
    const after = text.slice(mention.end);
    const insert = `@${user.name} `;
    const next = before + insert + after;
    setText(next);
    setMention(null);
    const cursor = before.length + insert.length;
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(cursor, cursor);
    });
  };

  const handleSendText = () => {
    const value = text.trim();
    if (!value) return;
    sendMessage({ type: 'text', content: value });
    setText('');
    setMention(null);
  };

  const handleKeyDown = (e) => {
    if (mention && mentionCandidates.length > 0) {
      if (e.key === 'Escape') {
        setMention(null);
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        insertMention(mentionCandidates[0]);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    } else if (e.key === 'Escape' && showEmoji) {
      setShowEmoji(false);
    }
  };

  const handleEmojiPick = (emoji) => {
    sendMessage({ type: 'emoji', content: emoji });
    setShowEmoji(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    sendMessage({ type: 'image', content: url });
    e.target.value = '';
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    sendMessage({ type: 'video', content: url });
    e.target.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    sendMessage({
      type: 'file',
      content: { name: file.name, size: file.size, mime: file.type, url },
    });
    e.target.value = '';
  };

  const handleVoiceSend = (content) => {
    sendMessage({ type: 'voice', content });
  };

  return (
    <div className="message-input">
      <div className="message-input__toolbar">
        <button
          className="message-input__btn"
          onClick={() => setShowEmoji((v) => !v)}
          title="表情"
          type="button"
        >
          😊
        </button>
        <button
          className="message-input__btn"
          onClick={() => imageInputRef.current?.click()}
          title="图片"
          type="button"
        >
          🖼️
        </button>
        <button
          className="message-input__btn"
          onClick={() => videoInputRef.current?.click()}
          title="视频"
          type="button"
        >
          🎬
        </button>
        <button
          className="message-input__btn"
          onClick={() => fileInputRef.current?.click()}
          title="文件"
          type="button"
        >
          📎
        </button>
        <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
        <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={handleVideoChange} />
        <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />
      </div>

      {showEmoji && (
        <div className="message-input__emoji">
          <EmojiPicker onPick={handleEmojiPick} />
        </div>
      )}

      <div className="message-input__row">
        <VoiceRecorder onSend={handleVoiceSend} t={t} />
        <div className="message-input__textarea-wrap">
          <textarea
            ref={textareaRef}
            className="message-input__textarea"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={t.inputPlaceholder}
            rows={3}
          />
          {mention && mentionCandidates.length > 0 && (
            <ul className="mention-popover">
              {mentionCandidates.map((u) => (
                <li
                  key={u.id}
                  className="mention-popover__item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(u);
                  }}
                >
                  <img className="mention-popover__avatar" src={u.avatar} alt={u.name} />
                  <span>{u.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="message-input__send"
          onClick={handleSendText}
          disabled={!text.trim()}
          type="button"
        >
          {t.send}
        </button>
      </div>
    </div>
  );
}
