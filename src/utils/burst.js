// Emoji confetti burst for correct answers and wins.
const PARTICLES = ['⭐', '💎', '✨', '🎉', '🟩', '🧡'];

export function burst(count = 18) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'burst-p';
    s.textContent = PARTICLES[(Math.random() * PARTICLES.length) | 0];
    s.style.left = 42 + Math.random() * 16 + '%';
    s.style.setProperty('--dx', (Math.random() * 2 - 1) * 42 + 'vw');
    s.style.setProperty('--dy', -(18 + Math.random() * 45) + 'vh');
    s.style.setProperty('--r', Math.random() * 720 - 360 + 'deg');
    s.style.animationDuration = 0.9 + Math.random() * 0.7 + 's';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1700);
  }
}
