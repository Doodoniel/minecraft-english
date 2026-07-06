// Small retro sound effects generated with the Web Audio API (no audio files needed).
let ctx = null;

function audio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, startDelay, duration, type = 'square', volume = 0.12) {
  try {
    const ac = audio();
    const t0 = ac.currentTime + startDelay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(volume, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration);
  } catch {
    /* audio not available — stay silent */
  }
}

export const sfx = {
  click()   { tone(440, 0, 0.06, 'square', 0.06); },
  flip()    { tone(330, 0, 0.05, 'triangle', 0.1); tone(494, 0.05, 0.07, 'triangle', 0.1); },
  correct() { tone(523, 0, 0.1); tone(659, 0.1, 0.1); tone(784, 0.2, 0.18); },
  wrong()   { tone(180, 0, 0.18, 'sawtooth', 0.1); tone(140, 0.15, 0.25, 'sawtooth', 0.1); },
  win()     { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.2)); tone(1319, 0.5, 0.4); },
};
