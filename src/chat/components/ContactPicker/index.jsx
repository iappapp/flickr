import { useMemo, useState } from 'react';
import { users, currentUser } from '../../data/mockData';
import { useI18n } from '../../i18n';
import './ContactPicker.css';

export default function ContactPicker({ onClose, onCreateSingle, onCreateGroup }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState([]);
  const [keyword, setKeyword] = useState('');

  const contactList = useMemo(
    () => Object.values(users).filter((u) => u.id !== currentUser.id),
    []
  );

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return contactList;
    return contactList.filter((u) => u.name.toLowerCase().includes(kw));
  }, [contactList, keyword]);

  const toggle = (user) => {
    setSelected((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    if (selected.length === 1) {
      onCreateSingle(selected[0]);
    } else {
      const name = selected.map((u) => u.name).slice(0, 3).join('、') + '…';
      onCreateGroup(name, selected.map((u) => u.id));
    }
    onClose();
  };

  return (
    <div className="contact-picker__mask" onClick={onClose}>
      <div className="contact-picker" onClick={(e) => e.stopPropagation()}>
        <div className="contact-picker__header">
          <span>{t.newChat}</span>
          <button className="contact-picker__close" onClick={onClose} type="button">×</button>
        </div>
        <div className="contact-picker__search">
          <input
            type="text"
            placeholder={t.contacts}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <ul className="contact-picker__list">
          {filtered.map((u) => {
            const checked = !!selected.find((s) => s.id === u.id);
            return (
              <li
                key={u.id}
                className={`contact-picker__item ${checked ? 'is-checked' : ''}`}
                onClick={() => toggle(u)}
              >
                <img className="contact-picker__avatar" src={u.avatar} alt={u.name} />
                <span className="contact-picker__name">{u.name}</span>
                <span className="contact-picker__check">{checked ? '✓' : ''}</span>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="contact-picker__empty">{t.noContactMatch}</li>
          )}
        </ul>
        <div className="contact-picker__footer">
          <span className="contact-picker__hint">
            {selected.length === 0
              ? t.contacts
              : selected.length === 1
              ? t.newSingleHint
              : t.newGroupHint}
          </span>
          <button
            className="contact-picker__confirm"
            onClick={handleConfirm}
            disabled={selected.length === 0}
            type="button"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
