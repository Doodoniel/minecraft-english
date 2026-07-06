import { useState, useEffect } from 'react';

// Shows public/assets/images/<word>.png, or the emoji if the picture is missing.
export default function WordImage({ word }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [word.word]);

  return (
    <div className="visual">
      {failed ? (
        <span className="emoji" role="img" aria-label={word.word}>{word.emoji}</span>
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
