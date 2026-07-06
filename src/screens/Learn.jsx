import { useState, useEffect, useRef } from 'react';
import TopBar from '../components/TopBar';
import WordImage from '../components/WordImage';
import { getWords, shuffle } from '../data/words';
import { speak } from '../utils/speech';
import { sfx } from '../utils/sfx';
import { burst } from '../utils/burst';

// Flashcards: look at the picture, press REVEAL to see and hear the word,
// then mark it with ✅ "I know it" or ❌ "Still learning".
export default function Learn({ category, goHome, addKnown }) {
  const [deck, setDeck] = useState(() => shuffle(getWords(category)));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [knownList, setKnownList] = useState([]);
  const [learnList, setLearnList] = useState([]);

  const done = idx >= deck.length;
  const word = deck[idx];

  const savedRef = useRef(false);
  useEffect(() => {
    if (done && !savedRef.current) {
      savedRef.current = true;
      sfx.win();
      burst(24);
      if (knownList.length) addKnown(knownList.map(w => w.word));
    }
  }, [done, knownList, addKnown]);

  const restart = newDeck => {
    savedRef.current = false;
    setDeck(shuffle(newDeck));
    setIdx(0);
    setRevealed(false);
    setKnownList([]);
    setLearnList([]);
  };

  const reveal = () => {
    sfx.flip();
    setRevealed(true);
    speak(word.word);
  };

  const mark = knows => {
    if (knows) {
      sfx.correct();
      setKnownList(l => [...l, word]);
    } else {
      sfx.click();
      setLearnList(l => [...l, word]);
    }
    setRevealed(false);
    setIdx(i => i + 1);
  };

  if (done) {
    return (
      <div className="screen">
        <TopBar title="🃏 LEARN" onBack={goHome} />
        <div className="screen-body">
          <div className="panel results">
            <h2 className="results-title">GREAT JOB! 🎉</h2>
            <p className="results-line good">✅ I know: {knownList.length}</p>
            <p className="results-line bad">❌ Still learning: {learnList.length}</p>
            <div className="results-actions">
              {learnList.length > 0 && (
                <button className="mc-btn gold" onClick={() => { sfx.click(); restart(learnList); }}>
                  🔁 PRACTICE TRICKY WORDS
                </button>
              )}
              <button className="mc-btn green" onClick={() => { sfx.click(); restart(getWords(category)); }}>
                ▶ PLAY AGAIN
              </button>
              <button className="mc-btn" onClick={() => { sfx.click(); goHome(); }}>
                🏠 HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <TopBar
        title="🃏 LEARN"
        onBack={goHome}
        right={<span className="counter">{idx + 1} / {deck.length}</span>}
      />
      <div className="pbar"><i style={{ width: `${(idx / deck.length) * 100}%` }} /></div>

      <div className="screen-body">
        <div className={`panel flashcard ${revealed ? 'revealed' : ''}`}>
          <WordImage word={word} />
          {revealed ? (
            <div className="flash-word">
              {word.word.toUpperCase()}
              <button
                className="mc-btn small blue"
                onClick={() => { sfx.click(); speak(word.word); }}
                title="Say it again"
              >
                🔊
              </button>
            </div>
          ) : (
            <button className="mc-btn gold big" onClick={reveal}>👁 REVEAL</button>
          )}
        </div>

        <div className="learn-actions">
          <button className="mc-btn red big" disabled={!revealed} onClick={() => mark(false)}>
            ❌ STILL LEARNING
          </button>
          <button className="mc-btn green big" disabled={!revealed} onClick={() => mark(true)}>
            ✅ I KNOW IT
          </button>
        </div>
      </div>
    </div>
  );
}
