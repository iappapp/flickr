// Mock data for the WeChat-like chat application.
// Avatars use a placeholder avatar service (DiceBear) so each user has a unique image.

const now = Date.now();
const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

const avatar = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

export const currentUser = {
  id: 'u_me',
  name: '我',
  avatar: avatar('Me-WeChat'),
};

export const users = {
  u_me: { id: 'u_me', name: '我', avatar: avatar('Me-WeChat') },
  u_alice: { id: 'u_alice', name: 'Alice', avatar: avatar('Alice') },
  u_bob: { id: 'u_bob', name: 'Bob 伯恩', avatar: avatar('Bob') },
  u_carol: { id: 'u_carol', name: 'Carol 小卡', avatar: avatar('Carol') },
  u_david: { id: 'u_david', name: 'David 大卫', avatar: avatar('David') },
  u_eve: { id: 'u_eve', name: 'Eve', avatar: avatar('Eve') },
  u_frank: { id: 'u_frank', name: 'Frank 法兰克', avatar: avatar('Frank') },
};

// message types: text | image | voice | video | emoji | system
export const initialConversations = [
  {
    id: 'c_alice',
    type: 'single', // 1v1
    memberId: 'u_alice',
    name: 'Alice',
    avatar: avatar('Alice'),
    unread: 0,
    messages: [
      {
        id: 'm1',
        senderId: 'u_alice',
        type: 'text',
        content: '嘿，最近怎么样？',
        time: now - 2 * day,
      },
      {
        id: 'm2',
        senderId: 'u_me',
        type: 'text',
        content: '挺好的，在做一个聊天应用demo 😄',
        time: now - 2 * day + 5 * minute,
      },
      {
        id: 'm3',
        senderId: 'u_alice',
        type: 'emoji',
        content: '👍',
        time: now - 2 * day + 6 * minute,
      },
      {
        id: 'm4',
        senderId: 'u_alice',
        type: 'image',
        content:
          'https://images.unsplash.com/photo-1518791841217-8f7fdeb2dab8?w=400&h=300&fit=crop',
        time: now - 1 * day,
      },
      {
        id: 'm5',
        senderId: 'u_me',
        type: 'text',
        content: '这只猫好可爱！',
        time: now - 1 * day + 2 * minute,
      },
      {
        id: 'm6',
        senderId: 'u_alice',
        type: 'voice',
        content: { duration: 8 },
        time: now - 30 * minute,
      },
      {
        id: 'm7',
        senderId: 'u_alice',
        type: 'text',
        content: '听听我刚才发的语音～',
        time: now - 29 * minute,
      },
    ],
  },
  {
    id: 'c_group_dev',
    type: 'group', // 1v多
    name: '前端开发小组',
    avatar: avatar('Frontend-Group'),
    memberIds: ['u_me', 'u_bob', 'u_carol', 'u_david'],
    unread: 3,
    messages: [
      {
        id: 'g1',
        senderId: 'u_bob',
        type: 'text',
        content: '大家明天的需求评审几点？',
        time: now - 5 * hour,
      },
      {
        id: 'g2',
        senderId: 'u_carol',
        type: 'text',
        content: '上午10点，会议室A',
        time: now - 5 * hour + minute,
      },
      {
        id: 'g3',
        senderId: 'u_david',
        type: 'video',
        content:
          'https://www.w3schools.com/html/mov_bbb.mp4',
        time: now - 4 * hour,
      },
      {
        id: 'g4',
        senderId: 'u_david',
        type: 'text',
        content: '这是个 demo 视频，参考一下交互',
        time: now - 4 * hour + minute,
      },
      {
        id: 'g5',
        senderId: 'u_bob',
        type: 'emoji',
        content: '🎉',
        time: now - 10 * minute,
      },
    ],
  },
  {
    id: 'c_bob',
    type: 'single',
    memberId: 'u_bob',
    name: 'Bob 伯恩',
    avatar: avatar('Bob'),
    unread: 1,
    messages: [
      {
        id: 'b1',
        senderId: 'u_bob',
        type: 'text',
        content: '兄弟，周末有空一起打球吗？',
        time: now - 3 * hour,
      },
    ],
  },
  {
    id: 'c_group_friends',
    type: 'group',
    name: '老友记',
    avatar: avatar('Old-Friends'),
    memberIds: ['u_me', 'u_eve', 'u_frank', 'u_alice'],
    unread: 0,
    messages: [
      {
        id: 'f1',
        senderId: 'u_eve',
        type: 'text',
        content: '下周聚餐定在周五可以吗？',
        time: now - 6 * hour,
      },
      {
        id: 'f2',
        senderId: 'u_frank',
        type: 'text',
        content: '周五OK ✅',
        time: now - 6 * hour + 2 * minute,
      },
      {
        id: 'f3',
        senderId: 'u_me',
        type: 'emoji',
        content: '🥳',
        time: now - 6 * hour + 3 * minute,
      },
    ],
  },
  {
    id: 'c_carol',
    type: 'single',
    memberId: 'u_carol',
    name: 'Carol 小卡',
    avatar: avatar('Carol'),
    unread: 0,
    messages: [
      {
        id: 'c1',
        senderId: 'u_carol',
        type: 'text',
        content: '设计稿已经发你邮箱了～',
        time: now - 1 * day,
      },
      {
        id: 'c2',
        senderId: 'u_me',
        type: 'text',
        content: '收到，谢谢！',
        time: now - 1 * day + minute,
      },
    ],
  },
];

// Ensure every historical message has a read status (own messages show ticks).
initialConversations.forEach((c) =>
  c.messages.forEach((m) => {
    if (!m.status) m.status = 'read';
  })
);

// Emoji set used by the EmojiPicker, grouped by category.
export const emojiCategories = [
  {
    key: 'smileys',
    label: '表情',
    emojis: [
      '😀','😁','😂','🤣','😃','😄','😅','😆',
      '😉','😊','😋','😎','😍','😘','🥰','😗',
      '🙂','🤗','🤩','🤔','🤨','😐','😑','😶',
      '🙄','😏','😣','😥','😮','🤐','😯','😪',
      '😫','🥱','😴','😌','😛','😜','🤪','😝',
      '🤤','😒','😓','😔','😕','🙃','🤑','😲',
      '☹️','🙁','😖','😞','😟','😤','😢','😭',
      '😦','😧','😨','😩','🤯','😬','😰','😱',
      '🥵','🥶','😳','😇','🤠','🤡','🥳','🥺',
      '🤭','🤫',
    ],
  },
  {
    key: 'gestures',
    label: '手势',
    emojis: [
      '👍','👎','👌','✌️','🤞','🤟','🤘','🤙',
      '👈','👉','👆','👇','☝️','✋','🤚','🖐️',
      '🖖','👋','🤝','💪','🙏','👏','🙌','👐',
    ],
  },
  {
    key: 'animals',
    label: '动物',
    emojis: [
      '🐱','🐶','🐼','🐨','🦊','🐰','🐻','🐯',
      '🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦',
      '🦄','🐴','🦓','🐔','🐠','🐬','🦋','🐝',
    ],
  },
  {
    key: 'food',
    label: '食物',
    emojis: [
      '🍎','🍊','🍌','🍉','🍇','🍓','🍒','🍑',
      '🥭','🍍','🥥','🥝','🍅','🥑','🍆','🥕',
      '🌽','🌶️','🍔','🍟','🍕','🌭','🍿','🍰',
      '🎂','🍫','🍬','🍭','🍩','🍪','☕','🍵',
    ],
  },
  {
    key: 'activities',
    label: '活动',
    emojis: [
      '🎉','🎊','🎈','🎁','🎂','🎀','🏆','🏅',
      '⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱',
      '🎮','🎲','🎵','🎶','🎸','🎹','🎤','🎧',
    ],
  },
  {
    key: 'symbols',
    label: '符号',
    emojis: [
      '❤️','🧡','💛','💚','💙','💜','🖤','🤍',
      '🤎','💔','❣️','💕','💞','💓','✨','💫',
      '⭐','🌟','🔥','💯','✅','❌','⚠️','🔔',
    ],
  },
];

// Flat list kept for backwards compatibility.
export const emojiList = emojiCategories.flatMap((c) => c.emojis);
