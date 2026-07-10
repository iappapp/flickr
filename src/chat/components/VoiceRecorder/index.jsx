import { useEffect, useRef, useState } from 'react';
import './VoiceRecorder.css';

const MAX_RECORD_SECONDS = 60;
const TAP_THRESHOLD = 180; // ms: shorter press => click-toggle (desktop/keyboard)
const CANCEL_SLIDE = 60; // px: slide up distance to cancel (touch)

// Pick the first MIME type the browser can actually record.
const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg',
];
function pickMime() {
  if (typeof window.MediaRecorder === 'undefined') return '';
  for (const m of MIME_CANDIDATES) {
    if (window.MediaRecorder.isTypeSupported(m)) return m;
  }
  return '';
}

function vibrate(pattern) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}

/**
 * Voice recorder with a WeChat-style overlay.
 *
 * Interaction:
 *  - Desktop: press and hold to record, release to stop; or a quick click
 *    toggles start/stop. Move away while holding cancels. Esc cancels.
 *  - Mobile: press and hold to record, slide up to cancel, release to send.
 *  - Keyboard: Space/Enter toggles start/stop, Esc cancels.
 *
 * After recording stops, a preview (play / re-record / send / cancel) is
 * shown unless the `preview` prop is false (then it sends immediately).
 *
 * Props: onSend({ duration, url, mime }), t, preview = true
 */
export default function VoiceRecorder({ onSend, t, preview = true }) {
  const tt = t || {};
  const [phase, setPhase] = useState('idle'); // idle | recording | preview
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState('');
  const [willCancel, setWillCancel] = useState(false);
  const [previewData, setPreviewData] = useState(null); // { url, duration, mime }
  const [previewPlaying, setPreviewPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const startTimeRef = useRef(0);
  const tickTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const cancelRef = useRef(false);

  // Interaction bookkeeping.
  const pressStartRef = useRef(0);
  const holdingRef = useRef(false);
  const toggleModeRef = useRef(false);
  const willCancelRef = useRef(false);
  const touchStartYRef = useRef(0);
  const previewAudioRef = useRef(null);

  // Revoke any pending preview object URL on unmount.
  useEffect(() => {
    return () => {
      cleanupSession(true);
      if (previewData) URL.revokeObjectURL(previewData.url);
    };
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
      streamRef.current.getTracks().forEach((tr) => tr.stop());
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
      // If the user released before permission resolved, abort cleanly.
      if (!holdingRef.current && !toggleModeRef.current) {
        stream.getTracks().forEach((tr) => tr.stop());
        return;
      }
      streamRef.current = stream;
      chunksRef.current = [];
      cancelRef.current = false;
      willCancelRef.current = false;
      setWillCancel(false);

      const mime = pickMime();
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = handleStop;
      recorder.start(1000); // 1s timeslice for safer long recordings
      mediaRecorderRef.current = recorder;

      // Volume meter via AnalyserNode (resume in case it starts suspended).
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
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
            sum += Math.abs(data[i] - 128) / 128;
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
      setPhase('recording');
      vibrate(10);

      tickTimerRef.current = setInterval(() => {
        const sec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(sec);
        if (sec >= MAX_RECORD_SECONDS) {
          doStop();
        }
      }, 200);
    } catch (err) {
      console.error(err);
      setError(tt.micDenied || '无法访问麦克风，请检查浏览器权限');
      cleanupSession(true);
      setPhase('idle');
    }
  };

  const handleStop = () => {
    if (cancelRef.current) {
      setPhase('idle');
      setElapsed(0);
      setLevel(0);
      return;
    }
    const duration = Math.max(0, Math.round((Date.now() - startTimeRef.current) / 1000));
    if (duration < 1 || chunksRef.current.length === 0) {
      setError(tt.voiceTooShort || '录音太短，已丢弃');
      setTimeout(() => setError(''), 1500);
      setPhase('idle');
      setElapsed(0);
      setLevel(0);
      return;
    }
    const blob = new Blob(chunksRef.current, {
      type: chunksRef.current[0].type || 'audio/webm',
    });
    const url = URL.createObjectURL(blob);
    if (preview) {
      setPreviewData({ url, duration, mime: blob.type });
      setPhase('preview');
    } else {
      onSend({ duration, url, mime: blob.type });
      setPhase('idle');
    }
    setElapsed(0);
    setLevel(0);
  };

  const doStop = () => {
    const rec = mediaRecorderRef.current;
    if (!rec || rec.state === 'inactive') return;
    cancelRef.current = false;
    finalize();
  };

  const doCancel = () => {
    cancelRef.current = true;
    willCancelRef.current = false;
    setWillCancel(false);
    vibrate([10, 30, 10]);
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
    if (rec && rec.state !== 'inactive') rec.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  };

  // ---- Preview actions ----
  const sendPreview = () => {
    if (!previewData) return;
    onSend({ duration: previewData.duration, url: previewData.url, mime: previewData.mime });
    setPreviewData(null);
    setPhase('idle');
  };

  const discardPreview = () => {
    if (previewData) URL.revokeObjectURL(previewData.url);
    setPreviewData(null);
    setPhase('idle');
  };

  const rerecord = async () => {
    if (previewData) URL.revokeObjectURL(previewData.url);
    setPreviewData(null);
    setPreviewPlaying(false);
    toggleModeRef.current = false;
    holdingRef.current = true;
    await start();
  };

  const togglePreviewPlay = () => {
    const audio = previewAudioRef.current;
    if (!audio) return;
    if (previewPlaying) audio.pause();
    else audio.play().catch(() => {});
  };

  // ---- Pointer / key handlers ----
  const onMouseDown = (e) => {
    e.preventDefault();
    if (phase === 'recording') {
      // Second click in toggle mode stops.
      if (toggleModeRef.current) doStop();
      return;
    }
    if (phase !== 'idle') return;
    pressStartRef.current = Date.now();
    holdingRef.current = true;
    toggleModeRef.current = false;
    start();
  };

  const onMouseUp = () => {
    if (!holdingRef.current) return;
    const dt = Date.now() - pressStartRef.current;
    holdingRef.current = false;
    if (dt < TAP_THRESHOLD) {
      // Quick click -> toggle mode: keep recording, wait for next click.
      toggleModeRef.current = true;
    } else {
      doStop();
    }
  };

  const onMouseLeave = () => {
    if (holdingRef.current) {
      // Moved off while holding -> cancel.
      holdingRef.current = false;
      toggleModeRef.current = false;
      doCancel();
    }
  };

  const onTouchStart = (e) => {
    e.preventDefault();
    if (phase !== 'idle') return;
    touchStartYRef.current = e.touches[0].clientY;
    holdingRef.current = true;
    toggleModeRef.current = false;
    start();
  };

  const onTouchMove = (e) => {
    if (phase !== 'recording') return;
    const dy = touchStartYRef.current - e.touches[0].clientY;
    const next = dy > CANCEL_SLIDE;
    if (next !== willCancelRef.current) {
      willCancelRef.current = next;
      setWillCancel(next);
    }
  };

  const onTouchEnd = (e) => {
    e.preventDefault();
    if (!holdingRef.current) return;
    holdingRef.current = false;
    if (willCancelRef.current) doCancel();
    else doStop();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (phase === 'recording') doCancel();
      else if (phase === 'preview') discardPreview();
      return;
    }
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      if (phase === 'idle') {
        toggleModeRef.current = true; // keyboard uses toggle
        start();
      } else if (phase === 'recording') {
        doStop();
      }
    }
  };

  const remaining = Math.max(0, MAX_RECORD_SECONDS - elapsed);
  const urgent = remaining <= 5 && phase === 'recording';

  const fmt = (sec) => `0:${String(sec).padStart(2, '0')}`;

  return (
    <>
      {error && (
        <div className="voice-recorder__error">
          <span>{error}</span>
          <button
            className="voice-recorder__retry"
            onClick={() => { setError(''); holdingRef.current = true; start(); }}
            type="button"
          >
            {tt.retry || '重试'}
          </button>
        </div>
      )}

      {phase === 'recording' && (
        <div
          className={`voice-overlay ${willCancel ? 'is-cancel' : ''} ${urgent ? 'is-urgent' : ''}`}
        >
          <div className="voice-overlay__center">
            <div
              className="voice-overlay__mic"
              style={{ transform: `scale(${1 + level * 0.5})` }}
            >
              🎤
            </div>
            <div className="voice-overlay__time">{fmt(elapsed)}</div>
            <div className="voice-overlay__bars">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="voice-overlay__bar"
                  style={{ transform: `scaleY(${0.2 + level * (0.6 + i * 0.1)})` }}
                />
              ))}
            </div>
          </div>
          <div className={`voice-overlay__cancel-zone ${willCancel ? 'is-active' : ''}`}>
            {willCancel ? (tt.releaseToCancel || '松开取消') : (tt.slideUpCancel || '上滑取消')}
          </div>
        </div>
      )}

      {phase === 'preview' && previewData && (
        <div className="voice-preview">
          <audio
            ref={previewAudioRef}
            src={previewData.url}
            onPlay={() => setPreviewPlaying(true)}
            onPause={() => setPreviewPlaying(false)}
            onEnded={() => setPreviewPlaying(false)}
            preload="metadata"
          />
          <button
            className="voice-preview__play"
            onClick={togglePreviewPlay}
            type="button"
            title={tt.voicePreview || '试听'}
          >
            {previewPlaying ? '⏸' : '▶'}
          </button>
          <span className="voice-preview__duration">
            {previewData.duration}{tt.seconds || '″'}
          </span>
          <button className="voice-preview__btn" onClick={rerecord} type="button">
            {tt.rerecord || '重录'}
          </button>
          <button className="voice-preview__btn" onClick={discardPreview} type="button">
            {tt.cancelLabel || '取消'}
          </button>
          <button className="voice-preview__send" onClick={sendPreview} type="button">
            {tt.send || '发送'}
          </button>
        </div>
      )}

      <button
        className={`voice-recorder__btn ${phase === 'recording' ? 'is-recording' : ''}`}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onKeyDown={onKeyDown}
        tabIndex={0}
        title={tt.pressToTalk || '按住说话'}
        type="button"
      >
        {phase === 'recording'
          ? `🔴 ${tt.recordingLabel || '录音中'} ${fmt(elapsed)}`
          : `🎤 ${tt.pressToTalk || '按住说话'}`}
      </button>
    </>
  );
}
