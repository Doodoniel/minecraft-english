import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import WordImage from '../components/WordImage';
import { getWords, shuffle } from '../data/words';
import { speak } from '../utils/speech';
import { sfx } from '../utils/sfx';
import { burst } from '../utils/burst';

const DURATION = 45; // seconds
const GRID_SIZE = 9;

// Arcade mode: listen to the word and tap the right picture before time runs out.
export default function SoundHunt({ category, goHome }) {
  const [phase, setPhase] = useState('ready'); // ready | play | end
  const [grid, setGrid] = useState([]);
  const [target, setTarget] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [flash, setFlash] = useState(null); // { word, ok }

  const newRound = () => {
    const pool = getWords(category);
    const g = shuffle(pool).slice(0, Math.min(GRID_SIZE, pool.length));
    const t = g[(Math.random() * g.length) | 0];
    setGrid(g);
    setTarget(t);
    setTimeout(() => speak(t.word), 350);
  };

  const start = () => {
    sfx.click();
    setScore(0);
    setTime(DURATION);
    setPhase('play');
    newRound();
  };

  useEffect(() => {
    if (phase !== 'play') return;
    if (time <= 0) {
      setPhase('end');
      sfx.win();
      burst(20);
      return;
    }
    const t = setTimeout(() => setTime(x => x - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, time]);

  const tap = w => {
    if (phase !== 'play' || flash) return;
    if (w.word === target.word) {
      sfx.correct();
      setScore(s => s + 10);
      setFlash({ word: w.word, ok: true });
      setTimeout(() => {
        setFlash(null);
        newRound();
      }, 500);
    } else {
      sfx.wrong();
      setFlash({ word: w.word, ok: false });
      setTimeout(() => setFlash(null), 450);
      speak(target.word);
    }
  };

  return (
    <div className="screen hunt">
      <TopBar
        title="🔊 SOUND HUNT"
        onBack={goHome}
        right={<span className="counter">💎 {score}</span>}
      />

      <div className="screen-body">
        {phase === 'ready' && (
          <div className="panel results">
            <h2 className="results-title">🔊 SOUND HUNT</h2>
            <p className="hunt-rules">Listen to the word.<br />Tap the right picture.<br />How many can you find in {DURATION} seconds?</p>
            <div className="results-actions">
              <button className="mc-btn green big" onClick={start}>▶ START</button>
            </div>
          </div>
        )}

        {phase === 'play' && (
          <>
            <div className="hunt-top">
              <span className={`hunt-timer ${time <= 10 ? 'low' : ''}`}>⏳ {time}</span>
              <button className="mc-btn small blue" onClick={() => { sfx.click(); speak(target.word); }}>
                🔊 SAY IT AGAIN
              </button>
            </div>
            <div className="hunt-grid">
              {grid.map(w => (
                <button
                  key={w.word}
                  className={`hunt-tile ${flash && flash.word === w.word ? (flash.ok ? 'good' : 'bad') : ''}`}
                  onClick={() => tap(w)}
                >
                  <WordImage word={w} />
                </button>
              ))}
            </div>
          </>
        )}

        {phase === 'end' && (
          <div className="panel results">
            <h2 className="results-title">TIME'S UP! ⏰</h2>
            <p className="results-line good">💎 Score: {score}</p>
            <div className="results-actions">
              <button className="mc-btn green" onClick={start}>▶ PLAY AGAIN</button>
              <button className="mc-btn" onClick={() => { sfx.click(); goHome(); }}>🏠 HOME</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
