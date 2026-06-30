import { useEffect, useState } from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import { UiProvider } from './context/UiContext';
import { I18nProvider, useI18n } from './i18n';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import './ChatApp.css';

const THEME_KEY = 'chat.theme';

function ChatAppInner() {
  const { activeId } = useChat();
  const { lang, setLang } = useI18n();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'light';
    } catch {
      return 'light';
    }
  });
  const [mobileView, setMobileView] = useState('list');

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    if (activeId) setMobileView('chat');
  }, [activeId]);

  const uiValue = { mobileView, setMobileView, theme, setTheme, lang, setLang };

  return (
    <UiProvider value={uiValue}>
      <div className="chat-app" data-theme={theme} data-mobile={mobileView}>
        <ConversationList />
        <ChatWindow />
      </div>
    </UiProvider>
  );
}

export default function ChatApp() {
  return (
    <I18nProvider>
      <ChatProvider>
        <ChatAppInner />
      </ChatProvider>
    </I18nProvider>
  );
}
