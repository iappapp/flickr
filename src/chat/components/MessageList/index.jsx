import { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useI18n } from '../../i18n';
import { users } from '../../data/mockData';
import { dateLabel } from '../../utils/message';
import MessageBubble from '../MessageBubble';
import ImageLightbox from '../ImageLightbox';
import './MessageList.css';

export default function MessageList() {
  const { currentUser, activeConversation, typingMap } = useChat();
  const { t } = useI18n();
  const listRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const isTyping = activeConversation ? !!typingMap[activeConversation.id] : false;

  // All image URLs in the active conversation, for lightbox navigation.
  const imageList = useMemo(
    () =>
      activeConversation
        ? activeConversation.messages
            .filter((m) => m.type === 'image')
            .map((m) => m.content)
        : [],
    [activeConversation]
  );

  const openLightbox = (message) => {
    const idx = imageList.indexOf(message.content);
    if (idx >= 0) setLightboxIndex(idx);
  };

  // Build a flat render list with date dividers inserted.
  const renderItems = useMemo(() => {
    if (!activeConversation) return [];
    const items = [];
    let lastLabel = null;
    activeConversation.messages.forEach((msg) => {
      const label = dateLabel(msg.time, t);
      if (label !== lastLabel) {
        items.push({ kind: 'divider', id: `divider_${label}`, label });
        lastLabel = label;
      }
      items.push({ kind: 'message', id: msg.id, message: msg });
    });
    return items;
  }, [activeConversation, t]);

  const scrollToBottom = (smooth = false) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };

  // Jump to bottom when switching conversation.
  useEffect(() => {
    scrollToBottom(false);
    setPendingCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?.id]);

  // Auto-scroll on new message if user is near the bottom.
  useEffect(() => {
    if (!activeConversation) return;
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) {
      scrollToBottom(false);
      setPendingCount(0);
    } else {
      setPendingCount((c) => c + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?.messages.length, isTyping]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distance > 120);
    if (distance < 40) setPendingCount(0);
  };

  if (!activeConversation) {
    return (
      <div className="message-list message-list--empty">
        {t.selectConversation}
      </div>
    );
  }

  return (
    <div className="message-list" ref={listRef} onScroll={handleScroll}>
      {renderItems.map((item) =>
        item.kind === 'divider' ? (
          <div key={item.id} className="message-divider">
            {item.label}
          </div>
        ) : (
          <MessageBubble
            key={item.id}
            message={item.message}
            sender={
              item.message.senderId === currentUser.id
                ? currentUser
                : users[item.message.senderId]
            }
            isMe={item.message.senderId === currentUser.id}
            onImageClick={openLightbox}
          />
        )
      )}
      {isTyping && (
        <div className="message-typing">
          <span className="message-typing__dot" />
          <span className="message-typing__dot" />
          <span className="message-typing__dot" />
        </div>
      )}
      {showScrollBtn && (
        <button
          className="message-scroll-btn"
          onClick={() => {
            scrollToBottom(true);
            setPendingCount(0);
          }}
          type="button"
          title={t.scrollToBottom}
        >
          ↓{pendingCount > 0 ? ` ${pendingCount}` : ''}
        </button>
      )}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={imageList}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
