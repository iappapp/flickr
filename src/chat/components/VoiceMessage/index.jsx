import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import './VoiceMessage.css';

export default function VoiceMessage({ content, isMe, message }) {
  const { playingId, setPlayingId } = useChat();
  const data = typeof content === 'object' ? content : { duration: content };
  const { url, duration } = data;
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 ~ 1

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;
    const onTime = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
      setPlayingId(null);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [url, setPlayingId]);

  // Pause when another voice message starts playing.
  useEffect(() => {
    if (playingId && playingId !== message.id && playing) {
      audioRef.current?.pause();
    }
  }, [playingId, message.id, playing]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !url) return;
    if (playing) {
      audio.pause();
      setPlayingId(null);
    } else {
      setPlayingId(message.id);
      audio.play().catch((err) => console.warn('播放失败', err));
    }
  };

  // Voice bubble grows with duration a bit, like WeChat.
  const width = Math.min(220, 70 + (duration || 1) * 6);

  return (
    <div
      className={`bubble-voice ${isMe ? 'is-me' : ''} ${!url ? 'is-disabled' : ''}`}
      style={{ width }}
      onClick={toggle}
      title={url ? '点击播放' : '暂无音频'}
    >
      <audio ref={audioRef} src={url} preload="metadata" />
      {isMe ? (
        <>
          <span className="bubble-voice__duration">{duration}″</span>
          <span className="bubble-voice__icon">{playing ? '⏸' : '🎤'}</span>
        </>
      ) : (
        <>
          <span className="bubble-voice__icon">{playing ? '⏸' : '🎤'}</span>
          <span className="bubble-voice__duration">{duration}″</span>
        </>
      )}
      <span className="bubble-voice__bar">
        <span
          className="bubble-voice__bar-fill"
          style={{ width: `${progress * 100}%` }}
        />
      </span>
    </div>
  );
}
