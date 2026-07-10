import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { currentUser, initialConversations } from '../data/mockData';
import { loadState, saveState } from '../storage/persistence';

const ChatContext = createContext(null);

const newId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const REPLY_TEXTS = [
  '好的，收到～',
  '哈哈哈 😆',
  '我知道了',
  '稍后回你',
  '嗯嗯',
  '没问题！',
  '收到收到',
  '安排上了',
];

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  const [typingMap, setTypingMap] = useState({}); // convId -> boolean
  const [playingId, setPlayingId] = useState(null); // current playing voice message id
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage + IndexedDB on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await loadState();
      if (!cancelled && loaded && loaded.length) {
        setConversations(loaded);
        setActiveId(loaded[0].id);
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on change (debounced), only after hydration to avoid
  // overwriting stored state with the seed before load completes.
  const saveTimerRef = useRef(null);
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveState(conversations);
    }, 500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [conversations, hydrated]);

  // Keep a ref of activeId so sendMessage can be a stable callback.
  const activeIdRef = useRef(activeId);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  const selectConversation = useCallback((id) => {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }, []);

  // Patch a single message inside a conversation (stable, functional update).
  const patchMessage = useCallback((convId, msgId, patch) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === msgId ? { ...m, ...patch } : m
              ),
            }
          : c
      )
    );
  }, []);

  const setTyping = useCallback((convId, value) => {
    setTypingMap((prev) => (prev[convId] === value ? prev : { ...prev, [convId]: value }));
  }, []);

  // Pick a sender id for an auto-reply (single -> memberId; group -> random other member).
  const pickReplySender = useCallback((conv) => {
    if (conv.type === 'single') return conv.memberId;
    const others = (conv.memberIds || []).filter((id) => id !== currentUser.id);
    if (others.length === 0) return null;
    return others[Math.floor(Math.random() * others.length)];
  }, []);

  // Keep a ref of conversations so async callbacks can read the latest state
  // without putting side effects inside state updaters (StrictMode-safe).
  const conversationsRef = useRef(conversations);
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Simulate the other side typing then replying. Stable, no side effects in
  // state updaters.
  const simulateReply = useCallback(
    (convId, customText) => {
      const conv = conversationsRef.current.find((c) => c.id === convId);
      if (!conv) return;
      const senderId = pickReplySender(conv);
      if (!senderId) return;

      setTyping(convId, true);
      setTimeout(() => {
        setTyping(convId, false);
        const text =
          customText || REPLY_TEXTS[Math.floor(Math.random() * REPLY_TEXTS.length)];
        const reply = {
          id: newId('m'),
          senderId,
          type: 'text',
          content: text,
          time: Date.now(),
          status: 'read',
        };
        setConversations((p) =>
          p.map((c) =>
            c.id === convId ? { ...c, messages: [...c.messages, reply] } : c
          )
        );
      }, 1400);
    },
    [pickReplySender, setTyping]
  );

  // Send a message into the active conversation (or an explicit convId).
  const sendMessage = useCallback(
    (rawMessage, convIdArg) => {
      const convId = convIdArg || activeIdRef.current;
      if (!convId) return;
      const msg = {
        id: newId('m'),
        senderId: currentUser.id,
        time: Date.now(),
        status: 'sending',
        ...rawMessage,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, msg] } : c
        )
      );

      // Lifecycle: sending -> sent -> read.
      setTimeout(() => patchMessage(convId, msg.id, { status: 'sent' }), 120);
      const conv = conversationsRef.current.find((c) => c.id === convId);
      const isSingle = conv && conv.type === 'single';
      setTimeout(() => patchMessage(convId, msg.id, { status: 'read' }), isSingle ? 1400 : 2500);

      // Trigger an auto reply (typing + reply) for both single and group.
      simulateReply(convId);
    },
    [patchMessage, simulateReply]
  );

  const markRead = useCallback((id) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }, []);

  // ---- Message actions (Phase 4) ----
  const deleteMessage = useCallback((convId, msgId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: c.messages.filter((m) => m.id !== msgId) }
          : c
      )
    );
  }, []);

  const recallMessage = useCallback((convId, msgId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === msgId
                  ? { ...m, type: 'system', content: '该消息已撤回', recalled: true }
                  : m
              ),
            }
          : c
      )
    );
  }, []);

  const forwardMessage = useCallback((convId, msgId, targetConvId) => {
    const src = conversationsRef.current.find((c) => c.id === convId);
    const msg = src?.messages.find((m) => m.id === msgId);
    if (!msg) return;
    const forwarded = {
      ...msg,
      id: newId('m'),
      senderId: currentUser.id,
      time: Date.now(),
      status: 'read',
      forwarded: true,
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetConvId
          ? { ...c, messages: [...c.messages, forwarded] }
          : c
      )
    );
    setActiveId(targetConvId);
  }, []);

  // ---- Conversation management (Phase 3) ----
  const addConversation = useCallback((conv) => {
    setConversations((prev) => {
      const exists = prev.find((c) => c.id === conv.id);
      if (exists) return prev;
      return [conv, ...prev];
    });
    setActiveId(conv.id);
  }, []);

  const removeConversation = useCallback((id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

  const updateConversation = useCallback((id, patch) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }, []);

  // Find an existing single chat with a user, or create a new one.
  const findOrCreateSingleChat = useCallback((user) => {
    const existing = conversationsRef.current.find(
      (c) => c.type === 'single' && c.memberId === user.id
    );
    if (existing) {
      setActiveId(existing.id);
      return existing;
    }
    const conv = {
      id: `c_${user.id}_${Date.now()}`,
      type: 'single',
      memberId: user.id,
      name: user.name,
      avatar: user.avatar,
      unread: 0,
      messages: [],
    };
    addConversation(conv);
    return conv;
  }, [addConversation]);

  // Create a new group chat with the given name and member ids (currentUser
  // is always included).
  const createGroup = useCallback((name, memberIds) => {
    const ids = Array.from(new Set([currentUser.id, ...memberIds]));
    const conv = {
      id: `c_group_${Date.now()}`,
      type: 'group',
      name: name || '新群聊',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'Group' + Date.now())}`,
      memberIds: ids,
      unread: 0,
      messages: [],
    };
    addConversation(conv);
    return conv;
  }, [addConversation]);

  // Leave a group: remove self from members, or delete the conversation.
  const leaveGroup = useCallback((convId) => {
    setConversations((prev) =>
      prev
        .map((c) => {
          if (c.id !== convId) return c;
          const memberIds = (c.memberIds || []).filter((id) => id !== currentUser.id);
          return { ...c, memberIds };
        })
        .filter((c) => !(c.id === convId && c.memberIds.length <= 1))
    );
    setActiveId((cur) => (cur === convId ? null : cur));
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      conversations,
      activeConversation,
      activeId,
      typingMap,
      playingId,
      selectConversation,
      sendMessage,
      simulateReply,
      markRead,
      setTyping,
      setPlayingId,
      addConversation,
      removeConversation,
      updateConversation,
      findOrCreateSingleChat,
      createGroup,
      leaveGroup,
      deleteMessage,
      recallMessage,
      forwardMessage,
    }),
    [
      conversations,
      activeConversation,
      activeId,
      typingMap,
      playingId,
      selectConversation,
      sendMessage,
      simulateReply,
      markRead,
      setTyping,
      setPlayingId,
      addConversation,
      removeConversation,
      updateConversation,
      findOrCreateSingleChat,
      createGroup,
      leaveGroup,
      deleteMessage,
      recallMessage,
      forwardMessage,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
