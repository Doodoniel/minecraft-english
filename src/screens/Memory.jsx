import { useState, useEffect, useRef } from 'react';
import TopBar from '../components/TopBar';
import WordImage from '../components/WordImage';
import { getWords, shuffle } from '../data/words';
import { speak } from '../utils/speech';
import { sfx } from '../utils/sfx';
import { burst } from '../utils/burst';

const PAIRS = 6;

function buildCards(category) {
  const words = shuffle(getWords(category)).slice(0, PAIRS);
  return shuffle(
    words.flatMap(w => [
      { key: `${w.word}-img`, w, type: 'img' },
      { key: `${w.word}-txt`, w, type: 'txt' },
    ])
  );
}

// Classic memory: match each picture with its word.
export default function Memory({ category, goHome }) {
  const [cards, setCards] = useState(() => buildCards(category));
  const [open, setOpen] = useState([]);           // keys of face-up unmatched cards
  const [matched, setMatched] = useState(new Set()); // matched words
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const won = matched.size === PAIRS;
  const celebratedRef = useRef(false);
  useEffect(() => {
    if (won && !celebratedRef.current) {
      celebratedRef.current = true;
      sfx.win();
      burst(24);
    }
  }, [won]);

  const flip = card => {
    if (locked || won || matched.has(card.w.word) || open.includes(card.key)) return;
    sfx.flip();
    const now = [...open, card.key];
    setOpen(now);
    if (now.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = now.map(k => cards.find(c => c.key === k));
      if (a.w.word === b.w.word) {
        speak(a.w.word);
        sfx.correct();
        setMatched(prev => new Set(prev).add(a.w.word));
        setOpen([]);
      } else {
        setLocked(true);
        setTimeout(() => {
          setOpen([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  const restart = () => {
    sfx.click();
    celebratedRef.current = false;
    setCards(buildCards(category));
    setOpen([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
  };

  const faceUp = c => open.includes(c.key) || matched.has(c.w.word);

  return (
    <div className="screen memory">
      <TopBar
        title="🧠 MEMORY"
        onBack={goHome}
        right={<span className="counter">Moves: {moves}</span>}
      />

      <div className="screen-body">
        {won ? (
          <div className="panel results">
            <h2 className="results-title">YOU WIN! 🏆</h2>
            <p className="results-line good">🧠 Moves: {moves}</p>
            <div className="results-actions">
              <button className="mc-btn green" onClick={restart}>▶ PLAY AGAIN</button>
              <button className="mc-btn" onClick={() => { sfx.click(); goHome(); }}>🏠 HOME</button>
            </div>
          </div>
        ) : (
          <div className="memory-grid">
            {cards.map(c => (
              <button
                key={c.key}
                className={`memory-card ${faceUp(c) ? 'up' : ''} ${matched.has(c.w.word) ? 'matched' : ''}`}
                onClick={() => flip(c)}
              >
                {faceUp(c) ? (
                  c.type === 'img' ? (
                    <WordImage word={c.w} />
                  ) : (
                    <span className="memory-word">{c.w.word.toUpperCase()}</span>
                  )
                ) : (
                  <span className="memory-back">❓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
