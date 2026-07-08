import { useState } from 'react';
import TopBar from '../components/TopBar';
import { CATEGORIES, getWords } from '../data/words';
import { sfx } from '../utils/sfx';

// Mode icon from public/assets/icons/<id>.png, falling back to the emoji.
function ModeIcon({ id, emoji }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="mode-icon">{emoji}</span>;
  return (
    <img
      className="mode-icon-img"
      src={`${import.meta.env.BASE_URL}assets/icons/${id}.png`}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

const MODES = [
  { id: 'learn',  icon: '🃏', label: 'LEARN',      desc: 'Flashcards',      color: 'green'  },
  { id: 'spell',  icon: '🔤', label: 'SPELL IT',   desc: 'Build the word',  color: 'gold'   },
  { id: 'quiz',   icon: '❓', label: 'QUIZ',       desc: 'Pick the word',   color: 'blue'   },
  { id: 'memory', icon: '🧠', label: 'MEMORY',     desc: 'Match the pairs', color: 'purple' },
  { id: 'hunt',   icon: '🔊', label: 'SOUND HUNT', desc: 'Listen and find', color: 'red'    },
];

export default function Home({ category, setCategory, setScreen, knownCount }) {
  return (
    <div className="screen home">
      <TopBar title="" />

      <div className="home-hero">
        <h1 className="game-title">
          <span className="title-icon">⛏️</span> MINECRAFT ENGLISH <span className="title-icon">💎</span>
        </h1>
        <p className="game-subtitle">Learn words. Have fun!</p>
      </div>

      <div className="cat-row">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`chip ${category === c.id ? 'active' : ''}`}
            onClick={() => { sfx.click(); setCategory(c.id); }}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <div className="mode-grid">
        {MODES.map(m => (
          <button
            key={m.id}
            className={`mode-btn mc-btn ${m.color}`}
            onClick={() => { sfx.click(); setScreen(m.id); }}
          >
            <ModeIcon id={m.id} emoji={m.icon} />
            <span className="mode-label">{m.label}</span>
            <span className="mode-desc">{m.desc}</span>
          </button>
        ))}
      </div>

      <footer className="home-footer">
        ⭐ Words learned: {knownCount} / {getWords('all').length}
      </footer>
    </div>
  );
}
