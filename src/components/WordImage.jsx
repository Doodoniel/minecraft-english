import { useState, useEffect, useRef } from 'react';

// Draws the emoji on a mid-res offscreen canvas, then scales it up with
// smoothing disabled — adds a subtle blocky edge without losing clarity.
function PixelEmoji({ emoji, label }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const SAMPLE = 84; // lower = blockier, higher = sharper
    const off = document.createElement('canvas');
    off.width = off.height = SAMPLE;
    const octx = off.getContext('2d');
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.font = `${SAMPLE - 10}px 'Segoe UI Emoji', 'Apple Color Emoji', serif`;
    octx.fillText(emoji, SAMPLE / 2, SAMPLE / 2 + 3);

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
  }, [emoji]);

  return (
    <canvas
      ref={ref}
      width={420}
      height={420}
      className="pixel-emoji"
      role="img"
      aria-label={label}
    />
  );
}

// Shows public/assets/images/<word>.png, or lightly pixelated emoji if the picture is missing.
export default function WordImage({ word }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [word.word]);

  return (
    <div className="visual">
      {failed ? (
        <PixelEmoji emoji={word.emoji} label={word.word} />
      ) : (
        <img
          src={`${import.meta.env.BASE_URL}assets/images/${word.word}.png`}
          alt={word.word}
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
