import { useI18n } from '../../i18n';
import './MessageActionMenu.css';

/**
 * Context menu for a message bubble.
 * Props:
 *  - position: { x, y }
 *  - isMe, canRecall (within 2 min)
 *  - onCopy, onDelete, onRecall, onForward
 *  - onClose
 */
export default function MessageActionMenu({ position, isMe, canRecall, onCopy, onDelete, onRecall, onForward, onClose }) {
  const { t } = useI18n();
  const items = [
    { key: 'copy', label: t.copy, onClick: onCopy },
    { key: 'forward', label: t.forward, onClick: onForward },
  ];
  if (isMe && canRecall) {
    items.push({ key: 'recall', label: t.recall, onClick: onRecall });
  }
  items.push({ key: 'delete', label: t.delete, onClick: onDelete, danger: true });

  return (
    <div className="msg-menu__mask" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }}>
      <ul
        className="msg-menu"
        style={{ left: position.x, top: position.y }}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((it) => (
          <li
            key={it.key}
            className={`msg-menu__item ${it.danger ? 'is-danger' : ''}`}
            onClick={() => { it.onClick?.(); onClose(); }}
          >
            {it.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
