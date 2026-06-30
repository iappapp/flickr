import { useEffect, useRef, useState } from 'react';
import './VoiceRecorder.css';

const MAX_RECORD_SECONDS = 60;

/**
 * Voice recorder button + recording overlay.
 * - Desktop: click to start, click again to stop and send.
 * - Mobile: touch and hold to record, release to send; slide up to cancel.
 * - Discards recordings shorter than 1 second.
 * - Auto stops and sends at MAX_RECORD_SECONDS.
 *
 * Props: onSend({ duration, url, mime })
 */
export default function VoiceRecorder({ onSend, t }) {
  const tt = t || {};
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0); // 0..1 mic volume
  const [error, setError] = useState('');
  const [willCancel, setWillCancel] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const startTimeRef = useRef(0);
  const tickTimerRef = useRef(null);
  const cancelRef = useRef(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    return () => cleanupSession(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cleanupSession = (discard) => {
    if (discard) cancelRef.current = true;
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
      analyserRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  };

  const start = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      setError(tt.micUnsupported || '当前浏览器不支持麦克风录音');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      cancelRef.current = false;

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = handleStop;
      recorder.start();
      mediaRecorderRef.current = recorder;

      // Volume meter via AnalyserNode.
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        audioContextRef.current = ctx;
        analyserRef.current = analyser;
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = Math.abs(data[i] - 128) / 128;
            sum += v;
          }
          setLevel(Math.min(1, (sum / data.length) * 4));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        /* analyser optional */
      }

      startTimeRef.current = Date.now();
      setElapsed(0);
      setRecording(true);
      setWillCancel(false);

      tickTimerRef.current = setInterval(() => {
        const sec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(sec);
        if (sec >= MAX_RECORD_SECONDS) {
          stop();
        }
      }, 250);
    } catch (err) {
      console.error(err);
      setError(tt.micDenied || '无法访问麦克风，请检查浏览器权限');
      cleanupSession(true);
      setRecording(false);
    }
  };

  const handleStop = () => {
    const duration = Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000));
    if (cancelRef.current) return;
    if (duration < 1 || chunksRef.current.length === 0) {
      setError(tt.voiceTooShort || '录音太短，已丢弃');
      setTimeout(() => setError(''), 1500);
      return;
    }
    const blob = new Blob(chunksRef.current, {
      type: chunksRef.current[0].type || 'audio/webm',
    });
    const url = URL.createObjectURL(blob);
    onSend({ duration, url, mime: blob.type });
  };

  const stop = () => {
    if (!mediaRecorderRef.current) return;
    cancelRef.current = false;
    finalize();
  };

  const cancel = () => {
    cancelRef.current = true;
    setWillCancel(false);
    finalize();
  };

  const finalize = () => {
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (analyserRef.current) analyserRef.current = null;
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== 'inactive') {
      rec.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    setRecording(false);
    setElapsed(0);
    setLevel(0);
  };

  // Desktop click-toggle.
  const handleClick = () => {
    if (recording) stop();
    else start();
  };

  // Mobile touch hold.
  const handleTouchStart = (e) => {
    e.preventDefault();
    touchStartYRef.current = e.touches[0].clientY;
    start();
  };
  const handleTouchMove = (e) => {
    if (!recording) return;
    const dy = touchStartYRef.current - e.touches[0].clientY;
    setWillCancel(dy > 60);
  };
  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (willCancel) cancel();
    else stop();
  };

  const remaining = Math.max(0, MAX_RECORD_SECONDS - elapsed);

  return (
    <>
      {error && <div className="voice-recorder__error">{error}</div>}
      {recording && (
        <div className={`voice-recorder__bar ${willCancel ? 'is-cancel' : ''}`}>
          <div className="voice-recorder__wave">
            <span
              className="voice-recorder__wave-fill"
              style={{ transform: `scaleY(${0.2 + level * 0.9})` }}
            />
          </div>
          <span className="voice-recorder__text">
            {willCancel
              ? (tt.voiceCancel || '松开手指取消发送')
              : `${tt.recording || '正在录音'} ${elapsed}″ ${remaining <= 5 ? `· ${tt.remaining || '剩余'} ${remaining}s` : ''}`}
          </span>
          <button
            className="voice-recorder__cancel"
            onClick={cancel}
            type="button"
          >
            {tt.cancel || '取消'}
          </button>
        </div>
      )}
      <button
        className={`voice-recorder__btn ${recording ? 'is-recording' : ''}`}
        onClick={handleClick}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        disabled={recording}
        title={tt.voice || '点击录音（桌面） / 按住说话（移动）'}
        type="button"
      >
        {recording ? `${elapsed}″ ${tt.voiceRecording || '录音中'}` : `🎤 ${tt.voice || '按住说话'}`}
      </button>
    </>
  );
}
