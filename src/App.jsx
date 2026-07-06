import { useState, useCallback } from 'react';
import Home from './screens/Home';
import Learn from './screens/Learn';
import Spell from './screens/Spell';
import Quiz from './screens/Quiz';
import Memory from './screens/Memory';
import SoundHunt from './screens/SoundHunt';
import { loadKnown, saveKnown } from './utils/storage';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [category, setCategory] = useState('all');
  const [known, setKnown] = useState(loadKnown);

  const goHome = useCallback(() => setScreen('home'), []);

  const addKnown = useCallback(words => {
    setKnown(prev => {
      const next = new Set(prev);
      words.forEach(w => next.add(w));
      saveKnown(next);
      return next;
    });
  }, []);

  const modeProps = { category, goHome };

  return (
    <div className="app">
      {screen === 'home' && (
        <Home
          category={category}
          setCategory={setCategory}
          setScreen={setScreen}
          knownCount={known.size}
        />
      )}
      {screen === 'learn' && <Learn {...modeProps} addKnown={addKnown} />}
      {screen === 'spell' && <Spell {...modeProps} />}
      {screen === 'quiz' && <Quiz {...modeProps} />}
      {screen === 'memory' && <Memory {...modeProps} />}
      {screen === 'hunt' && <SoundHunt {...modeProps} />}
    </div>
  );
}
