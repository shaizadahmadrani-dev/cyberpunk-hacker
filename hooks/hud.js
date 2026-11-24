// Small moving marks drawn inside the conversation: one beside the line that says what Claude is doing, one over a reply.
// Pure vector, animated with CSS. Each is drawn finished in its plain markup, so it reads right when held still.

const CYAN = '#00f0ff'
const GREEN = '#39ff14'
const MAGENTA = '#ff2a9d'
const YELLOW = '#ffd400'

// For a person who asked for less motion: every moving class stops where it was drawn.
const STILL = '@media (prefers-reduced-motion:reduce){.m,.k,.s,.b,.l{animation:none}}'

const svg = (width, height, style, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
  `<style>${style}${STILL}</style>${body}</svg>`

const range = count => Array.from({ length: count }, (_, index) => index)

// Each part starts its loop a little after the one before it.
const stagger = (count, seconds) =>
  range(count)
    .map(index => `.d${index}{animation-delay:-${((count - index) * seconds).toFixed(2)}s}`)
    .join('')

const brackets = color => `<path d="M5 2H1.5V16H5M67 2H70.5V16H67" fill="none" stroke="${color}" stroke-width="1.5"/>`

// Thinking: a wave running through nine bars.
const wave = color =>
  svg(
    72,
    18,
    '.m{transform-box:fill-box;transform-origin:center;animation:w 1.2s ease-in-out infinite}' +
      stagger(9, 0.13) +
      '@keyframes w{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}',
    brackets(color) +
      range(9)
        .map(
          index =>
            `<rect class="m d${index}" x="${10 + index * 6}" y="${index % 2 === 0 ? 4 : 6}" width="3.5" ` +
            `height="${index % 2 === 0 ? 10 : 6}" fill="${index % 3 === 1 ? CYAN : color}"/>`,
        )
        .join(''),
  )

// Waiting on the model: packets crossing a dashed line.
const packets = color =>
  svg(
    72,
    18,
    '.m{animation:p 1.5s linear infinite}.d1{animation-delay:-.5s}.d2{animation-delay:-1s}' +
      '@keyframes p{0%{transform:translateX(-24px);opacity:0}20%,80%{opacity:1}100%{transform:translateX(24px);opacity:0}}',
    brackets(color) +
      `<path d="M10 9H62" fill="none" stroke="${color}" stroke-opacity="0.4" stroke-dasharray="2 4"/>` +
      range(3)
        .map(index => `<rect class="m d${index}" x="34" y="7" width="4" height="4" fill="${index === 1 ? MAGENTA : color}"/>`)
        .join(''),
  )

// A tool running: a light chasing along nine segments.
const chase = color =>
  svg(
    72,
    18,
    '.m{animation:c 1.35s linear infinite}' + stagger(9, 0.15) + '@keyframes c{0%,55%,100%{opacity:.2}15%{opacity:1}}',
    brackets(color) +
      range(9)
        .map(index => `<rect class="m d${index}" x="${10 + index * 6}" y="6" width="4.5" height="6" fill="${color}"/>`)
        .join(''),
  )

// Writing the reply: two lines typed out in steps, and a cursor.
const typing = color =>
  svg(
    72,
    18,
    '.m{transform-box:fill-box;transform-origin:left;animation:t 1.8s steps(8,end) infinite}.d1{animation-delay:-.4s}' +
      '.k{animation:k .9s steps(1,end) infinite}' +
      '@keyframes t{0%{transform:scaleX(0)}70%,100%{transform:scaleX(1)}}@keyframes k{0%{opacity:1}50%{opacity:0}}',
    brackets(color) +
      `<rect class="m" x="10" y="5" width="40" height="2.5" fill="${color}"/>` +
      `<rect class="m d1" x="10" y="10.5" width="28" height="2.5" fill="${GREEN}"/>` +
      `<rect class="k" x="55" y="4" width="6" height="10" fill="${color}"/>`,
  )

export const PULSE = {
  thinking: wave(MAGENTA),
  requesting: packets(CYAN),
  responding: typing(CYAN),
  'tool-input': chase(GREEN),
  'tool-use': chase(GREEN),
}

// Over a message: a tag of abstract strokes, a line that draws itself in, a light that runs along it and three diodes.
// `edge` colors the tag and the line, `light` what runs along it.
const strip = (edge, light) =>
  svg(
    220,
    12,
    '.b{animation:b 2.4s ease-in-out infinite}' +
      '.l{stroke-dasharray:138;animation:l .9s ease-out both}' +
      '.s{animation:s 3s linear infinite}' +
      '.k{animation:k 2s steps(1,end) infinite}.d1{animation-delay:-.66s}.d2{animation-delay:-1.33s}' +
      '@keyframes b{0%,100%{opacity:1}50%{opacity:.45}}' +
      '@keyframes l{0%{stroke-dashoffset:138}100%{stroke-dashoffset:0}}' +
      '@keyframes s{0%{transform:translateX(-124px);opacity:0}10%,90%{opacity:1}100%{transform:translateX(0);opacity:0}}' +
      '@keyframes k{0%{opacity:1}33%{opacity:.2}}',
    `<path class="b" d="M0 1H9L13 6L9 11H0L4 6Z" fill="${edge}"/>` +
      `<path d="M12 1H16L20 6L16 11H12L16 6Z" fill="${light}" opacity="0.8"/>` +
      `<path d="M26 3V9H31V3M35 9V3H40M35 6H39M44 3H50M47 3V9" fill="none" stroke="${edge}" stroke-width="1.5"/>` +
      `<path d="M74 6V9M90 6V9M106 6V9M122 6V9M138 6V9M154 6V9M170 6V9M186 6V9" fill="none" stroke="${edge}" stroke-opacity="0.4"/>` +
      `<path class="l" d="M58 6H196" fill="none" stroke="${edge}" stroke-opacity="0.6"/>` +
      `<rect class="s" x="182" y="5" width="14" height="2" fill="${light}"/>` +
      `<rect class="k" x="202" y="4" width="4" height="4" fill="${GREEN}"/>` +
      `<rect class="k d1" x="208" y="4" width="4" height="4" fill="${YELLOW}"/>` +
      `<rect class="k d2" x="214" y="4" width="4" height="4" fill="${light}"/>`,
  )

// Cyan over what Claude answers, magenta over what the person sends.
export const RECEIVED = strip(CYAN, MAGENTA)
export const SENT = strip(MAGENTA, CYAN)
