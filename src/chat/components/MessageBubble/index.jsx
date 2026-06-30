import { useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useI18n } from '../../i18n';
import { users } from '../../data/mockData';
import { formatTime } from '../../utils/message';
import Avatar from '../Avatar';
import VoiceMessage from '../VoiceMessage';
import FileMessage from '../FileMessage';
import MessageActionMenu from '../MessageActionMenu';
import './MessageBubble.css';

const RECALL_WINDOW = 2 * 60 * 1000; // 2 minutes

export default function MessageBubble({ message, sender, isMe, onImageClick }) {
  const { type, content, time, status, recalled } = message;
  const [videoOpen, setVideoOpen] = useState(false);
  const [menu, setMenu] = useState(null); // { x, y }
  const [forwarding, setForwarding] = useState(false);
  const longPressTimer = useRef(null);

  const { activeConversation, deleteMessage, recallMessage, forwardMessage } = useChat();
  const convId = activeConversation?.id;

  if (type === 'system' || recalled) {
    return <div className="bubble-system">{content}</div>;
  }

  const showName = !isMe;
  const canRecall = isMe && Date.now() - time < RECALL_WINDOW;

  const openMenu = (x, y) => setMenu({ x, y });
  const handleContextMenu = (e) => {
    e.preventDefault();
    openMenu(e.clientX, e.clientY);
  };
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      openMenu(window.innerWidth / 2, window.innerHeight / 2);
    }, 500);
  };
  const clearLongPress = () => clearTimeout(longPressTimer.current);

  const handleCopy = () => {
    let text = '';
    if (typeof message.content === 'string') text = message.content;
    else if (message.content?.name) text = message.content.name;
    else if (message.content?.duration) text = `[语音 ${message.content.duration}″]`;
    if (text) navigator.clipboard?.writeText(text).catch(() => {});
  };
  const handleDelete = () => convId && deleteMessage(convId, message.id);
  const handleRecall = () => convId && recallMessage(convId, message.id);
  const handleForward = (targetConvId) => {
    if (convId) forwardMessage(convId, message.id, targetConvId);
    setForwarding(false);
  };

  return (
    <div
      className={`bubble-row ${isMe ? 'is-me' : 'is-other'}`}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={clearLongPress}
      onTouchMove={clearLongPress}
    >
      <Avatar className="bubble-avatar" src={sender?.avatar} alt={sender?.name} size={38} radius={6} />
      <div className="bubble-body">
        {showName && <div className="bubble-sender">{sender?.name}</div>}
        <div className={`bubble-content bubble-content--${type}`}>
          {renderContent(type, content, videoOpen, setVideoOpen, isMe, message, onImageClick)}
        </div>
        <div className="bubble-time">
          {formatTime(time)}
          {isMe && <StatusTick status={status} />}
        </div>
      </div>

      {menu && (
        <MessageActionMenu
          position={menu}
          isMe={isMe}
          canRecall={canRecall}
          onCopy={handleCopy}
          onDelete={handleDelete}
          onRecall={handleRecall}
          onForward={() => { setForwarding(true); setMenu(null); }}
          onClose={() => setMenu(null)}
        />
      )}
      {forwarding && (
        <ForwardPicker onPick={handleForward} onClose={() => setForwarding(false)} />
      )}
    </div>
  );
}

function StatusTick({ status }) {
  if (status === 'sending') return <span className="bubble-status bubble-status--sending">⌛</span>;
  if (status === 'failed') return <span className="bubble-status bubble-status--failed">!</span>;
  if (status === 'read') return <span className="bubble-status bubble-status--read">✓✓</span>;
  return <span className="bubble-status bubble-status--sent">✓</span>;
}

function renderContent(type, content, videoOpen, setVideoOpen, isMe, message, onImageClick) {
  switch (type) {
    case 'text':
      return <TextContent content={content} />;
    case 'emoji':
      return <span className="bubble-emoji">{content}</span>;
    case 'image':
      return (
        <img
          className="bubble-image"
          src={content}
          alt="图片"
          onClick={() => onImageClick?.(message)}
        />
      );
    case 'voice':
      return <VoiceMessage content={content} isMe={isMe} message={message} />;
    case 'file':
      return <FileMessage content={content} />;
    case 'video':
      if (videoOpen) {
        return <video className="bubble-video" src={content} controls autoPlay />;
      }
      return (
        <div className="bubble-video-thumb" onClick={() => setVideoOpen(true)}>
          <video className="bubble-video-thumb__video" src={content} muted />
          <span className="bubble-video-thumb__play">▶</span>
        </div>
      );
    default:
      return <span>{String(content)}</span>;
  }
}

// Render text with @member mentions highlighted.
function TextContent({ content }) {
  const { activeConversation } = useChat();
  const names = activeConversation?.type === 'group'
    ? (activeConversation.memberIds || []).map((id) => users[id]?.name).filter(Boolean)
    : [];
  if (names.length === 0) {
    return <span className="bubble-text">{content}</span>;
  }
  const escaped = names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(@(?:${escaped.join('|')}))`, 'g');
  const parts = content.split(re);
  return (
    <span className="bubble-text">
      {parts.map((p, i) =>
        re.test(p) ? (
          <span key={i} className="bubble-mention">{p}</span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}

// Forward target picker: lists all conversations except the current one.
function ForwardPicker({ onPick, onClose }) {
  const { conversations, activeConversation } = useChat();
  const { t } = useI18n();
  return (
    <div className="msg-menu__mask" onClick={onClose}>
      <ul className="forward-picker" onClick={(e) => e.stopPropagation()}>
        <li className="forward-picker__title">{t.forward}</li>
        {conversations
          .filter((c) => c.id !== activeConversation?.id)
          .map((c) => (
            <li
              key={c.id}
              className="forward-picker__item"
              onClick={() => onPick(c.id)}
            >
              <Avatar src={c.avatar} alt={c.name} size={28} radius={4} />
              <span>{c.name}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
