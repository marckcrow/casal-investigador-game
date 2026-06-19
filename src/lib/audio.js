// Audio Manager — uses Web Audio API for ambient sounds + procedural SFX
// No external audio files needed — everything is generated programmatically

let audioCtx = null
let ambientGain = null
let ambientOsc = null
let ambientLFO = null
let rainNode = null
let isPlaying = false

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

// — Rain / Ambient —
export function startAmbient(theme = 'rain') {
  stopAmbient()
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()

  // Master gain for ambient
  ambientGain = ctx.createGain()
  ambientGain.gain.setValueAtTime(0.08, ctx.currentTime)
  ambientGain.connect(ctx.destination)

  if (theme === 'rain' || theme === 'horror') {
    // White noise for rain
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5
    rainNode = ctx.createBufferSource()
    rainNode.buffer = buffer
    rainNode.loop = true

    // Low-pass filter = rain rumble
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400

    rainNode.connect(filter)
    filter.connect(ambientGain)
    rainNode.start()
  }

  // Low drone for noir atmosphere
  ambientOsc = ctx.createOscillator()
  ambientOsc.type = 'sine'
  ambientOsc.frequency.value = 55 // low A

  const droneGain = ctx.createGain()
  droneGain.gain.value = 0.03

  ambientOsc.connect(droneGain)
  droneGain.connect(ambientGain)
  ambientOsc.start()

  isPlaying = true
}

export function stopAmbient() {
  try {
    if (rainNode) { rainNode.stop(); rainNode = null }
    if (ambientOsc) { ambientOsc.stop(); ambientOsc = null }
    if (ambientGain) { ambientGain.disconnect(); ambientGain = null }
  } catch (e) {}
  isPlaying = false
}

export function setAmbientVolume(vol) {
  if (ambientGain) {
    const ctx = getCtx()
    ambientGain.gain.setTargetAtTime(vol * 0.15, ctx.currentTime, 0.5)
  }
}

// — Procedural SFX —

export function playTypewriter() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)
  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.05)
}

export function playStamp() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05))
  }
  const src = ctx.createBufferSource()
  src.buffer = buf
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.6, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
  src.connect(gain)
  gain.connect(ctx.destination)
  src.start()
}

export function playSiren() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(400, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.5)
  osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 1.0)
  gain.gain.setValueAtTime(0.05, ctx.currentTime)
  gain.gain.setValueAtTime(0.05, ctx.currentTime + 0.9)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 1.0)
}

export function playClick() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 1200
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.08)
}

export function playDramaticSting() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()
  const freqs = [220, 277, 330, 440]
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0, ctx.currentTime + i * 0.08)
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.08 + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime + i * 0.08)
    osc.stop(ctx.currentTime + 1.5)
  })
}

export function playVoteLock() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.15)
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.2)
}

export function playVictory() {
  const ctx = getCtx()
  if (ctx.state === 'suspended') ctx.resume()
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0, ctx.currentTime + i * 0.15)
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.15 + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.5)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime + i * 0.15)
    osc.stop(ctx.currentTime + i * 0.15 + 0.5)
  })
}
