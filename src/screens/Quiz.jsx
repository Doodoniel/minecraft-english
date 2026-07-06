import { useState } from 'react';
import TopBar from '../components/TopBar';
import WordImage from '../components/WordImage';
import { getWords, shuffle } from '../data/words';
import { speak } from '../utils/speech';
import { sfx } from '../utils/sfx';
import { burst } from '../utils/burst';

const ROUNDS = 8;

function buildQuestions(category) {
  const pool = getWords(category);
  return shuffle(pool).slice(0, Math.min(ROUNDS, pool.length)).map(w => {
    const others = shuffle(pool.filter(o => o.word !== w.word)).slice(0, 3);
    return { w, options: shuffle([w, ...others]) };
  });
}

// Look at the picture and pick the right word out of four.
export default function Quiz({ category, goHome }) {
  const [questions, setQuestions] = useState(() => buildQuestions(category));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  const done = idx >= questions.length;
  const q = questions[idx];

  const pick = option => {
    if (picked) return;
    setPicked(option);
    speak(q.w.word);
    if (option.word === q.w.word) {
      sfx.correct();
      setScore(s => s + 1);
      burst(10);
    } else {
      sfx.wrong();
    }
    setTimeout(() => {
      setPicked(null);
      setIdx(i => i + 1);
    }, 1500);
  };

  const restart = () => {
    sfx.click();
    setQuestions(buildQuestions(category));
    setIdx(0);
    setScore(0);
    setPicked(null);
  };

  if (done) {
    const stars = score >= questions.length - 1 ? '⭐⭐⭐' : score >= questions.length / 2 ? '⭐⭐' : '⭐';
    return (
      <div className="screen">
        <TopBar title="❓ QUIZ" onBack={goHome} />
        <div className="screen-body">
          <div className="panel results">
            <h2 className="results-title">{stars}</h2>
            <p className="results-line good">💎 Score: {score} / {questions.length}</p>
            <div className="results-actions">
              <button className="mc-btn green" onClick={restart}>▶ PLAY AGAIN</button>
              <button className="mc-btn" onClick={() => { sfx.click(); goHome(); }}>🏠 HOME</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const optionClass = o => {
    if (!picked) return '';
    if (o.word === q.w.word) return 'good';
    if (o.word === picked.word) return 'bad';
    return 'dim';
  };

  return (
    <div className="screen quiz">
      <TopBar
        title="❓ QUIZ"
        onBack={goHome}
        right={<span className="counter">💎 {score}</span>}
      />
      <div className="pbar"><i style={{ width: `${(idx / questions.length) * 100}%` }} /></div>

      <div className="screen-body">
        <div className="panel quiz-card">
          <WordImage word={q.w} />
          <p className="quiz-question">What is this?</p>
        </div>

        <div className="option-grid">
          {q.options.map(o => (
            <button
              key={o.word}
              className={`mc-btn option ${optionClass(o)}`}
              onClick={() => pick(o)}
            >
              {o.word.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
