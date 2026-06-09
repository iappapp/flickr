import { useState, useEffect, useRef } from 'react';
import Button from 'antd/es/button';

function Stopwatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // 组件卸载时自动清理定时器
    return () => clearInterval(intervalRef.current);
  }, []);

  const start = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const reset = () => {
    stop();
    setTime(0);
  };

  return (
    <div>
      <p style={{marginLeft : "50px"}}>{time} 秒</p>
      <Button onClick={start} style={{marginRight: "10px"}}>开始</Button>
      <Button onClick={stop} style={{marginRight: "10px"}}>暂停</Button>
      <Button onClick={reset}>重置</Button>
    </div>
  );
}

export default Stopwatch;