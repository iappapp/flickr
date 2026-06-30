import { createContext, useContext } from 'react';

// UI-only state shared between layout pieces (mobile pane switching).
const UiContext = createContext(null);

export function UiProvider({ children, value }) {
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  return ctx; // may be undefined on desktop-only consumers
}
