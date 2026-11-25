// Synthesizes the theme's typing sounds, ASMR style, as 16-bit stereo WAVs: quiet, low, close and tactile. A key is
// struck in two stages, like a good mechanical keyboard heard on headphones: a creamy thock as it bottoms out, then
// the soft click of its return. Each of the eight keys sits a little left or right, as on a real keyboard.
// Usage, from the mod folder: node tools/make-sounds.js sounds
// With LAYERS=1 it prints each layer's own peak instead, to balance the gains.
const fs = require('node:fs')
const path = require('node:path')

const RATE = 44100

let seed = 97531
const noise = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  return seed / 0x3fffffff - 1
}

// Rises over `attack` seconds, then dies at `decay` per second.
const envelope = (t, attack, decay) => (t < attack ? t / attack : Math.exp(-(t - attack) * decay))

// A two-pole band-pass (RBJ cookbook), unity gain at `hz`.
const bandpass = (hz, q) => {
  const w = (2 * Math.PI * hz) / RATE
  const alpha = Math.sin(w) / (2 * q)
  const a0 = 1 + alpha
  const b0 = alpha / a0
  const a1 = (-2 * Math.cos(w)) / a0
  const a2 = (1 - alpha) / a0
  let x1 = 0
  let x2 = 0
  let y1 = 0
  let y2 = 0
  return x => {
    const y = b0 * x - b0 * x2 - a1 * y1 - a2 * y2
    x2 = x1
    x1 = x
    y2 = y1
    y1 = y
    return y
  }
}

// A one-pole low-pass at `hz`.
const lowpass = hz => {
  const a = 1 - Math.exp((-2 * Math.PI * hz) / RATE)
  let y = 0
  return x => {
    y += a * (x - y)
    return y
  }
}

// A muffled knock: noise band-passed around `hz`, struck, then dying at `decay` per second.
const thud = ({ hz, q, decay, gain }) => {
  const filter = bandpass(hz, q)
  return t => filter(noise()) * envelope(t, 0.0008, decay) * gain
}

// A sine that drops from `from` to `to` hertz with time constant `glide` seconds: the small electronic pop.
const pop = ({ from, to, glide, attack, decay, gain }) => {
  let phase = 0
  return t => {
    const hz = to + (from - to) * Math.exp(-t / glide)
    phase += (2 * Math.PI * hz) / RATE
    return Math.sin(phase) * envelope(t, attack, decay) * gain
  }
}

// The soft contact of a fingertip: noise kept between `low` and `high` hertz, over in about a millisecond.
const tick = ({ low, high, decay, gain }) => {
  const under = lowpass(high)
  const floor = lowpass(low)
  return t => {
    const raw = under(noise())
    return (raw - floor(raw)) * Math.exp(-t * decay) * gain
  }
}

// A puff of air: noise whose low-pass opens from `from` to `to` hertz as it swells and fades, smooth at both ends.
const puff = ({ from, to, length, gain }) => {
  const k0 = 1 - Math.exp((-2 * Math.PI * from) / RATE)
  const k1 = 1 - Math.exp((-2 * Math.PI * to) / RATE)
  let low = 0
  return t => {
    const k = Math.min(1, t / length)
    low += (k0 + (k1 - k0) * k) * (noise() - low)
    return low * Math.sin(Math.PI * k) ** 2 * gain
  }
}

// A voice that starts `delay` seconds in.
const after = (delay, voice) => t => (t < delay ? 0 : voice(t - delay))

// One key: the plate and the case knock together as it bottoms out, with the pop and the fingertip on top, then the
// key comes back up `release` seconds later with a smaller, brighter knock and click.
const key = ({ plate, base, under, release }) => () => [
  thud({ hz: plate, q: 1.6, decay: 60, gain: 5 }),
  thud({ hz: base, q: 2.2, decay: 42, gain: 5 }),
  pop({ from: under * 2.2, to: under, glide: 0.006, attack: 0.001, decay: 85, gain: 0.28 }),
  tick({ low: 500, high: 2000, decay: 1100, gain: 1.5 }),
  after(release, thud({ hz: plate * 1.45, q: 2, decay: 110, gain: 1.4 })),
  after(release, tick({ low: 700, high: 2400, decay: 1500, gain: 1.1 })),
]

const SOUNDS = {}

// Eight keys, each a few percent apart and off any scale, so a run of them reads as one keyboard, not a tune. Their
// places are shuffled against their pitch, as on a real keyboard.
;[
  { plate: 348, base: 196, under: 158, release: 0.052, pan: -0.32 },
  { plate: 366, base: 204, under: 171, release: 0.061, pan: 0.19 },
  { plate: 383, base: 189, under: 164, release: 0.056, pan: -0.06 },
  { plate: 399, base: 211, under: 177, release: 0.066, pan: 0.45 },
  { plate: 414, base: 199, under: 161, release: 0.049, pan: -0.45 },
  { plate: 431, base: 186, under: 174, release: 0.059, pan: 0.06 },
  { plate: 446, base: 207, under: 168, release: 0.063, pan: 0.32 },
  { plate: 463, base: 193, under: 180, release: 0.054, pan: -0.19 },
].forEach(({ pan, ...shape }, i) => {
  SOUNDS[`tap${i + 1}`] = { seconds: 0.12, peak: 0.12, lowpass: 2200, pan, layers: key(shape) }
})

// A space: the long key in the middle, a deeper thock with a puff of air, and a slower return.
SOUNDS.breath = {
  seconds: 0.17,
  peak: 0.11,
  lowpass: 2200,
  pan: 0,
  layers: () => [
    thud({ hz: 245, q: 1.3, decay: 34, gain: 5 }),
    thud({ hz: 150, q: 2, decay: 30, gain: 4 }),
    pop({ from: 300, to: 118, glide: 0.012, attack: 0.001, decay: 45, gain: 0.3 }),
    puff({ from: 150, to: 650, length: 0.1, gain: 1.6 }),
    tick({ low: 400, high: 2000, decay: 1100, gain: 0.9 }),
    after(0.075, thud({ hz: 360, q: 2, decay: 90, gain: 1.4 })),
    after(0.075, tick({ low: 600, high: 2200, decay: 1500, gain: 0.8 })),
  ],
}

// A deletion: up and to the right, where backspace sits, a soft bloop falling away.
SOUNDS.zip = {
  seconds: 0.12,
  peak: 0.11,
  lowpass: 2200,
  pan: 0.4,
  layers: () => [
    pop({ from: 400, to: 140, glide: 0.025, attack: 0.002, decay: 30, gain: 0.5 }),
    thud({ hz: 520, q: 1.5, decay: 55, gain: 2.5 }),
    thud({ hz: 190, q: 2.2, decay: 45, gain: 2.5 }),
    tick({ low: 400, high: 2000, decay: 1300, gain: 0.6 }),
  ],
}

// A paste: a low, muffled whoomp in the middle, a swell of air over a soft drop.
SOUNDS.bloom = {
  seconds: 0.4,
  peak: 0.13,
  lowpass: 1700,
  pan: 0,
  layers: () => [
    pop({ from: 220, to: 120, glide: 0.06, attack: 0.02, decay: 9, gain: 0.4 }),
    puff({ from: 80, to: 450, length: 0.34, gain: 2.4 }),
    thud({ hz: 280, q: 1, decay: 18, gain: 3 }),
  ],
}

// Each voice summed, then a gentle two-pole low-pass so nothing is shrill.
const render = (seconds, hz, voices) => {
  const n = Math.round(RATE * seconds)
  const first = lowpass(hz)
  const second = lowpass(hz)
  const samples = new Float32Array(n)
  for (let i = 0; i < n; i += 1) {
    samples[i] = second(first(voices.reduce((sum, voice) => sum + voice(i / RATE), 0)))
  }
  return samples
}

// Places a mono sound at `pan` (-1 left, 1 right): constant-power gains, the far ear up to 0.4 ms late, and one soft,
// dull reflection in both ears 11 ms on, so it sounds close, in a small room.
const place = (mono, pan) => {
  const n = mono.length
  const angle = ((pan + 1) * Math.PI) / 4
  const gains = [Math.cos(angle), Math.sin(angle)]
  const far = pan > 0 ? 0 : 1
  const lag = Math.round(Math.abs(pan) * 0.0004 * RATE)
  const echo = Math.round(0.011 * RATE)
  const dull = lowpass(1400)
  const reflection = Float32Array.from(mono, (_, i) => dull(i >= echo ? mono[i - echo] : 0) * 0.16)

  return [0, 1].map(channel => {
    const shift = channel === far ? lag : 0
    return Float32Array.from(mono, (_, i) => (i >= shift ? mono[i - shift] : 0) * gains[channel] + reflection[i])
  })
}

const peakOf = samples => samples.reduce((max, s) => Math.max(max, Math.abs(s)), 0)

const writeWav = (file, [left, right]) => {
  const data = Buffer.alloc(left.length * 4)
  const clip = s => Math.round(Math.max(-1, Math.min(1, s)) * 32767)
  for (let i = 0; i < left.length; i += 1) {
    data.writeInt16LE(clip(left[i]), i * 4)
    data.writeInt16LE(clip(right[i]), i * 4 + 2)
  }
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + data.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(2, 22)
  header.writeUInt32LE(RATE, 24)
  header.writeUInt32LE(RATE * 4, 28)
  header.writeUInt16LE(4, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(data.length, 40)
  fs.writeFileSync(file, Buffer.concat([header, data]))
}

if (process.env.LAYERS) {
  for (const [name, { seconds, lowpass: hz, layers }] of Object.entries(SOUNDS)) {
    const peaks = layers().map((_, i) => peakOf(render(seconds, hz, [layers()[i]])).toFixed(3))
    console.log(`${name}: ${peaks.join(' ')}`)
  }
  process.exit(0)
}

const outDirs = process.argv.slice(2)

for (const dir of outDirs) {
  fs.mkdirSync(dir, { recursive: true })
}

for (const [name, { seconds, peak, lowpass: hz, pan, layers }] of Object.entries(SOUNDS)) {
  const channels = place(render(seconds, hz, layers()), pan)
  const max = Math.max(...channels.map(peakOf))
  const n = channels[0].length
  const fade = 44

  for (const samples of channels) {
    for (let i = 0; i < n; i += 1) {
      samples[i] = (samples[i] / max) * peak * Math.min(1, i / fade, (n - 1 - i) / fade)
    }
  }

  for (const dir of outDirs) {
    writeWav(path.join(dir, `${name}.wav`), channels)
  }

  console.log(`${name}.wav ${n} frames, pan ${pan}`)
}
