import { useState, useEffect, useRef } from 'react';
import TopBar from '../components/TopBar';
import WordImage from '../components/WordImage';
import { getWords, shuffle } from '../data/words';
import { speak } from '../utils/speech';
import { sfx } from '../utils/sfx';
import { burst } from '../utils/burst';

const ROUND_SIZE = 8;

const makeTiles = word => shuffle(word.split('').map((ch, i) => ({ id: `${i}-${ch}`, ch })));

// Build the word: drag letter blocks into the slots (or just tap them).
export default function Spell({ category, goHome }) {
  const [queue, setQueue] = useState(() => shuffle(getWords(category)).slice(0, ROUND_SIZE));
  const [idx, setIdx] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState('play'); // play | good | bad
  const [perfect, setPerfect] = useState(0);
  const mistakeRef = useRef(false);

  const word = queue[idx];
  const done = idx >= queue.length;

  useEffect(() => {
    if (!word) return;
    setTiles(makeTiles(word.word));
    setSlots(Array(word.word.length).fill(null));
    setStatus('play');
    mistakeRef.current = false;
  }, [word]);

  // Check the answer whenever every slot is filled.
  useEffect(() => {
    if (!word || status !== 'play' || !slots.length || !slots.every(Boolean)) return;
    const guess = slots.map(t => t.ch).join('');
    if (guess === word.word) {
      setStatus('good');
      if (!mistakeRef.current) setPerfect(p => p + 1);
      sfx.correct();
      speak(word.word);
      burst(12);
      setTimeout(() => setIdx(i => i + 1), 1500);
    } else {
      setStatus('bad');
      mistakeRef.current = true;
      sfx.wrong();
      setTimeout(() => {
        setSlots(Array(word.word.length).fill(null));
        setStatus('play');
      }, 800);
    }
  }, [slots, status, word]);

  const placeTile = (tile, slotIndex = null) => {
    if (status !== 'play') return;
    sfx.click();
    setSlots(prev => {
      if (prev.some(s => s && s.id === tile.id)) return prev;
      let i = slotIndex;
      if (i == null || prev[i]) i = prev.findIndex(s => !s);
      if (i === -1) return prev;
      const next = [...prev];
      next[i] = tile;
      return next;
    });
  };

  const removeFromSlot = i => {
    if (status !== 'play' || !slots[i]) return;
    sfx.click();
    setSlots(prev => {
      const next = [...prev];
      next[i] = null;
      return next;
    });
  };

  const onDrop = (e, slotIndex) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const tile = tiles.find(t => t.id === id);
    if (tile) placeTile(tile, slotIndex);
  };

  const restart = () => {
    sfx.click();
    setQueue(shuffle(getWords(category)).slice(0, ROUND_SIZE));
    setIdx(0);
    setPerfect(0);
  };

  if (done) {
    return (
      <div className="screen">
        <TopBar title="🔤 SPELL IT" onBack={goHome} />
        <div className="screen-body">
          <div className="panel results">
            <h2 className="results-title">WELL DONE! 🏆</h2>
            <p className="results-line good">⭐ Perfect words: {perfect} / {queue.length}</p>
            <div className="results-actions">
              <button className="mc-btn green" onClick={restart}>▶ PLAY AGAIN</button>
              <button className="mc-btn" onClick={() => { sfx.click(); goHome(); }}>🏠 HOME</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pool = tiles.filter(t => !slots.some(s => s && s.id === t.id));

  return (
    <div className="screen spell">
      <TopBar
        title="🔤 SPELL IT"
        onBack={goHome}
        right={<span className="counter">{idx + 1} / {queue.length}</span>}
      />
      <div className="pbar"><i style={{ width: `${(idx / queue.length) * 100}%` }} /></div>

      <div className="screen-body">
        <div className="panel spell-card">
          <WordImage word={word} />
          <button className="mc-btn small blue" onClick={() => { sfx.click(); speak(word.word); }}>
            🔊 HINT
          </button>
        </div>

        <div className={`slot-row ${status === 'bad' ? 'shake' : ''} ${status === 'good' ? 'good' : ''}`}>
          {slots.map((tile, i) => (
            <div
              key={i}
              className={`slot ${tile ? 'filled' : ''}`}
              onClick={() => removeFromSlot(i)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => onDrop(e, i)}
            >
              {tile ? tile.ch.toUpperCase() : ''}
            </div>
          ))}
        </div>

        <div className="tile-row">
          {pool.map(tile => (
            <button
              key={tile.id}
              className="tile"
              draggable
              onDragStart={e => e.dataTransfer.setData('text/plain', tile.id)}
              onClick={() => placeTile(tile)}
            >
              {tile.ch.toUpperCase()}
            </button>
          ))}
        </div>

        <p className="hint-text">Drag or tap the letters to build the word!</p>
      </div>
    </div>
  );
}
