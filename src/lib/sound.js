// Pure Web Audio API quiet room ambience generator for NOIR — 喫茶室.
// Defaults OFF. Never autoplays. Respects browser policies.

let audioCtx = null;
let masterGain = null;
let isPlaying = false;

export function toggleAmbientSound() {
  if (isPlaying) {
    stopAmbientSound();
    return false;
  } else {
    startAmbientSound();
    return true;
  }
}

export function isAudioActive() {
  return isPlaying;
}

function startAmbientSound() {
  if (isPlaying) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, audioCtx.currentTime);

    const lfo = audioCtx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime);
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.setValueAtTime(20, audioCtx.currentTime);
    lfo.connect(filter.frequency);

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 2);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    whiteNoise.start();
    lfo.start();
    isPlaying = true;
  } catch {
    isPlaying = false;
  }
}

function stopAmbientSound() {
  if (!isPlaying || !masterGain || !audioCtx) return;
  try {
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    setTimeout(() => {
      isPlaying = false;
    }, 500);
  } catch {
    isPlaying = false;
  }
}
