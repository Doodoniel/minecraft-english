import { useState, useEffect } from 'react';
import { sfx } from '../utils/sfx';

// Shared header: back button (left), title, extra content + fullscreen toggle (right).
export default function TopBar({ title, onBack, right }) {
  const [fs, setFs] = useState(() => !!document.fullscreenElement);

  useEffect(() => {
    const onChange = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFs = () => {
    sfx.click();
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  return (
    <header className="topbar">
      {onBack ? (
        <button className="mc-btn small" onClick={() => { sfx.click(); onBack(); }}>
          ◀ BACK
        </button>
      ) : (
        <span className="topbar-spacer" />
      )}
      <h2 className="topbar-title">{title}</h2>
      <div className="topbar-right">
        {right}
        <button className="mc-btn small" onClick={toggleFs} title="Fullscreen">
          {fs ? '🗗' : '⛶'}
        </button>
      </div>
    </header>
  );
}
