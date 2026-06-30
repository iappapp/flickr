import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import zh from './zh';
import en from './en';

const dictionaries = { zh, en };
const LANG_KEY = 'chat.lang';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(LANG_KEY) || 'zh';
    } catch {
      return 'zh';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const t = useMemo(() => dictionaries[lang] || zh, [lang]);

  const value = useMemo(() => ({ t, lang, setLang }), [t, lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
