import { useChat } from '../../context/ChatContext';
import { useI18n } from '../../i18n';
import { users } from '../../data/mockData';
import './GroupInfoDrawer.css';

export default function GroupInfoDrawer({ onClose }) {
  const { activeConversation, leaveGroup } = useChat();
  const { t } = useI18n();
  if (!activeConversation || activeConversation.type !== 'group') return null;

  const members = (activeConversation.memberIds || [])
    .map((id) => users[id])
    .filter(Boolean);

  return (
    <div className="group-info__mask" onClick={onClose}>
      <div className="group-info" onClick={(e) => e.stopPropagation()}>
        <div className="group-info__header">
          <span>{t.groupInfo}</span>
          <button className="group-info__close" onClick={onClose} type="button">×</button>
        </div>
        <div className="group-info__body">
          <div className="group-info__name">{activeConversation.name}</div>
          <div className="group-info__section-title">
            {t.groupMembers}（{members.length}）
          </div>
          <ul className="group-info__members">
            {members.map((m) => (
              <li key={m.id} className="group-info__member">
                <img className="group-info__avatar" src={m.avatar} alt={m.name} />
                <span className="group-info__member-name">{m.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="group-info__footer">
          <button
            className="group-info__leave"
            onClick={() => {
              leaveGroup(activeConversation.id);
              onClose();
            }}
            type="button"
          >
            {t.leaveGroup}
          </button>
        </div>
      </div>
    </div>
  );
}
