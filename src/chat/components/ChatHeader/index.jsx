import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useUi } from '../../context/UiContext';
import { useI18n } from '../../i18n';
import GroupInfoDrawer from '../GroupInfoDrawer';
import './ChatHeader.css';

export default function ChatHeader() {
  const { activeConversation, typingMap } = useChat();
  const ui = useUi();
  const { t } = useI18n();
  const [showInfo, setShowInfo] = useState(false);
  if (!activeConversation) return null;

  const memberCount =
    activeConversation.type === 'group'
      ? activeConversation.memberIds.length
      : 0;
  const isTyping = !!typingMap[activeConversation.id];
  const clickable = activeConversation.type === 'group';

  return (
    <>
      <div
        className={`chat-header ${clickable ? 'is-clickable' : ''}`}
        onClick={() => clickable && setShowInfo(true)}
      >
        <button
          className="chat-header__back"
          onClick={(e) => {
            e.stopPropagation();
            ui?.setMobileView?.('list');
          }}
          type="button"
          title={t.back}
        >
          ←
        </button>
        <span className="chat-header__name">{activeConversation.name}</span>
        {memberCount > 0 && (
          <span className="chat-header__count">（{memberCount}）</span>
        )}
        {isTyping && <span className="chat-header__typing">{t.typing}</span>}
        {clickable && <span className="chat-header__info">ⓘ</span>}
      </div>
      {showInfo && <GroupInfoDrawer onClose={() => setShowInfo(false)} />}
    </>
  );
}
