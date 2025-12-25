
// A procedural audio synthesizer for Cyberpunk UI effects
// Uses Web Audio API to avoid external asset dependencies

let audioCtx: AudioContext | null = null;
let isMuted = false;
let masterGain: GainNode | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.3; // Default volume
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const toggleMute = () => {
  isMuted = !isMuted;
  if (masterGain) {
    masterGain.gain.setValueAtTime(isMuted ? 0 : 0.3, audioCtx?.currentTime || 0);
  }
  return isMuted;
};

// --- SYNTHESIZERS ---

const playTone = (freq: number, type: OscillatorType, duration: number, startTime = 0, vol = 1) => {
  if (isMuted) return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);

  gain.gain.setValueAtTime(vol, audioCtx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(audioCtx.currentTime + startTime);
  osc.stop(audioCtx.currentTime + startTime + duration);
};

const playNoise = (duration: number) => {
    if (isMuted) return;
    initAudio();
    if (!audioCtx || !masterGain) return;

    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    noise.connect(gain);
    gain.connect(masterGain);
    noise.start();
};

// --- SFX EXPORTS ---

export const SFX = {
  hover: () => {
    // High pitch short blip
    playTone(800, 'sine', 0.03, 0, 0.05);
  },
  
  click: () => {
    // Mechanical switch sound
    playTone(300, 'square', 0.05, 0, 0.1);
    playTone(150, 'sawtooth', 0.05, 0.01, 0.1);
  },

  typing: () => {
    // Very subtle high tick
    if (Math.random() > 0.5) return; // Don't play on every char to reduce annoyance
    playTone(1200 + Math.random() * 500, 'sine', 0.01, 0, 0.05);
  },

  error: () => {
    // Low buzzing failure
    playTone(150, 'sawtooth', 0.3, 0, 0.3);
    playTone(100, 'square', 0.3, 0.1, 0.3);
  },

  success: () => {
    // Ascending major arpeggio
    playTone(440, 'sine', 0.1, 0, 0.2); // A4
    playTone(554, 'sine', 0.1, 0.1, 0.2); // C#5
    playTone(659, 'sine', 0.2, 0.2, 0.2); // E5
    playTone(880, 'sine', 0.4, 0.3, 0.1); // A5
  },

  levelStart: () => {
    // Sci-fi whoosh/boot
    playTone(200, 'sine', 0.5, 0, 0.2);
    // Frequency sweep simulated by noise or just rapid tones
    setTimeout(() => playTone(600, 'triangle', 0.3, 0, 0.1), 100);
    setTimeout(() => playTone(1200, 'sine', 0.4, 0, 0.05), 300);
  },

  aiMessage: () => {
    // Data stream sound
    playTone(1200, 'square', 0.05, 0, 0.05);
    playTone(1500, 'square', 0.05, 0.05, 0.05);
    playTone(1800, 'square', 0.05, 0.1, 0.05);
  }
};
