// Text-to-speech via the browser's built-in Web Speech API.
let voice = null;

function pickVoice() {
  const voices = speechSynthesis.getVoices();
  voice =
    voices.find(v => v.lang.startsWith('en') && /Google|Natural/i.test(v.name)) ||
    voices.find(v => v.lang === 'en-US') ||
    voices.find(v => v.lang.startsWith('en')) ||
    null;
}

if (typeof speechSynthesis !== 'undefined') {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

export function speak(text, rate = 0.8) {
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  if (voice) u.voice = voice;
  u.rate = rate;
  u.pitch = 1.05;
  speechSynthesis.speak(u);
}
