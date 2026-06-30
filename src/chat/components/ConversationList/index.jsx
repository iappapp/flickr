import { useMemo, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useUi } from '../../context/UiContext';
import { useI18n } from '../../i18n';
import { formatTime, lastMessageText } from '../../utils/message';
import ContactPicker from '../ContactPicker';
import './ConversationList.css';

export default function ConversationList() {
  const {
    conversations,
    activeId,
    selectConversation,
    findOrCreateSingleChat,
    createGroup,
  } = useChat();
  const ui = useUi();
  const { t } = useI18n();
  const [keyword, setKeyword] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unread || 0), 0),
    [conversations]
  );

  // Sort by latest message time desc.
  const sorted = useMemo(
    () =>
      [...conversations].sort((a, b) => {
        const aLast = a.messages.length ? a.messages[a.messages.length - 1].time : 0;
        const bLast = b.messages.length ? b.messages[b.messages.length - 1].time : 0;
        return bLast - aLast;
      }),
    [conversations]
  );

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return sorted;
    return sorted.filter((conv) => {
      const last = conv.messages[conv.messages.length - 1];
      return (
        conv.name.toLowerCase().includes(kw) ||
        (last && lastMessageText(last).toLowerCase().includes(kw))
      );
    });
  }, [sorted, keyword]);

  const handleItemKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectConversation(id);
    }
  };

  return (
    <div className="conversation-list">
      <div className="conversation-list__header">
        <span className="conversation-list__title">{t.appTitle}</span>
        {totalUnread > 0 && (
          <span className="conversation-list__total-unread">
            {totalUnread > 99 ? '99+' : totalUnread} {t.unreadCount}
          </span>
        )}
        <div className="conversation-list__actions">
          <button
            className="conversation-list__add"
            onClick={() => setShowPicker(true)}
            title={t.newChat}
            type="button"
          >
            +
          </button>
          <button
            className="conversation-list__icon-btn"
            onClick={() => ui?.setTheme?.(ui.theme === 'light' ? 'dark' : 'light')}
            title={ui?.theme === 'light' ? t.themeDark : t.themeLight}
            type="button"
          >
            {ui?.theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className="conversation-list__icon-btn"
            onClick={() => ui?.setLang?.(ui.lang === 'zh' ? 'en' : 'zh')}
            title={ui?.lang === 'zh' ? t.langEn : t.langZh}
            type="button"
          >
            {ui?.lang === 'zh' ? 'EN' : '中'}
          </button>
        </div>
        {showPicker && (
          <ContactPicker
            onClose={() => setShowPicker(false)}
            onCreateSingle={(user) => findOrCreateSingleChat(user)}
            onCreateGroup={(name, ids) => createGroup(name, ids)}
          />
        )}
      </div>
      <div className="conversation-list__search">
        <input
          type="text"
          placeholder={t.search}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <ul className="conversation-list__items">
        {filtered.length === 0 && (
          <li className="conversation-list__empty">{t.noMatch}</li>
        )}
        {filtered.map((conv) => {
          const last = conv.messages[conv.messages.length - 1];
          const isActive = conv.id === activeId;
          return (
            <li
              key={conv.id}
              className={`conversation-item ${isActive ? 'is-active' : ''}`}
              onClick={() => selectConversation(conv.id)}
              onKeyDown={(e) => handleItemKeyDown(e, conv.id)}
              tabIndex={0}
              role="button"
              aria-label={`会话 ${conv.name}`}
            >
              <div className="conversation-item__avatar-wrap">
                <img
                  className="conversation-item__avatar"
                  src={conv.avatar}
                  alt={conv.name}
                />
                {conv.type === 'group' && (
                  <span className="conversation-item__tag">群</span>
                )}
                {conv.unread > 0 && (
                  <span className="conversation-item__badge">
                    {conv.unread > 99 ? '99+' : conv.unread}
                  </span>
                )}
              </div>
              <div className="conversation-item__main">
                <div className="conversation-item__row">
                  <span className="conversation-item__name">{conv.name}</span>
                  <span className="conversation-item__time">
                    {last ? formatTime(last.time) : ''}
                  </span>
                </div>
                <div className="conversation-item__row conversation-item__row--bottom">
                  <span className="conversation-item__preview">
                    {lastMessageText(last)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
