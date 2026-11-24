// The backdrop: a neon street canyon at night under a holographic globe, as one SVG string.
// Pure vector and CSS animation only, with every moving part at rest in the markup.

const W = 1600
const H = 1000
const HORIZON = 760
const VANISH = 800

const CYAN = '#00f0ff'
const MAGENTA = '#ff2a9d'
const GREEN = '#39ff14'
const YELLOW = '#ffd400'

// A fixed seed, so the city is the same on every load.
let seed = 20261124

const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296

  return seed / 4294967296
}

const n1 = value => value.toFixed(1)

const neon = () => {
  const pick = rand()

  if (pick < 0.5) {
    return CYAN
  }

  return pick < 0.8 ? MAGENTA : YELLOW
}

// Stars: one still group and two that breathe.
const starGroups = [[], [], []]

for (let i = 0; i < 90; i += 1) {
  const group = starGroups[Math.floor(rand() * 3)]

  group.push(
    `<circle cx="${n1(rand() * W)}" cy="${n1(rand() * 470)}" r="${n1(0.5 + rand() * 0.9)}" fill="#cfe9ff" opacity="${(0.25 + rand() * 0.55).toFixed(2)}"/>`,
  )
}

const STARS = `<g>${starGroups[0].join('')}</g><g class="tw2">${starGroups[1].join('')}</g><g class="tw3">${starGroups[2].join('')}</g>`

// The globe: a wireframe sphere half risen behind the city, its meridians turning.
const GLOBE_X = VANISH
const GLOBE_Y = 770
const GLOBE_R = 300
const SPIN_SECONDS = 10

const parallels = [10, 25, 40, 55, 70].map(latitude => {
  const angle = (latitude * Math.PI) / 180
  const half = GLOBE_R * Math.cos(angle)
  const y = GLOBE_Y - GLOBE_R * Math.sin(angle)

  return `<line x1="${n1(GLOBE_X - half)}" y1="${n1(y)}" x2="${n1(GLOBE_X + half)}" y2="${n1(y)}"/>`
})

const meridians = []
const meridianDelays = []

for (let k = 0; k < 6; k += 1) {
  const degrees = 15 + k * 30
  const rest = Math.cos((degrees * Math.PI) / 180)

  meridians.push(
    `<ellipse class="mer m${k}" cx="${GLOBE_X}" cy="${GLOBE_Y}" rx="${GLOBE_R}" ry="${GLOBE_R}" transform="scale(${rest.toFixed(3)} 1)" vector-effect="non-scaling-stroke"/>`,
  )
  meridianDelays.push(`.m${k}{animation-delay:-${((degrees / 180) * SPIN_SECONDS).toFixed(2)}s}`)
}

const GLOBE = [
  `<ellipse class="g1" cx="${GLOBE_X}" cy="${GLOBE_Y - 40}" rx="520" ry="420" fill="url(#halo)"/>`,
  `<circle cx="${GLOBE_X}" cy="${GLOBE_Y}" r="${GLOBE_R}" fill="url(#body)"/>`,
  `<g fill="none" stroke="${CYAN}" stroke-opacity="0.5">`,
  `<circle cx="${GLOBE_X}" cy="${GLOBE_Y}" r="${GLOBE_R}" stroke-width="1.6"/>`,
  parallels.join(''),
  meridians.join(''),
  `<circle class="pulse" cx="${GLOBE_X}" cy="${GLOBE_Y}" r="${GLOBE_R}" opacity="0.15"/>`,
  `<circle class="pulse p2" cx="${GLOBE_X}" cy="${GLOBE_Y}" r="${GLOBE_R}" opacity="0.15"/>`,
  '</g>',
  `<ellipse class="orbit" cx="${GLOBE_X}" cy="${GLOBE_Y - 60}" rx="410" ry="70" transform="rotate(-14 ${GLOBE_X} ${GLOBE_Y - 60})" fill="none" stroke="${MAGENTA}" stroke-opacity="0.6" stroke-width="1.5" stroke-dasharray="4 16"/>`,
].join('')

// The far skyline: low where the globe rises, taller toward the edges.
const farParts = []
let farX = -10

while (farX < W) {
  const width = 28 + Math.floor(rand() * 46)
  const distance = Math.abs(farX + width / 2 - VANISH) / 800
  const height = Math.round((36 + 190 * distance) * (0.55 + rand() * 0.6))
  const top = HORIZON - height

  farParts.push(`<rect x="${farX}" y="${top}" width="${width}" height="${height}" fill="#0a0f1d"/>`)

  for (let i = 0; i < Math.floor(height / 24); i += 1) {
    if (rand() < 0.6) {
      farParts.push(
        `<rect x="${n1(farX + 4 + rand() * (width - 10))}" y="${n1(top + 6 + rand() * (height - 14))}" width="2" height="3" fill="${neon()}" opacity="0.4"/>`,
      )
    }
  }

  farX += width + Math.floor(rand() * 6)
}

// The elevated line and its train, between the far skyline and the towers.
const pylons = []

for (let x = 40; x < W; x += 160) {
  pylons.push(`<rect x="${x}" y="690" width="4" height="70" fill="#101a26"/>`)
}

const trainWindows = []

for (let i = 0; i < 11; i += 1) {
  trainWindows.push(`<rect x="${1050 + i * 13}" y="679" width="8" height="5" fill="#c8fbff" opacity="0.85"/>`)
}

const TRAIN = [
  `<rect x="0" y="688" width="${W}" height="3" fill="#16222f"/>`,
  pylons.join(''),
  '<g class="train">',
  `<rect x="1040" y="675" width="160" height="13" rx="4" fill="#0b131b" stroke="${CYAN}" stroke-opacity="0.55"/>`,
  trainWindows.join(''),
  `<rect x="1200" y="680" width="46" height="3" fill="url(#lamp)"/>`,
  '</g>',
].join('')

// [x, width, height]: the near towers, tall at the edges and stepping down to the street.
const TOWERS = [
  [0, 90, 470],
  [90, 70, 380],
  [160, 110, 520],
  [270, 60, 300],
  // The two roofs the fight stands on: the samurai's, then the ninja's a step higher.
  [330, 90, 360],
  [420, 70, 423],
  [490, 60, 150],
  [550, 50, 90],
  [1000, 50, 80],
  [1050, 70, 160],
  [1120, 80, 250],
  [1200, 60, 340],
  [1260, 110, 480],
  [1370, 60, 330],
  [1430, 60, 288],
  [1490, 70, 360],
  [1560, 40, 540],
]

const towerBodies = []
const beacons = []
// Windows: one still group and three that breathe at their own pace.
const windowGroups = [[], [], [], []]

for (const [x, w, h] of TOWERS) {
  const y = HORIZON - h

  towerBodies.push(
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#070d12" stroke="${CYAN}" stroke-opacity="0.26"/>`,
    `<line x1="${x + w - 1}" y1="${y}" x2="${x + w - 1}" y2="${HORIZON}" stroke="${MAGENTA}" stroke-opacity="0.3"/>`,
  )

  if (h >= 140) {
    for (let wy = y + 14; wy <= y + h - 18; wy += 18) {
      for (let wx = x + 10; wx + 6 <= x + w - 8; wx += 14) {
        if (rand() < 0.24) {
          const group = rand() < 0.3 ? 1 + Math.floor(rand() * 3) : 0

          windowGroups[group].push(`<rect x="${wx}" y="${wy}" width="6" height="9" fill="${neon()}" opacity="0.6"/>`)
        }
      }
    }
  }

  if (h >= 430) {
    const mid = x + w / 2

    towerBodies.push(`<line x1="${mid}" y1="${y}" x2="${mid}" y2="${y - 46}" stroke="${CYAN}" stroke-opacity="0.45"/>`)
    beacons.push(`<circle cx="${mid}" cy="${y - 48}" r="3" fill="#ff3355"/>`)
  }
}

const WINDOWS =
  `<g>${windowGroups[0].join('')}</g>` +
  [1, 2, 3].map(group => `<g class="tw${group}">${windowGroups[group].join('')}</g>`).join('') +
  `<g class="bl">${beacons.join('')}</g>`

// A sign of abstract strokes, never real letters, with its glow and its reflection on the floor.
const signs = []
const reflections = []

const reflectionOf = color => {
  if (color === CYAN) {
    return 'rc'
  }

  return color === MAGENTA ? 'rm' : 'ry'
}

const glyphSign = (x, y, w, h, color, pulse) => {
  const strokes = []

  for (let top = y + 5; top + w - 8 <= y + h - 4; top += w - 2) {
    strokes.push(`<rect x="${x + 3}" y="${top}" width="${w - 6}" height="2"/>`)
    strokes.push(`<rect x="${n1(x + 3 + rand() * (w - 8))}" y="${top}" width="2" height="${w - 8}"/>`)

    if (rand() < 0.6) {
      strokes.push(`<rect x="${x + 3}" y="${top + w - 10}" width="${n1((w - 6) * (0.5 + rand() * 0.5))}" height="2"/>`)
    }
  }

  signs.push(
    `<rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" fill="${color}" opacity="0.1"/>`,
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#05090b" stroke="${color}" stroke-opacity="0.9"/>`,
    `<g class="${pulse}" fill="${color}">${strokes.join('')}</g>`,
  )
  reflections.push(`<rect x="${x - 4}" y="${HORIZON}" width="${w + 8}" height="170" fill="url(#${reflectionOf(color)})"/>`)
}

const barSign = (x, y, w, h, color, pulse) => {
  signs.push(
    `<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" fill="${color}" opacity="0.12"/>`,
    `<rect class="${pulse}" x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="0.85"/>`,
  )
  reflections.push(`<rect x="${x - 4}" y="${HORIZON}" width="${w + 8}" height="150" fill="url(#${reflectionOf(color)})"/>`)
}

glyphSign(176, 290, 20, 130, MAGENTA, 'tw2')
glyphSign(1336, 320, 20, 150, CYAN, 'tw1')
glyphSign(44, 340, 18, 100, YELLOW, 'tw3')
glyphSign(1572, 262, 18, 110, MAGENTA, 'tw1')
barSign(1378, 450, 44, 8, YELLOW, 'tw3')
barSign(352, 470, 44, 8, CYAN, 'tw2')
barSign(1132, 560, 50, 8, MAGENTA, 'tw1')
barSign(432, 580, 40, 8, YELLOW, 'tw3')

// Two billboards on the left: one of level bars, one with a turning diamond.
const bars = []

for (let i = 0; i < 6; i += 1) {
  bars.push(`<rect class="eq e${i}" x="${418 + i * 13}" y="482" width="8" height="40" fill="${i % 2 === 0 ? CYAN : MAGENTA}" opacity="0.85"/>`)
}

const BILLBOARDS = [
  `<rect x="402" y="466" width="106" height="72" fill="${MAGENTA}" opacity="0.08"/>`,
  `<rect x="410" y="474" width="90" height="56" fill="#05090b" stroke="${MAGENTA}" stroke-opacity="0.9"/>`,
  bars.join(''),
  `<rect x="172" y="436" width="86" height="72" fill="${CYAN}" opacity="0.08"/>`,
  `<rect x="180" y="444" width="70" height="56" fill="#05090b" stroke="${CYAN}" stroke-opacity="0.9"/>`,
  `<path class="dia" d="M215 450L236 472L215 494L194 472Z M194 472H236 M215 450V494" fill="none" stroke="${CYAN}" stroke-width="1.5"/>`,
].join('')

// Two searchlights, each sweeping about the roof it stands on.
const BEAMS = [
  `<path class="b1" d="M300 460L225 -80H375Z" fill="url(#beam)" transform="rotate(-6)"/>`,
  `<path class="b2" d="M1230 420L1150 -140H1310Z" fill="url(#beam2)" transform="rotate(8)"/>`,
].join('')

// Traffic in the sky: each light rests on screen and loops from one side to the other.
const flyer = (pulse, x, y, length, color, gradient, forward) => {
  const head = forward ? x + length : x

  return (
    `<g class="${pulse}"><rect x="${x}" y="${y}" width="${length}" height="2" fill="url(#${gradient})"/>` +
    `<circle cx="${head}" cy="${y + 1}" r="2.4" fill="${color}"/></g>`
  )
}

// A car, nose to the right, drawn in a 200 by 42 box: its trail, its headlamp, then the body. Flying or on the road, the shell is the same.
const SHELL = [
  '<rect x="-120" y="29" width="130" height="3" fill="url(#tc)"/>',
  '<path d="M198 26L340 6V52Z" fill="url(#lamp)"/>',
  `<path d="M8 34L14 22L6 6L22 8L34 20L80 14L104 0H150L172 14L196 22L200 32L190 40H20Z" fill="#0a1118" stroke="${CYAN}" stroke-opacity="0.85" stroke-linejoin="round"/>`,
  `<path d="M86 14L106 3H148L164 14Z" fill="${CYAN}" fill-opacity="0.28" stroke="${CYAN}" stroke-opacity="0.9"/>`,
  `<path d="M127 3V14" fill="none" stroke="${CYAN}" stroke-opacity="0.6"/>`,
  `<path d="M24 30H188" fill="none" stroke="${MAGENTA}" stroke-width="2"/>`,
  '<rect x="8" y="24" width="7" height="7" fill="#ff3355"/>',
  '<circle cx="197" cy="27" r="3" fill="#eaffff"/>',
].join('')

// In the air it rides on two lifters and their wash.
const CAR =
  '<path class="bl" d="M36 44L22 96H78L64 44ZM146 44L132 96H188L174 44Z" fill="url(#rc)"/>' +
  SHELL +
  `<ellipse cx="50" cy="42" rx="16" ry="3.5" fill="${CYAN}" opacity="0.9"/><ellipse cx="160" cy="42" rx="16" ry="3.5" fill="${CYAN}" opacity="0.9"/>`

// On the road it has two wheels with lit hubs and a strip of light underneath.
const wheel = x =>
  `<circle cx="${x}" cy="40" r="9" fill="#05090b" stroke="${CYAN}" stroke-opacity="0.85"/><circle cx="${x}" cy="40" r="3" fill="${CYAN}"/>`

const ROADCAR = SHELL + `<rect x="62" y="46" width="84" height="3" fill="${MAGENTA}" opacity="0.6"/>` + wheel(48) + wheel(160)

// The near car crosses in front of the towers; a far one, half the size, goes the other way behind them.
const NEAR_CAR = `<g class="car"><g class="hover"><g transform="translate(0 262)">${CAR}</g></g></g>`

const TRAFFIC = [
  flyer('fa', 520, 150, 70, '#eaffff', 'tc', true),
  flyer('fb', 980, 215, 90, '#ffe9f6', 'tm', false),
  flyer('fc', 300, 300, 110, '#eaffff', 'tc', true),
  flyer('fd', 1180, 372, 60, '#fff6c9', 'ty', false),
  // A chase, far off and going the other way: a car running, and a patrol car behind it with its lights going.
  `<g class="car2" opacity="0.85"><g class="hover"><g transform="translate(-320 132) scale(-0.45 0.45)">${CAR}</g></g>` +
    `<g transform="translate(0 120) scale(-0.5 0.5)">${CAR}<rect class="pr" x="108" y="-7" width="16" height="7" fill="#ff3355"/><rect class="pb" x="130" y="-7" width="16" height="7" fill="#3d7bff"/></g></g>`,
].join('')

// Falling dashes at the far edges: the dash period is 18, so a shift of 180 loops.
const stream = x => `<line x1="${x}" y1="0" x2="${x}" y2="${HORIZON}"/>`

const STREAMS =
  `<g stroke="${GREEN}" stroke-opacity="0.42" stroke-width="2" stroke-dasharray="3 15">` +
  `<g class="s1">${[36, 128, 1530].map(stream).join('')}</g>` +
  `<g class="s2">${[72, 1478, 1574].map(stream).join('')}</g></g>`

// Floor lines, each one sliding to where the next one rests, so the loop has no seam.
const floorLines = []
const floorKeyframes = []
let lineY = HORIZON
let gap = 6

for (let k = 0; k < 8; k += 1) {
  floorLines.push(
    `<line class="f${k}" x1="0" y1="${n1(lineY)}" x2="${W}" y2="${n1(lineY)}" stroke="${MAGENTA}" stroke-opacity="${(0.24 + k * 0.08).toFixed(2)}"/>`,
  )
  floorKeyframes.push(`.f${k}{animation:f${k} 2.5s linear infinite}@keyframes f${k}{to{transform:translateY(${n1(gap)}px)}}`)
  lineY += gap
  gap *= 1.5
}

const floorRays = []

for (let i = -14; i <= 14; i += 1) {
  floorRays.push(
    `<line x1="${VANISH + i * 22}" y1="${HORIZON}" x2="${VANISH + i * 300}" y2="${H}" stroke="${Math.abs(i) < 2 ? CYAN : MAGENTA}" stroke-opacity="0.3"/>`,
  )
}

// The hacker: a little boxy orange creature in headphones, at home in its flat, facing us over a laptop while the city fights outside.
const ORANGE = '#ee7f45'
const ORANGE_TOP = '#ff9a5c'
const EYE = '#1a120e'
const GEAR = '#0c131a'

// An arm or a leg: a thick rounded stroke with a thin neon edge.
const limb = (d, width, color, edge, glow = CYAN) =>
  `<path d="${d}" fill="none" stroke="${glow}" stroke-opacity="${edge}" stroke-width="${width + 2}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`

const codeSpecs = []

for (let i = 0; i < 9; i += 1) {
  codeSpecs.push([Math.floor(rand() * 3) * 10, 18 + Math.floor(rand() * 56), rand() < 0.6 ? GREEN : neon()])
}

// The nine lines twice over, so a shift of their height loops with no seam.
const codeLines = []

for (let i = 0; i < 18; i += 1) {
  const [indent, width, color] = codeSpecs[i % 9]

  codeLines.push(`<rect x="${1298 + indent}" y="${724 + i * 10}" width="${width}" height="3" fill="${color}" opacity="0.9"/>`)
}

// The ninja: a woman on a rooftop across the street, blade held low, ponytail and scarf in the wind.
const SHADOW = '#0d141b'

// One piece of her dark suit, edged in neon.
const suit = d => `<path d="${d}" fill="${SHADOW}" stroke="${CYAN}" stroke-opacity="0.6" stroke-linejoin="round"/>`

const NINJA = [
  // Drawn 120 tall about the spot between her feet, then enlarged and set on the roof of the tower at x 1120.
  '<g transform="translate(1155 510) scale(1.3)"><g class="nj">',
  // The second sword across her back, then hair and scarf.
  '<path d="M16 -108L-10 -66" fill="none" stroke="#1b2733" stroke-width="4" stroke-linecap="round"/>',
  `<path d="M16 -108L21 -116" fill="none" stroke="${MAGENTA}" stroke-width="3.5" stroke-linecap="round"/>`,
  `<path class="sway" d="M4 -118C22 -128 36 -112 56 -120C44 -104 26 -106 6 -108Z" fill="${MAGENTA}" opacity="0.9"/>`,
  `<path class="sway sw2" d="M2 -99C24 -105 40 -89 70 -99L64 -89C42 -79 24 -93 2 -91Z" fill="${CYAN}" opacity="0.75"/>`,
  // The far arm and the far leg.
  limb('M9 -93L20 -80L14 -68', 6, SHADOW, 0.45),
  suit('M-2 -60L11 -62L22 -34L27 -5L21 -5L13 -32Z'),
  suit('M21 -5H31L34 0H21Z'),
  // The near leg, bent, and the straps.
  suit('M-11 -62L2 -60L-12 -33L-12 -5L-18 -5L-21 -35Z'),
  suit('M-25 0L-24 -5L-11 -5L-11 0Z'),
  `<path d="M-15 -47L-5 -45M-19 -20H-12M21 -20H26" fill="none" stroke="${MAGENTA}" stroke-width="2"/>`,
  // Shoulders, waist and hips, with a belt and a sash.
  suit('M-12 -97L10 -97L11 -85L6 -73L11 -60L-11 -60L-7 -73L-13 -85Z'),
  `<path d="M-9 -88H8" fill="none" stroke="${CYAN}" stroke-opacity="0.4"/>`,
  `<path d="M-7 -72H6" fill="none" stroke="${MAGENTA}" stroke-width="2.5"/>`,
  `<path d="M5 -71C14 -70 15 -58 23 -55" fill="none" stroke="${CYAN}" stroke-opacity="0.75" stroke-width="2.5" stroke-linecap="round"/>`,
  // The head: scarf at the neck, neon hair, a visor of light.
  `<path d="M-9 -101H8V-95H-9Z" fill="${CYAN}" opacity="0.75"/>`,
  `<ellipse cx="-2" cy="-109" rx="8.5" ry="10" fill="${SHADOW}" stroke="${CYAN}" stroke-opacity="0.6"/>`,
  `<path d="M-10.5 -112C-11 -124 7 -124 7 -111L4 -116C0 -120 -6 -119 -10.5 -112Z" fill="${MAGENTA}" opacity="0.9"/>`,
  `<rect x="-10.5" y="-112" width="12" height="3.5" rx="1.75" fill="${CYAN}"/>`,
  // The trail her blade's tip leaves through a cut, and the dust she raises when she lands.
  `<path class="trail" d="M-84 -143A88 88 0 0 0 -54 -17A120 120 0 0 1 -84 -143Z" fill="${CYAN}" fill-opacity="0.4" stroke="#eaffff" stroke-opacity="0.5" opacity="0"/>`,
  '<ellipse class="dust" cx="0" cy="0" rx="18" ry="3.5" fill="none" stroke="#a8dcff" stroke-opacity="0.7" stroke-width="2" opacity="0"/>',
  // The drawn blade, its glow breathing, and the arm that holds it: one group that swings about her shoulder.
  '<g class="slash">',
  `<path class="tw1" d="M-33 -72L-76 -38" fill="none" stroke="${CYAN}" stroke-opacity="0.3" stroke-width="7" stroke-linecap="round"/>`,
  '<path d="M-33 -72L-76 -38" fill="none" stroke="#eaffff" stroke-width="2" stroke-linecap="round"/>',
  `<path d="M-33 -72L-26 -77.6" fill="none" stroke="${MAGENTA}" stroke-width="3.5" stroke-linecap="round"/>`,
  `<path d="M-38.5 -76L-33.5 -70" fill="none" stroke="${CYAN}" stroke-width="2.5" stroke-linecap="round"/>`,
  limb('M-11 -94L-23 -83L-31 -74', 6, SHADOW, 0.5),
  `<path d="M-15 -98L-6 -99L-7 -91L-15 -92Z" fill="#1b2733" stroke="${MAGENTA}" stroke-opacity="0.8" stroke-linejoin="round"/>`,
  // A spark on the blade itself, so it flashes wherever she is when steel or a shot meets it.
  `<g class="spark" opacity="0"><circle cx="-46" cy="-62" r="5" fill="#eaffff"/><path d="M-46 -62l-12 -12M-46 -62l13 -10M-46 -62l-15 3M-46 -62l12 9M-46 -62l-2 -16" fill="none" stroke="${YELLOW}" stroke-width="2" stroke-linecap="round"/></g>`,
  '</g>',
  '</g></g>',
].join('')

// Her opponent: a combat robot hovering over the street, a cannon for an arm, edged in red.
const RED = '#ff3355'

const plate = d => `<path d="${d}" fill="#11161d" stroke="${RED}" stroke-opacity="0.85" stroke-linejoin="round"/>`

const ROBOT = [
  // Drawn about its middle, then enlarged and hung in the air to her left.
  '<g class="hover"><g class="rb"><g transform="translate(900 400) scale(1.2)">',
  `<path class="flick" d="M-9 36L0 66L9 36Z" fill="${YELLOW}" opacity="0.85"/><path class="flick" d="M-4 36L0 52L4 36Z" fill="#eaffff"/>`,
  plate('M-30 -12L-22 -12L-24 8L-34 24L-40 20L-32 6Z'),
  plate('M-13 18H13L7 36H-7Z'),
  plate('M-22 -16H22L28 2L14 20H-14L-28 2Z'),
  `<circle cx="0" cy="1" r="9" fill="none" stroke="${RED}" stroke-opacity="0.5"/><circle class="charge" cx="0" cy="1" r="6" fill="${RED}"/>`,
  `<path d="M-18 -9H-8M8 -9H18" fill="none" stroke="${YELLOW}" stroke-opacity="0.7" stroke-width="2"/>`,
  plate('M-12 -36H10L15 -20H-15Z'),
  `<rect x="0" y="-31" width="12" height="4" fill="${RED}"/>`,
  `<path d="M-8 -36L-13 -50" fill="none" stroke="${RED}" stroke-opacity="0.85" stroke-width="1.5"/><circle class="bl" cx="-13" cy="-51" r="2.5" fill="${YELLOW}"/>`,
  plate('M14 -21H30L32 -9H16Z'),
  plate('M20 -12L50 -11L50 -3L20 -2Z'),
  `<rect x="48" y="-13" width="4" height="12" fill="${YELLOW}" opacity="0.85"/>`,
  // Its shots ride along the barrel wherever it flies: a beam that just reaches her blade from its post, a bolt that
  // flies on, and the sparks where she hits it.
  `<g class="laser" opacity="0"><path d="M52 -7H150" fill="none" stroke="${RED}" stroke-opacity="0.35" stroke-width="8" stroke-linecap="round"/><path d="M52 -7H150" fill="none" stroke="#ffd9e0" stroke-width="2" stroke-linecap="round"/></g>`,
  `<g class="muzzle" opacity="0"><circle cx="55" cy="-7" r="8" fill="${YELLOW}" opacity="0.45"/><path d="M55 -7l13 -7M55 -7h16M55 -7l13 7" fill="none" stroke="#fff6cc" stroke-width="2" stroke-linecap="round"/></g>`,
  `<g class="pew" opacity="0"><path d="M52 -7h20" fill="none" stroke="${RED}" stroke-opacity="0.4" stroke-width="8" stroke-linecap="round"/><path d="M52 -7h20" fill="none" stroke="#ffd9e0" stroke-width="2.5" stroke-linecap="round"/></g>`,
  `<path class="hit" d="M0 0L-18 -15M0 0L-23 2M0 0L-15 17M0 0L8 -22M0 0L12 19" fill="none" stroke="${YELLOW}" stroke-width="2.5" stroke-linecap="round" opacity="0"/>`,
  '</g></g></g>',
].join('')

// The light of the hits on the roofs around them, drawn behind the fighters.
const GLARE = `<ellipse class="glare" cx="900" cy="400" rx="380" ry="330" fill="url(#blast)" opacity="0"/>`

// What flies between them: the wave of her cut, the beam she turns down onto the samurai, and the burst at the end.
const FIGHT = [
  `<path class="arc" d="M1030 312Q985 385 1064 468Q1010 388 1030 312Z" fill="${CYAN}" opacity="0"/>`,
  `<g class="ray" opacity="0"><path d="M1079 391L1075 520" fill="none" stroke="${RED}" stroke-opacity="0.35" stroke-width="9" stroke-linecap="round"/><path d="M1079 391L1075 520" fill="none" stroke="#ffd9e0" stroke-width="2.5" stroke-linecap="round"/></g>`,
  `<circle class="boom" cx="900" cy="400" r="46" fill="${RED}" fill-opacity="0.35" stroke="${YELLOW}" stroke-width="6" opacity="0"/>`,
].join('')

// A second opponent on the roof below her: a samurai robot holding a red blade over its head, where her blade lands.
const SAMURAI = [
  // The inner group is the one the story moves: he drops in from above and leaps away at the end.
  '<g transform="translate(1075 600) scale(1.1)"><g class="sm">',
  plate('M-12 -50L-2 -50L-8 -26L-10 -4L-17 -4L-18 -28Z'),
  plate('M-20 0L-19 -4L-7 -4L-7 0Z'),
  plate('M0 -50L11 -50L16 -26L20 -4L13 -4L8 -26Z'),
  plate('M13 -4H23L26 0H13Z'),
  plate('M-13 -84H13L15 -68L9 -50H-11L-15 -68Z'),
  plate('M-13 -52L-16 -38L-6 -38L-4 -52Z'),
  plate('M3 -52L5 -38L15 -38L12 -52Z'),
  `<rect class="charge" x="-4" y="-76" width="8" height="8" fill="${RED}"/>`,
  plate('M-8 -104H8L10 -90H-10Z'),
  `<path d="M-9 -103L-16 -116L-4 -106ZM9 -103L16 -116L4 -106Z" fill="${YELLOW}" opacity="0.9"/>`,
  `<rect x="-2" y="-99" width="10" height="3" fill="${RED}"/>`,
  // The trail of his chop, and the dust where he lands.
  `<path class="strail" d="M9 -133A50 50 0 0 1 49 -75A70 70 0 0 0 9 -133Z" fill="${RED}" fill-opacity="0.45" stroke="#ffd9e0" stroke-opacity="0.5" opacity="0"/>`,
  '<ellipse class="sdust" cx="0" cy="0" rx="20" ry="3.5" fill="none" stroke="#a8dcff" stroke-opacity="0.7" stroke-width="2" opacity="0"/>',
  // Both arms up and the blade across: one group that swings about the shoulders to chop.
  '<g class="sam">',
  limb('M-14 -82L-24 -100L-18 -122', 6, '#11161d', 0.7, RED),
  limb('M14 -82L24 -100L16 -121', 6, '#11161d', 0.7, RED),
  `<path class="tw1" d="M-36 -126L18 -122" fill="none" stroke="${RED}" stroke-opacity="0.4" stroke-width="8" stroke-linecap="round"/>`,
  '<path d="M-36 -126L18 -122" fill="none" stroke="#ffd9e0" stroke-width="2.2" stroke-linecap="round"/>',
  `<path d="M16 -122L32 -121" fill="none" stroke="${YELLOW}" stroke-width="3.5" stroke-linecap="round"/>`,
  '</g>',
  plate('M-22 -86L-10 -88L-10 -74L-20 -72Z'),
  plate('M10 -88L22 -86L20 -72L10 -74Z'),
  // Sparks on his chest when her blade or a turned shot gets through.
  `<path class="hurt" d="M0 -70l-14 -12M0 -70l16 -10M0 -70l-17 4M0 -70l15 10M0 -70l-3 -18" fill="none" stroke="${YELLOW}" stroke-width="2.2" stroke-linecap="round" opacity="0"/>`,
  '</g></g>',
].join('')

// A whale of light swimming slowly between the towers, its flukes beating.
const WHALE = [
  `<g class="whale"><g class="hover"><g transform="translate(0 290)" fill="${CYAN}" fill-opacity="0.1" stroke="${CYAN}" stroke-opacity="0.7" stroke-width="1.5" stroke-linejoin="round">`,
  '<path class="fluke" d="M-166 0L-216 -36Q-200 -8 -204 0Q-200 8 -218 34Z"/>',
  '<path d="M-170 0C-120 -50 20 -70 120 -40C160 -28 178 -8 180 6C176 22 150 34 100 38C10 46 -100 34 -170 0Z"/>',
  '<path d="M60 32L22 76Q54 62 86 34Z"/>',
  `<path d="M30 30Q105 24 166 14M52 40Q110 34 150 26M-150 -2Q-60 -40 60 -44" fill="none" stroke="${MAGENTA}" stroke-opacity="0.5" stroke-width="1"/>`,
  '<circle cx="142" cy="-6" r="3" fill="#eaffff" fill-opacity="1" stroke="none"/>',
  '</g></g></g>',
].join('')

// A swarm of small drones in a wedge, each sweeping the roofs with a light.
const drone = (x, y) =>
  `<g transform="translate(${x} ${y})"><path class="bl" d="M0 3L-9 46H9Z" fill="url(#rc)"/>` +
  `<path d="M-9 0H9M-9 -3V2M9 -3V2" fill="none" stroke="${CYAN}" stroke-opacity="0.8" stroke-width="1.5"/>` +
  `<rect x="-4" y="-2" width="8" height="5" fill="#0a1118" stroke="${CYAN}" stroke-opacity="0.8"/><circle cx="0" cy="4" r="1.6" fill="${RED}"/></g>`

const WEDGE = [
  [0, 0],
  [30, -14],
  [30, 14],
  [60, -28],
  [60, 28],
  [90, -42],
  [90, 42],
]

const DRONES = `<g class="swarm"><g class="hover">${WEDGE.map(([x, y]) => drone(x, 200 + y)).join('')}</g></g>`

// A storm behind the city: two bolts, each with a faint flash of the whole sky, on their own clocks.
const bolt = (extra, d) =>
  `<rect class="fl${extra}" width="${W}" height="${HORIZON}" fill="#bcd8ff" opacity="0"/>` +
  `<path class="bolt${extra}" d="${d}" fill="none" stroke="#eaf4ff" stroke-width="2.5" stroke-linejoin="round" opacity="0"/>`

const STORM =
  bolt('', 'M420 0L400 90L436 150L404 250L440 320L424 400M436 150L470 210L460 262') +
  bolt(' bo2', 'M1090 0L1110 80L1076 160L1104 240L1088 330M1076 160L1040 214L1052 262')

// A string of coloured lights under the sloping ceiling of the flat, in three groups that twinkle apart.
const SLOPE = 38 / 300
const lightGroups = [[], [], []]
const wire = []

for (let i = 0; i < 10; i += 1) {
  const x = 1316 + i * 30
  const y = n1(612 + (x - 1300) * SLOPE + (i % 2 === 0 ? 7 : 11))

  wire.push(`${i === 0 ? 'M' : 'L'}${x} ${y}`)
  lightGroups[i % 3].push(`<circle cx="${x}" cy="${y}" r="2.6" fill="${[CYAN, MAGENTA, YELLOW, GREEN][i % 4]}"/>`)
}

const LIGHTS =
  `<path d="${wire.join('')}" fill="none" stroke="#1b2733"/>` +
  lightGroups.map((group, index) => `<g class="tw${index + 1}">${group.join('')}</g>`).join('')

const HACKER = [
  // Its home: a flat over a shop on the corner, cut open so we see in. Drawn at this size, then enlarged about the right edge
  // and lifted, so the shop below stands a full storey over the pavement.
  `<g transform="translate(${W} 918) scale(1.4) translate(-${W} -${H})">`,
  // The shop under the floor: awning, a lit window, a door, a sign of abstract strokes.
  '<path d="M1288 1000V880H1600V1000Z" fill="#04070a"/>',
  `<rect x="1304" y="884" width="296" height="12" fill="${MAGENTA}" opacity="0.45"/>`,
  `<path d="M1304 890H1600" fill="none" stroke="${CYAN}" stroke-opacity="0.4" stroke-width="12" stroke-dasharray="14 14"/>`,
  `<rect x="1316" y="904" width="130" height="58" fill="${YELLOW}" fill-opacity="0.2" stroke="${YELLOW}" stroke-opacity="0.7"/>`,
  `<path d="M1316 944H1446M1340 904V916M1381 904V920M1422 904V914" fill="none" stroke="${YELLOW}" stroke-opacity="0.6"/>`,
  `<circle cx="1340" cy="919" r="3" fill="${MAGENTA}"/><circle cx="1381" cy="923" r="3" fill="${CYAN}"/><circle cx="1422" cy="917" r="3" fill="${MAGENTA}"/>`,
  `<rect x="1460" y="900" width="32" height="74" fill="#0c131a" stroke="${CYAN}" stroke-opacity="0.7"/>`,
  `<rect x="1466" y="908" width="20" height="24" fill="${CYAN}" fill-opacity="0.12" stroke="${CYAN}" stroke-opacity="0.5"/>`,
  `<rect x="1506" y="930" width="84" height="32" fill="${CYAN}" fill-opacity="0.1" stroke="${CYAN}" stroke-opacity="0.6"/>`,
  `<path class="tw2" d="M1506 902H1526V905H1506ZM1512 902H1515V920H1512ZM1534 902H1537V920H1534ZM1534 911H1550V914H1534ZM1558 902H1576V905H1558ZM1558 902H1561V920H1558ZM1558 917H1576V920H1558Z" fill="${MAGENTA}"/>`,
  // A balcony on the street side, with a rail, a plant and a hanging sign.
  `<path d="M1240 880H1300V888H1240Z" fill="#04070a" stroke="${CYAN}" stroke-opacity="0.6"/>`,
  `<path d="M1257 862Q1244 846 1248 830Q1258 844 1257 862ZM1257 862Q1270 844 1266 826Q1256 842 1257 862Z" fill="${GREEN}" opacity="0.7"/>`,
  `<path d="M1248 862H1266L1264 880H1250Z" fill="#1b2733" stroke="${CYAN}" stroke-opacity="0.5"/>`,
  `<path d="M1242 880V840H1296M1256 840V880M1270 840V880M1284 840V880" fill="none" stroke="${MAGENTA}" stroke-opacity="0.85" stroke-width="1.5"/>`,
  `<rect x="1264" y="690" width="18" height="100" fill="#05090b" stroke="${YELLOW}" stroke-opacity="0.9"/>`,
  `<path class="tw3" d="M1268 698H1278V701H1268ZM1272 698H1275V716H1272ZM1268 726H1278V729H1268ZM1268 726H1271V744H1268ZM1268 741H1278V744H1268ZM1268 756H1278V759H1268ZM1275 756H1278V780H1275Z" fill="${YELLOW}"/>`,
  // The back wall under a sloping roof, with an arched window cut through it.
  '<path fill-rule="evenodd" d="M1300 612L1600 650V880H1300ZM1316 800V716a40 40 0 0 1 80 0V800Z" fill="#111a24"/>',
  `<path d="M1316 800V716a40 40 0 0 1 80 0V800Z" fill="${CYAN}" fill-opacity="0.05" stroke="${CYAN}" stroke-opacity="0.8" stroke-width="1.5"/>`,
  `<path d="M1356 676V800M1316 740H1396" fill="none" stroke="${CYAN}" stroke-opacity="0.5"/>`,
  '<rect x="1312" y="800" width="88" height="4" fill="#1b2733"/>',
  '<rect x="1288" y="609" width="12" height="271" fill="#04070a"/>',
  `<path d="M1288 880V610M1240 880H1600" fill="none" stroke="${CYAN}" stroke-opacity="0.6" stroke-width="1.5"/>`,
  '<path d="M1300 872H1600" fill="none" stroke="#1b2733" stroke-width="2"/>',
  // The roof: a slab that overhangs the balcony, with a dish, an aerial and a chimney breathing steam.
  `<path d="M1276 597L1600 638V650L1276 609Z" fill="#04070a" stroke="${CYAN}" stroke-opacity="0.6"/>`,
  `<path d="M1276 609L1600 650" fill="none" stroke="${MAGENTA}" stroke-opacity="0.8" stroke-width="1.5"/>`,
  `<path d="M1332 590V603" fill="none" stroke="${CYAN}" stroke-opacity="0.7"/><ellipse cx="1332" cy="586" rx="14" ry="6" transform="rotate(-25 1332 586)" fill="#0c131a" stroke="${CYAN}" stroke-opacity="0.8"/>`,
  `<path d="M1372 609V568" fill="none" stroke="${CYAN}" stroke-opacity="0.7"/><circle class="bl" cx="1372" cy="566" r="2.5" fill="${MAGENTA}"/>`,
  `<path d="M1438 596H1456V620H1438Z" fill="#0c131a" stroke="${CYAN}" stroke-opacity="0.6"/>`,
  '<g fill="none" stroke="#a8dcff" stroke-width="1.5" stroke-linecap="round">',
  '<path class="steam" d="M1444 590Q1440 584 1444 578Q1448 572 1444 566"/><path class="steam st2" d="M1450 590Q1446 584 1450 578Q1454 572 1450 566"/>',
  '</g>',
  // Inside: the string of lights, a floor lamp and its warm light, a rug.
  LIGHTS,
  '<ellipse cx="1584" cy="812" rx="90" ry="76" fill="url(#gw)"/>',
  '<path d="M1586 880V812" fill="none" stroke="#1b2733" stroke-width="3"/>',
  `<path d="M1574 812L1579 792H1593L1598 812Z" fill="${YELLOW}" opacity="0.85"/>`,
  `<ellipse cx="1500" cy="878" rx="92" ry="4" fill="${MAGENTA}" opacity="0.25"/>`,
  // A sofa under the window with a cat asleep on it, a plant, and a mug steaming on the sill.
  `<rect x="1310" y="826" width="88" height="32" rx="8" fill="#16202b" stroke="${MAGENTA}" stroke-opacity="0.6"/>`,
  `<rect x="1306" y="850" width="96" height="30" rx="8" fill="#16202b" stroke="${MAGENTA}" stroke-opacity="0.6"/>`,
  `<rect x="1302" y="838" width="12" height="42" rx="6" fill="#1b2733" stroke="${MAGENTA}" stroke-opacity="0.6"/><rect x="1394" y="838" width="12" height="42" rx="6" fill="#1b2733" stroke="${MAGENTA}" stroke-opacity="0.6"/>`,
  `<rect x="1318" y="832" width="20" height="18" rx="4" fill="${MAGENTA}" opacity="0.5"/>`,
  `<g fill="#243140" stroke="${YELLOW}" stroke-opacity="0.7"><path d="M1352 846Q1344 846 1346 838" fill="none"/><ellipse cx="1366" cy="843" rx="14" ry="7"/><path d="M1377 836L1378 829L1382 834ZM1382 834L1386 829L1386 837Z"/><circle cx="1381" cy="840" r="5.5"/></g>`,
  `<path d="M1420 862Q1410 848 1413 834Q1421 846 1420 862ZM1420 862Q1430 848 1427 832Q1419 846 1420 862Z" fill="${GREEN}" opacity="0.7"/>`,
  `<path d="M1413 862H1427L1425 880H1415Z" fill="#1b2733" stroke="${CYAN}" stroke-opacity="0.5"/>`,
  '<g transform="translate(24 -80)">',
  `<rect x="1300" y="864" width="14" height="16" rx="2" fill="#0c131a" stroke="${CYAN}" stroke-opacity="0.7"/>`,
  `<path d="M1314 868H1319V876H1314" fill="none" stroke="${CYAN}" stroke-opacity="0.7"/>`,
  '<g fill="none" stroke="#a8dcff" stroke-width="1.5" stroke-linecap="round">',
  '<path class="steam" d="M1304 858Q1300 852 1304 846Q1308 840 1304 834"/><path class="steam st2" d="M1310 858Q1306 852 1310 846Q1314 840 1310 834"/>',
  '</g></g>',
  // On the wall, a screen with its code scrolling.
  '<g transform="translate(114 -60)"><g class="hover">',
  `<rect x="1282" y="708" width="128" height="116" fill="${CYAN}" opacity="0.06"/>`,
  `<rect x="1290" y="716" width="112" height="100" fill="#031014" fill-opacity="0.85" stroke="${CYAN}" stroke-opacity="0.95"/>`,
  `<g clip-path="url(#screen)"><g class="code">${codeLines.join('')}</g></g>`,
  `<rect class="cur" x="1384" y="800" width="7" height="9" fill="${CYAN}"/>`,
  '</g></g>',
  // Two more panels beside it: a loading bar and a lock that has opened.
  '<g transform="translate(4 -30)"><g class="hover h2">',
  `<rect x="1518" y="690" width="74" height="40" fill="#031014" fill-opacity="0.85" stroke="${CYAN}" stroke-opacity="0.9"/>`,
  `<path d="M1526 700H1532M1536 700H1542M1546 700H1560" fill="none" stroke="${CYAN}" stroke-width="3"/>`,
  `<rect x="1526" y="712" width="58" height="8" fill="none" stroke="${CYAN}" stroke-opacity="0.6"/>`,
  `<rect class="load" x="1527" y="713" width="56" height="6" fill="${CYAN}"/>`,
  `<rect x="1518" y="742" width="74" height="52" fill="#031014" fill-opacity="0.85" stroke="${CYAN}" stroke-opacity="0.6"/>`,
  // The lock: shut and red while the bar fills, then open and green when the story ends.
  `<g class="lk0"><rect x="1530" y="766" width="22" height="17" rx="2" fill="${RED}"/>`,
  `<path d="M1534 766V759a7 7 0 0 1 14 0V766" fill="none" stroke="${RED}" stroke-width="3"/>`,
  `<path d="M1562 758H1584M1562 768H1578M1562 778H1584" fill="none" stroke="${RED}" stroke-width="3"/></g>`,
  `<g class="lk1" opacity="0"><rect x="1530" y="766" width="22" height="17" rx="2" fill="${GREEN}"/>`,
  `<path d="M1534 766V759a7 7 0 0 1 14 0" fill="none" stroke="${GREEN}" stroke-width="3"/>`,
  `<path d="M1562 758H1584M1562 768H1578M1562 778H1584" fill="none" stroke="${GREEN}" stroke-width="3"/></g>`,
  '</g></g>',
  // The creature at its desk, moved along the room as one piece and kept small: it stands about 48 tall against the
  // walkers' 115, since a block as wide as it is tall reads as far bigger than a slim walker of the same height.
  '<g transform="translate(1490 880) scale(0.32) translate(-1450 -880)">',
  // Facing us: one boxy orange block on four short legs, enlarged about the spot where it stands.
  '<g transform="translate(1450 880) scale(1.3) translate(-1450 -880)"><g class="joy">',
  `<path d="M1414 858H1423V880H1414ZM1427 858H1436V880H1427ZM1464 858H1473V880H1464ZM1477 858H1486V880H1477Z" fill="${ORANGE}"/>`,
  '<rect x="1408" y="858" width="84" height="4" fill="#000000" opacity="0.3"/>',
  // Everything over the legs nods along to the music in its headphones.
  '<g class="bop">',
  `<path d="M1408 806L1415 798H1485L1492 806Z" fill="${ORANGE_TOP}"/>`,
  '<rect x="1408" y="806" width="84" height="52" fill="url(#face)"/>',
  `<path d="M1408 806V858M1492 806V858" fill="none" stroke="${CYAN}" stroke-opacity="0.5" stroke-width="1.2"/>`,
  // Two short arms that tap in turn, and two tall dark eyes that catch the laptop's light, blink, and glance out of the
  // window at the fight when it gets loud.
  `<rect class="type" x="1394" y="836" width="14" height="14" fill="${ORANGE}"/><rect class="type ty2" x="1492" y="836" width="14" height="14" fill="${ORANGE}"/>`,
  `<g class="look"><g class="blink"><path d="M1427 817H1435V835H1427ZM1465 817H1473V835H1465Z" fill="${EYE}"/><path d="M1427 832H1435V835H1427ZM1465 832H1473V835H1465Z" fill="${CYAN}" opacity="0.85"/></g></g>`,
  // Headphones over the top.
  `<path d="M1403 812V797H1497V812" fill="none" stroke="${GEAR}" stroke-width="5" stroke-linejoin="round"/>`,
  `<path d="M1407 797H1493" fill="none" stroke="${CYAN}" stroke-opacity="0.8"/>`,
  `<rect x="1398" y="810" width="11" height="22" rx="3" fill="${GEAR}" stroke="${CYAN}" stroke-opacity="0.9"/><rect x="1491" y="810" width="11" height="22" rx="3" fill="${GEAR}" stroke="${CYAN}" stroke-opacity="0.9"/>`,
  '</g></g></g>',
  // In front of it: the laptop's light on its face, the lid with its back to us, and a desk of light.
  '<ellipse cx="1450" cy="846" rx="50" ry="20" fill="url(#gc)"/>',
  `<path d="M1425 851L1428 832H1472L1475 851Z" fill="${GEAR}" stroke="${CYAN}" stroke-opacity="0.9" stroke-linejoin="round"/>`,
  '<path d="M1429 832H1471" fill="none" stroke="#eaffff" stroke-opacity="0.7"/>',
  `<path class="tw1" d="M1450 837L1455 842L1450 847L1445 842Z" fill="${CYAN}"/>`,
  `<rect x="1419" y="851" width="62" height="4" fill="#1b2733" stroke="${CYAN}" stroke-opacity="0.6"/>`,
  '<rect x="1376" y="857" width="142" height="20" fill="url(#rc)"/>',
  `<path d="M1376 857H1518" fill="none" stroke="${CYAN}" stroke-opacity="0.9" stroke-width="2.5"/>`,
  '</g>',
  '</g>',
].join('')

// The street in front of everything: a pavement with lamps and people walking, and a wet road with cars.
const lamp = (x, index) =>
  `<path d="M${x - 40} 884L${x + 34} 698L${x + 108} 884Z" fill="url(#${index % 2 === 0 ? 'rc' : 'rm'})"/>` +
  `<rect x="${x - 10}" y="915" width="90" height="85" fill="url(#${index % 2 === 0 ? 'rc' : 'rm'})" opacity="0.6"/>` +
  `<path d="M${x} 884V716Q${x} 694 ${x + 20} 694H${x + 34}" fill="none" stroke="#1b2733" stroke-width="5"/>` +
  `<rect x="${x + 24}" y="692" width="22" height="6" fill="#eaffff"/>`

// One walker, drawn about the spot under their feet: two legs that swing, and over them a coat, a head with a visor and
// for some an umbrella, rising a little with each step. Those with umbrellas step a beat apart from the others.
const person = ([x, size, accent, umbrella]) =>
  `<g transform="translate(${x} 910) scale(${n1(size * 2.1)})">` +
  `<g fill="none" stroke="${accent}" stroke-opacity="0.75" stroke-width="2.6" stroke-linecap="round"><path class="leg${umbrella ? ' dl' : ''}" d="M-2 -22L-2 0"/><path class="leg lg2${umbrella ? ' dl' : ''}" d="M2 -22L2 0"/></g>` +
  `<g class="bob${umbrella ? ' dl' : ''}">` +
  (umbrella
    ? `<path d="M6 -58V-34" fill="none" stroke="${accent}" stroke-opacity="0.7"/><path d="M-16 -58Q4 -86 26 -58Z" fill="#0c131a" stroke="${accent}" stroke-opacity="0.9"/>`
    : '') +
  `<path d="M-7 -44H7L9 -20H-9Z" fill="#0d141b" stroke="${accent}" stroke-opacity="0.6" stroke-linejoin="round"/>` +
  `<circle cx="0" cy="-50" r="5.5" fill="#0d141b" stroke="${accent}" stroke-opacity="0.6"/><rect x="-4" y="-52" width="8" height="2.5" fill="${accent}"/></g></g>`

// Each walker is drawn twice, one screen apart, so a shift of one screen loops with no seam.
const EASTBOUND = [
  [120, 0.95, CYAN, true],
  [640, 1.05, YELLOW, false],
  [1130, 0.9, MAGENTA, true],
]

const WESTBOUND = [
  [300, 1, GREEN, false],
  [820, 0.92, MAGENTA, true],
  [1380, 1.08, CYAN, false],
]

const twice = (walkers, shift) => walkers.map(walker => person(walker) + person([walker[0] + shift, ...walker.slice(1)])).join('')

const STREET = [
  // The nearest plane: people stand about 115 tall here, a storey is about 130, and the cars grow lane by lane toward us.
  `<rect x="0" y="880" width="${W}" height="120" fill="#06090d"/>`,
  `<rect x="0" y="880" width="${W}" height="35" fill="#0c1219"/>`,
  [70, 330, 590, 850, 1090].map(lamp).join(''),
  `<path d="M0 880H${W}" fill="none" stroke="${CYAN}" stroke-opacity="0.5"/>`,
  `<path d="M0 915H${W}" fill="none" stroke="${MAGENTA}" stroke-opacity="0.85" stroke-width="2"/>`,
  `<path d="M0 960H${W}" fill="none" stroke="${YELLOW}" stroke-opacity="0.6" stroke-width="3" stroke-dasharray="60 44"/>`,
  `<g class="wr">${twice(EASTBOUND, -W)}</g>`,
  `<g class="wl">${twice(WESTBOUND, W)}</g>`,
  `<g class="gc2"><g transform="translate(0 896) scale(-1.2 1.2)">${ROADCAR}</g></g>`,
  `<g class="gc1"><g transform="translate(0 911) scale(1.4)">${ROADCAR}</g></g>`,
  `<g class="gc3"><g transform="translate(0 926) scale(-1.6 1.6)">${ROADCAR}</g></g>`,
].join('')

// The story: one minute, written in seconds, that ends exactly where it starts. Every looping part of the scene runs on
// a length that divides the minute, so the whole picture repeats with no seam.
const LOOP = 60
const at = seconds => `${Number(((seconds / LOOP) * 100).toFixed(2))}%`

// Keyframes from [seconds, declarations] stops.
const story = (name, stops) => `@keyframes ${name}{${stops.map(([seconds, css]) => `${at(seconds)}{${css}}`).join('')}}`

const turn = degrees => `transform:rotate(${degrees}deg)`
const move = (x, y) => `transform:translate(${x}px,${y}px)`
const show = value => `opacity:${value}`

// Leaps arc: a stop marked 'o' starts a rise fast and slows to the top, one marked 'i' falls from the top and speeds up.
const EASE = { o: ';animation-timing-function:ease-out', i: ';animation-timing-function:ease-in' }

// A body's stop from [seconds, x, y, degrees, ease, opacity]: where it is, how far it has turned (a whole flip is 360),
// and, for those that come and go, whether it is seen.
const pose = ([seconds, x, y, degrees = 0, ease = '', opacity]) => [
  seconds,
  `transform:translate(${x}px,${y}px) rotate(${degrees}deg)${opacity === undefined ? '' : `;opacity:${opacity}`}${EASE[ease] || ''}`,
]

// A spark at each time: off just before, lit, then gone.
const sparks = (times, length) => [
  [0, show(0)],
  ...times.flatMap(time => [[time - 0.04, show(0)], [time, show(1)], [time + length, show(0)]]),
  [LOOP, show(0)],
]

// Something thrown, from [seconds, x, y, opacity] stops.
const thrown = stops => stops.map(([seconds, x, y, opacity]) => [seconds, `transform:translate(${x}px,${y}px);opacity:${opacity}`])

// Dust where someone lands: a ring that spreads and fades.
const RESTING = 'transform:scale(.4);opacity:0'
const puffs = times => [
  [0, RESTING],
  ...times.flatMap(time => [[time - 0.02, RESTING], [time, 'transform:scale(.5);opacity:1'], [time + 0.45, 'transform:scale(1.8);opacity:0']]),
  [LOOP, RESTING],
]

// A trail lit through the end of each swing: it shows just before the blade arrives and fades after.
const trails = times => sparks(times.map(time => time - 0.08), 0.22)

// Act three is a fight in eight beats, 23s to 47s, each one a different move:
//  1. 23.7  the samurai leaps up at her roof and she parries;
//  2. 26.5  the robot's beam: she blocks it, leaps, and sends the wave of her cut back into it;
//  3. 29.8  the robot climbs and fires twice: she backflips over the first bolt and swats the second;
//  4. 32.0  she flips down onto the samurai's roof: cut, parry, cut, ducks his lunge, spin cut, and flips back up;
//  5. 37.0  he leaps again: she parries and kicks him down, then turns the robot's beam onto him;
//  6. 39.8  a spin and two waves: the robot dodges the first and takes the second;
//  7. 42.8  a volley of three bolts, each one swatted, the robot bobbing between them;
//  8. 44.6  she crouches with the blade back, dives over the robot and cuts through it, and backflips home as it blows.

// The robot, in the fight's units about its own middle: away, flying in, at its post, moving between beats, then at 46s
// switched off and falling behind the street.
const RB = [
  [0, -600, -300, 0, '', 0], [18, -600, -300, 0, '', 0], [18.05, -600, -300, 0, '', 1], [23, 0, 0, 0, '', 1],
  [27.96, 0, 0], [28.08, -16, 4, -10], [29, 0, 0],
  [29.8, -30, -55, 12], [31.8, -30, -55, 12], [33.2, -10, -80, -4], [34.6, -45, -25, 4], [36, 0, 0],
  [40.4, 0, 0], [40.62, 10, -60, -10], [41.38, 10, -60, -10], [41.5, -6, -54, -22], [41.9, 6, -58, -6], [42.4, 0, 0],
  [42.95, 0, 0], [43.2, 0, -25], [43.65, 0, -25], [43.9, 0, 0],
  [45.84, 0, 0], [46.08, -16, 4, -10], [46.7, -24, 10, -18], [49.4, -90, 780, -170, '', 1], [49.5, -90, 780, -170, '', 0],
  [LOOP, -600, -300, 0, '', 0],
]

// The ninja, in her own units, turning about her waist: a backflip turns her forward (she faces left), a front flip back.
// L is her spot on the samurai's roof.
const LX = -33
const LY = 69
const NJ = [
  [0, 0, 0],
  // Act one: alone on her roof she runs through a kata, then crouches to watch the drones go over.
  [3, 0, 0], [3.5, 0, 3], [4.05, -6, 0], [4.6, -6, 0], [5.05, 4, -2], [5.8, 0, 0],
  [12, 0, 0], [12.5, 0, 7], [16, 0, 7], [16.5, 0, 0],
  [24.2, 0, 0], [24.32, 5, -2], [24.7, 0, 0],
  [27.12, 0, 0, 0, 'o'], [27.45, -14, -22, 0, 'i'], [27.8, -18, -6], [28.4, 0, 0],
  [30.45, 0, 0], [30.6, 0, 5, 0, 'o'], [31, 6, -100, 180, 'i'], [31.35, 0, 0, 360], [31.37, 0, 0],
  [32, 0, 0], [32.12, 0, 4, 0, 'o'], [32.4, -16, -28, -180, 'i'], [32.7, LX, LY, -360], [32.72, LX, LY],
  [32.95, LX, LY], [33.1, LX - 5, LY], [33.35, LX, LY], [33.5, LX + 3, LY + 1], [33.75, LX, LY], [33.95, LX - 6, LY], [34.2, LX, LY],
  [34.4, LX, LY + 9], [34.55, LX, LY + 9, 0, 'o'], [34.85, LX - 8, LY - 34, -180, 'i'], [35.15, LX - 4, LY, -360], [35.17, LX - 4, LY],
  [35.35, LX - 4, LY + 3, 0, 'o'], [35.62, -12, -22, 180, 'i'], [35.9, 0, 0, 360], [35.92, 0, 0],
  [37.35, 0, 0], [37.5, 3, -1], [37.6, -10, -6], [37.85, 0, 0],
  [39.85, 0, 0, 0, 'o'], [40.1, 0, -24, 180, 'i'], [40.35, 0, 0, 360], [40.37, 0, 0],
  [40.9, 0, 0], [41.02, -6, 0], [41.4, 0, 0],
  [42.9, 0, 0], [43.02, -3, 0], [43.3, 0, 0], [43.55, -3, -3], [43.85, 0, 0], [44.1, -3, 0], [44.4, 0, 0],
  [44.6, 0, 6], [45, 0, 6, 0, 'o'], [45.4, -110, -175, -180, 'i'], [45.85, -178, -95, -360],
  [45.87, -178, -95, 0, 'o'], [46.4, -90, -150, 180, 'i'], [46.9, 0, 0, 360], [46.92, 0, 0],
  // After the blade is raised and lowered she leaps up out of the picture, and drops back in with a flip to start again.
  [55.2, 0, 0], [55.5, 0, 6, 0, 'o'], [56.2, 0, -560], [58.85, 0, -560, -360, 'i'], [59.45, 0, 0],
  [LOOP, 0, 0],
]

// Her sword arm, in degrees about the shoulder: 22 on guard, 40 level across a shot, 55 raised to parry, 75 wound up,
// -20 the cut, -100 held back for the last strike, 108 raised over the roofs at the end.
const SLASH = [
  [0, 0], [2.8, 0], [3.5, 60], [4.05, -20], [4.6, 75], [5.05, -20], [5.8, 0], [12, 0], [12.5, 22], [16, 22], [16.5, 0],
  [19.5, 0], [20.5, 22],
  [23.95, 22], [24.2, 55], [24.45, 55], [24.85, 22],
  [26.45, 22], [26.62, 40], [27, 40], [27.36, 75], [27.66, -20], [28.2, -20], [28.6, 22],
  [31.42, 22], [31.56, 40], [31.8, 40], [32, 22],
  [32.75, 22], [32.95, 75], [33.1, -20], [33.32, 22], [33.45, 55], [33.68, 55], [33.8, 75], [33.95, -20], [34.25, 22],
  [34.45, 22], [34.6, 75], [34.88, -20], [35.3, 22],
  [37.2, 22], [37.4, 55], [37.62, 55], [37.9, 22], [38.5, 22], [38.66, 40], [38.88, 40], [38.96, -10], [39.4, 22],
  [39.85, 22], [39.98, 75], [40.32, -20], [40.7, 22], [40.85, 75], [41, -20], [41.45, 22],
  [42.85, 22], [43, 40], [43.2, 22], [43.48, 55], [43.7, 22], [44.04, 40], [44.25, 22],
  [44.45, 22], [44.7, -100], [45.35, -100], [45.65, 75], [45.85, -20], [46.3, -20], [46.9, 22],
  [47.4, 0], [48.2, 0], [49, 108], [52.4, 108], [53.6, 0], [LOOP, 0],
]

// The samurai, in his own units about his feet: he drops in, leaps at her roof twice, duels her on his own, and flees.
const SM = [
  [0, 0, -520, 0, '', 0], [20.5, 0, -520, 0, '', 0], [20.6, 0, -520, 0, '', 1], [22.4, 0, 0], [22.6, 0, 5], [22.9, 0, 0],
  [23.7, 0, 0], [23.85, 0, 6, 0, 'o'], [24.2, 10, -95, 10, 'i'], [24.35, 12, -90, 10], [24.75, 4, 0, -6], [25, 0, 0],
  [32.2, 0, 0], [32.6, -15, 0], [33, -15, 0], [33.12, -19, 0, -5], [33.3, -15, 0], [33.5, -11, 0, 6], [33.7, -15, 0],
  [33.97, -24, 0, -9], [34.25, -18, 0], [34.45, -8, 0, 10], [34.62, -8, 0, 10], [34.9, -30, -3, -16], [35.3, -26, 0, -6],
  [35.6, -15, 0], [36.3, 0, 0],
  [37, 0, 0], [37.12, 0, 6, 0, 'o'], [37.42, 10, -95, 10, 'i'], [37.55, 8, -92, 4], [37.62, 2, -86, -20], [38.05, 2, 0, -8],
  [38.3, 0, 0], [38.95, 0, 0], [39.05, -10, 0, -14], [39.35, -12, 0, -10], [39.8, 0, 0],
  [42.6, 0, 0], [43, 6, 0], [44.95, 6, 0], [45.05, 6, 6, 0, 'o'], [45.35, 16, -95, 12, 'i'], [45.55, 18, -88, 16],
  [45.9, 6, 0, -4], [46.15, 0, 0],
  [47.2, 0, 0], [47.6, 0, 10], [48.6, -40, -520, 0, '', 1], [48.7, -40, -520, 0, '', 0], [LOOP, 0, -520, 0, '', 0],
]

// His arms and blade, in degrees about the shoulders: raised back, then the chop toward her.
const SAM = [
  [0, 0], [23.7, 0], [23.88, -25], [24.2, 60], [24.4, 45], [24.9, 0],
  [32.4, 0], [32.6, -15], [33, -15], [33.12, -6], [33.3, -15], [33.42, -30], [33.55, 60], [33.75, -15], [33.97, -4],
  [34.3, -30], [34.5, 60], [34.9, 30], [35.6, 0],
  [37, 0], [37.15, -30], [37.42, 55], [37.6, 30], [38.2, 0], [38.95, 0], [39.05, -20], [39.8, 0],
  [42.6, 0], [43, -15], [44.95, -15], [45.1, -30], [45.4, 70], [45.6, 60], [46.1, 0], [LOOP, 0],
]

// The robot's bolts, from [fired, landed, how far along the barrel]: the first flies on under her backflip.
const BOLTS = [[30.75, 31.18, 260], [31.3, 31.58, 123], [42.85, 43.05, 97], [43.4, 43.6, 99], [43.95, 44.15, 97]]
const PEW = [
  [0, 0, 0],
  ...BOLTS.flatMap(([fired, landed, far]) => [[fired - 0.02, 0, 0], [fired, 0, 1], [landed, far, 1], [landed + 0.02, far, 0]]),
  [LOOP, 0, 0],
].map(([seconds, x, opacity]) => [seconds, `transform:translateX(${x}px);opacity:${opacity}`])

// A flash of lightning at each time: up, down, up again, gone.
const flashes = (times, peak, low, mid) => [
  [0, show(0)],
  ...times.flatMap(time => [
    [time - 0.06, show(0)],
    [time, show(peak)],
    [time + 0.12, show(low)],
    [time + 0.24, show(mid)],
    [time + 0.55, show(0)],
  ]),
  [LOOP, show(0)],
]

const STORY = [
  // Act one, calm. Act two, from 8s: the drones sweep in. From 18s the robot flies in and the samurai drops onto his roof.
  '.swarm{animation:swarm 60s linear infinite}',
  story('swarm', [[0, move(1800, 0)], [8, move(1800, 0)], [22, move(-500, 0)], [LOOP, move(-500, 0)]]),
  // Act three, the fight in eight beats laid out above.
  '.rb{transform-origin:906px 404px;animation:rb 60s linear infinite}',
  story('rb', RB.map(pose)),
  '.sm{animation:sm 60s linear infinite}',
  story('sm', SM.map(pose)),
  '.sam{transform-origin:0 -84px;animation:sam 60s linear infinite}',
  story('sam', SAM.map(([seconds, degrees]) => [seconds, turn(degrees)])),
  '.nj{transform-origin:0 -62px;animation:nj 60s linear infinite}',
  story('nj', NJ.map(pose)),
  '.slash{transform-box:fill-box;transform-origin:93% 8%;animation:slash 60s linear infinite}',
  story('slash', SLASH.map(([seconds, degrees]) => [seconds, turn(degrees)])),
  '.spark{animation:spark 60s linear infinite}',
  story('spark', sparks([24.26, 26.72, 26.96, 31.58, 33.08, 33.55, 33.97, 37.45, 38.72, 43.05, 43.6, 44.15], 0.16)),
  '.trail{animation:trail 60s linear infinite}',
  story('trail', trails([4.05, 5.05, 27.66, 33.1, 33.95, 34.88, 40.32, 41, 45.85])),
  '.strail{animation:strail 60s linear infinite}',
  story('strail', trails([24.2, 33.55, 34.5, 37.42, 45.4])),
  '.dust,.sdust{transform-box:fill-box;transform-origin:50% 50%}.dust{animation:dust 60s linear infinite}.sdust{animation:sdust 60s linear infinite}',
  story('dust', puffs([31.35, 32.7, 35.15, 35.9, 40.35, 46.9, 59.45])),
  story('sdust', puffs([22.4, 24.75, 38.05, 45.9])),
  '.muzzle{animation:muzzle 60s linear infinite}',
  story('muzzle', sparks([26.7, 30.75, 31.3, 38.7, 42.85, 43.4, 43.95], 0.14)),
  '.glare{animation:glare 60s linear infinite}',
  story('glare', [
    [0, show(0)], [27.92, show(0)], [27.98, show(0.45)], [28.4, show(0)], [41.36, show(0)], [41.42, show(0.45)], [41.85, show(0)],
    [45.96, show(0)], [46.02, show(1)], [46.5, show(0.6)], [47.4, show(0)], [LOOP, show(0)],
  ]),
  '.hit{animation:hit 60s linear infinite}',
  story('hit', sparks([27.96, 41.4, 45.88], 0.4)),
  '.hurt{animation:hurt 60s linear infinite}',
  story('hurt', sparks([34.9, 37.6, 39.02], 0.3)),
  '.laser{animation:laser 60s linear infinite}',
  story('laser', [[0, show(0)], [26.66, show(0)], [26.7, show(1)], [27, show(1)], [27.06, show(0)], [38.66, show(0)], [38.7, show(1)], [38.9, show(1)], [38.94, show(0)], [LOOP, show(0)]]),
  '.pew{animation:pew 60s linear infinite}',
  story('pew', PEW),
  '.ray{animation:ray 60s linear infinite}',
  story('ray', [[0, show(0)], [38.92, show(0)], [38.95, show(1)], [39.12, show(1)], [39.2, show(0)], [LOOP, show(0)]]),
  '.arc{animation:arc 60s linear infinite}',
  story('arc', thrown([
    [0, 0, 0, 0], [27.42, 0, 0, 0], [27.6, -8, 0, 0.9], [28.02, -50, 0, 0.7], [28.26, -64, 0, 0],
    [40.3, 0, 0, 0], [40.38, -8, 0, 0.9], [40.75, -110, 0, 0.7], [40.95, -160, 0, 0],
    [41, 0, 0, 0], [41.06, -6, -6, 0.9], [41.38, -50, -60, 0.7], [41.5, -60, -72, 0], [LOOP, 0, 0, 0],
  ])),
  '.charge{animation:charge 60s linear infinite}',
  story('charge', [
    [0, show(0.3)], [25.9, show(0.3)], [26.6, show(1)], [27.1, show(0.3)], [30, show(0.3)], [30.7, show(1)], [31.4, show(0.3)],
    [38, show(0.3)], [38.6, show(1)], [39, show(0.3)], [42.2, show(0.3)], [42.8, show(1)], [44.2, show(0.3)],
    [46.1, show(0.05)], [59, show(0.05)], [LOOP, show(0.3)],
  ]),
  // The ending, at 46s: the bar in the flat fills, the lock opens, the robot goes dark with a burst and a bolt of lightning,
  // and the creature jumps twice.
  '.load{transform-box:fill-box;transform-origin:0 50%;animation:load 60s linear infinite}',
  story('load', [[0, 'transform:scaleX(.04)'], [45.5, 'transform:scaleX(1)'], [56, 'transform:scaleX(1)'], [58, 'transform:scaleX(.04)'], [LOOP, 'transform:scaleX(.04)']]),
  '.lk0{animation:lk0 60s linear infinite}.lk1{animation:lk1 60s linear infinite}',
  story('lk0', [[0, show(1)], [45.8, show(1)], [46, show(0)], [57, show(0)], [57.5, show(1)], [LOOP, show(1)]]),
  story('lk1', [[0, show(0)], [45.8, show(0)], [46, show(1)], [57, show(1)], [57.5, show(0)], [LOOP, show(0)]]),
  '.boom{transform-box:fill-box;transform-origin:50% 50%;animation:boom 60s linear infinite}',
  story('boom', [
    [0, `${show(0)};transform:scale(.2)`],
    [45.9, `${show(0)};transform:scale(.2)`],
    [46, `${show(1)};transform:scale(.4)`],
    [46.5, `${show(0.6)};transform:scale(1.5)`],
    [46.9, `${show(0)};transform:scale(1.9)`],
    [LOOP, `${show(0)};transform:scale(.2)`],
  ]),
  '.joy{animation:joy 60s linear infinite}',
  story('joy', [[0, move(0, 0)], [46.2, move(0, 0)], [46.6, move(0, -14)], [47, move(0, 0)], [47.4, move(0, -14)], [47.8, move(0, 0)], [LOOP, move(0, 0)]]),
  // It looks out at the fight when the samurai lands, while she duels on his roof, and for the last strike.
  '.look{animation:look 60s linear infinite}',
  story('look', [
    [0, move(0, 0)], [22.3, move(0, 0)], [22.6, move(-5, 0)], [28.4, move(-5, 0)], [28.7, move(0, 0)],
    [32, move(0, 0)], [32.3, move(-5, 1)], [35.8, move(-5, 1)], [36.1, move(0, 0)],
    [44.5, move(0, 0)], [44.8, move(-5, -1)], [46.2, move(-5, -1)], [46.4, move(0, 0)], [LOOP, move(0, 0)],
  ]),
  // The flashes stay faint and brief: this sits behind a chat. One bolt marks the ending, the other comes early and late.
  '.fl{animation:fl 60s linear infinite}.bolt{animation:bolt 60s linear infinite}.fl.bo2{animation-name:fl2}.bolt.bo2{animation-name:bolt2}',
  story('fl', flashes([46], 0.1, 0.02, 0.08)),
  story('bolt', flashes([46], 1, 0.2, 0.9)),
  story('fl2', flashes([11, 52.5], 0.1, 0.02, 0.08)),
  story('bolt2', flashes([11, 52.5], 1, 0.2, 0.9)),
  // Afterwards, from 46s: the chase goes by with its lights on.
  '.car2{animation:car2 60s linear infinite}',
  story('car2', [[0, move(2300, 0)], [46, move(2300, 0)], [58, move(-600, 0)], [LOOP, move(-600, 0)]]),
].join('')

const STYLE = [
  STORY,
  '.code{animation:code 7.5s linear infinite}@keyframes code{to{transform:translateY(-90px)}}',
  '.cur{animation:tw 1s ease-in-out infinite alternate}',
  '.type{animation:type .4s ease-in-out infinite alternate}@keyframes type{to{transform:translateY(5px)}}',
  '.bop{animation:bop .5s ease-in-out infinite alternate}@keyframes bop{to{transform:translateY(2.5px)}}',
  '.ty2{animation-delay:-.2s}',
  '.blink{transform-box:fill-box;transform-origin:50% 50%;animation:blink 5s linear infinite}',
  '@keyframes blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}',
  '.flick{transform-box:fill-box;transform-origin:50% 0;animation:flick .3s ease-in-out infinite alternate}@keyframes flick{from{transform:scaleY(.6)}to{transform:scaleY(1)}}',
  '.steam{animation:steam 3s ease-out infinite}.st2{animation-delay:-1.5s}',
  '@keyframes steam{from{transform:translateY(4px);opacity:0}30%{opacity:.6}to{transform:translateY(-10px);opacity:0}}',
  '.flow{animation:orbit 4s linear infinite}',
  '.sway{transform-box:fill-box;transform-origin:0 50%;animation:sway 2.5s ease-in-out infinite alternate}.sw2{animation-delay:-1.25s}',
  '@keyframes sway{from{transform:rotate(-5deg)}to{transform:rotate(6deg)}}',
  '.car{animation:car 30s linear -12s infinite}@keyframes car{from{transform:translateX(-600px)}to{transform:translateX(1800px)}}',
  '.pr{animation:pol .6s steps(1) infinite}.pb{animation:pol .6s steps(1) -.3s infinite}@keyframes pol{0%{opacity:1}50%{opacity:.1}}',
  // The street: legs swing about the hip, walkers and cars loop from one side to the other.
  '.leg{transform-box:fill-box;transform-origin:50% 0;animation:leg .5s ease-in-out infinite alternate}.lg2{animation-direction:alternate-reverse}',
  '@keyframes leg{from{transform:rotate(-17deg)}to{transform:rotate(17deg)}}',
  '.bob{animation:bob .25s ease-in-out infinite alternate}@keyframes bob{to{transform:translateY(-1.2px)}}.dl{animation-delay:-.25s}',
  '.wr{animation:wr 60s linear infinite}@keyframes wr{to{transform:translateX(1600px)}}',
  '.wl{animation:wl 60s linear infinite}@keyframes wl{to{transform:translateX(-1600px)}}',
  '.gc1{animation:gc1 12s linear infinite}@keyframes gc1{from{transform:translateX(-800px)}to{transform:translateX(1900px)}}',
  '.gc2{animation:gc2 20s linear -4s infinite}@keyframes gc2{from{transform:translateX(2100px)}to{transform:translateX(-400px)}}',
  '.gc3{animation:gc3 10s linear -6s infinite}@keyframes gc3{from{transform:translateX(2400px)}to{transform:translateX(-600px)}}',
  '.whale{animation:whale 60s linear infinite}@keyframes whale{from{transform:translateX(-320px)}to{transform:translateX(1840px)}}',
  '.fluke{transform-box:fill-box;transform-origin:100% 50%;animation:fluke 3s ease-in-out infinite alternate}@keyframes fluke{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}',
  '.hover{animation:hover 5s ease-in-out infinite alternate}.h2{animation-delay:-2.5s}',
  '@keyframes hover{to{transform:translateY(-5px)}}',
  '.g1{animation:glow 10s ease-in-out infinite alternate}',
  '.g2{animation:glow 15s ease-in-out infinite alternate}',
  '@keyframes glow{from{opacity:.55}to{opacity:1}}',
  '.tw1{animation:tw 5s ease-in-out infinite alternate}',
  '.tw2{animation:tw 7.5s ease-in-out infinite alternate}',
  '.tw3{animation:tw 10s ease-in-out infinite alternate}',
  '@keyframes tw{from{opacity:.25}to{opacity:1}}',
  '.bl{animation:tw 3s ease-in-out infinite alternate}',
  `.mer{transform-origin:${GLOBE_X}px ${GLOBE_Y}px;animation:spin ${SPIN_SECONDS}s ease-in-out infinite alternate}`,
  ...meridianDelays,
  '@keyframes spin{from{transform:scaleX(1)}to{transform:scaleX(-1)}}',
  `.pulse{transform-origin:${GLOBE_X}px ${GLOBE_Y}px;animation:pulse 6s ease-out infinite}`,
  '.p2{animation-delay:-3s}',
  '@keyframes pulse{from{transform:scale(1);opacity:.5}to{transform:scale(1.7);opacity:0}}',
  '.orbit{animation:orbit 6s linear infinite}',
  '@keyframes orbit{to{stroke-dashoffset:-200}}',
  '.train{animation:train 30s linear infinite}',
  '@keyframes train{from{transform:translateX(-1300px)}to{transform:translateX(700px)}}',
  '.eq{transform-box:fill-box;transform-origin:50% 100%;animation:eq 2s ease-in-out infinite alternate}',
  '.e1{animation-delay:-.7s}.e2{animation-delay:-1.3s}.e3{animation-delay:-.4s}.e4{animation-delay:-1.6s}.e5{animation-delay:-1s}',
  '@keyframes eq{from{transform:scaleY(.2)}to{transform:scaleY(1)}}',
  '.dia{transform-box:fill-box;transform-origin:50% 50%;animation:spin 5s ease-in-out infinite alternate}',
  '.b1{transform-origin:300px 460px;animation:b1 15s ease-in-out infinite alternate}',
  '@keyframes b1{from{transform:rotate(-26deg)}to{transform:rotate(16deg)}}',
  '.b2{transform-origin:1230px 420px;animation:b2 10s ease-in-out infinite alternate}',
  '@keyframes b2{from{transform:rotate(24deg)}to{transform:rotate(-18deg)}}',
  '.fa{animation:fa 60s linear infinite}@keyframes fa{from{transform:translateX(-700px)}to{transform:translateX(1200px)}}',
  '.fb{animation:fb 60s linear infinite}@keyframes fb{from{transform:translateX(700px)}to{transform:translateX(-1200px)}}',
  '.fc{animation:fc 30s linear infinite}@keyframes fc{from{transform:translateX(-500px)}to{transform:translateX(1400px)}}',
  '.fd{animation:fd 60s linear infinite}@keyframes fd{from{transform:translateX(500px)}to{transform:translateX(-1400px)}}',
  '.s1{animation:fall 5s linear infinite}',
  '.s2{animation:fall 7.5s linear infinite}',
  '@keyframes fall{to{stroke-dashoffset:-180}}',
  '.rain{animation:rain 2.4s linear infinite}',
  '@keyframes rain{to{transform:translate(-70px,280px)}}',
  '.scan{animation:scan 20s linear infinite}',
  '@keyframes scan{to{transform:translateY(1300px)}}',
  ...floorKeyframes,
].join('')

const fade = (id, color, from, to, horizontal) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${horizontal ? 1 : 0}" y2="${horizontal ? 0 : 1}">` +
  `<stop offset="0" stop-color="${color}" stop-opacity="${from}"/><stop offset="1" stop-color="${color}" stop-opacity="${to}"/></linearGradient>`

const DEFS = [
  '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02040a"/><stop offset="0.55" stop-color="#070614"/><stop offset="1" stop-color="#200b30"/></linearGradient>',
  `<radialGradient id="gm"><stop offset="0" stop-color="${MAGENTA}" stop-opacity="0.3"/><stop offset="1" stop-color="${MAGENTA}" stop-opacity="0"/></radialGradient>`,
  `<radialGradient id="gc"><stop offset="0" stop-color="${CYAN}" stop-opacity="0.2"/><stop offset="1" stop-color="${CYAN}" stop-opacity="0"/></radialGradient>`,
  `<radialGradient id="halo"><stop offset="0" stop-color="${CYAN}" stop-opacity="0.26"/><stop offset="0.6" stop-color="${MAGENTA}" stop-opacity="0.12"/><stop offset="1" stop-color="${MAGENTA}" stop-opacity="0"/></radialGradient>`,
  `<radialGradient id="body"><stop offset="0" stop-color="${CYAN}" stop-opacity="0.16"/><stop offset="1" stop-color="${CYAN}" stop-opacity="0.03"/></radialGradient>`,
  `<radialGradient id="pool"><stop offset="0" stop-color="${CYAN}" stop-opacity="0.3"/><stop offset="1" stop-color="${CYAN}" stop-opacity="0"/></radialGradient>`,
  '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#190826"/><stop offset="1" stop-color="#05090b"/></linearGradient>',
  fade('beam', CYAN, 0, 0.3, false),
  fade('beam2', MAGENTA, 0, 0.26, false),
  fade('rc', CYAN, 0.28, 0, false),
  fade('rm', MAGENTA, 0.28, 0, false),
  fade('ry', YELLOW, 0.22, 0, false),
  fade('tc', CYAN, 0, 0.85, true),
  fade('tm', MAGENTA, 0.85, 0, true),
  fade('ty', YELLOW, 0.8, 0, true),
  fade('lamp', '#c8fbff', 0.7, 0, true),
  `<linearGradient id="band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${CYAN}" stop-opacity="0"/><stop offset="0.5" stop-color="${CYAN}" stop-opacity="0.07"/><stop offset="1" stop-color="${CYAN}" stop-opacity="0"/></linearGradient>`,
  `<linearGradient id="face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2733a"/><stop offset="0.55" stop-color="${ORANGE}"/><stop offset="1" stop-color="#f58a50"/></linearGradient>`,
  `<radialGradient id="gw"><stop offset="0" stop-color="${YELLOW}" stop-opacity="0.24"/><stop offset="1" stop-color="${YELLOW}" stop-opacity="0"/></radialGradient>`,
  `<radialGradient id="blast"><stop offset="0" stop-color="${YELLOW}" stop-opacity="0.4"/><stop offset="0.4" stop-color="${RED}" stop-opacity="0.18"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></radialGradient>`,
  '<clipPath id="screen"><rect x="1292" y="720" width="108" height="92"/></clipPath>',
  '<pattern id="drops" width="70" height="140" patternUnits="userSpaceOnUse"><path d="M60 4L49 48M22 82L13 118" fill="none" stroke="#a8dcff" stroke-opacity="0.2"/></pattern>',
].join('')

export const SCENE = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMaxYMax slice">`,
  `<style>${STYLE}</style>`,
  `<defs>${DEFS}</defs>`,
  `<rect width="${W}" height="${H}" fill="url(#sky)"/>`,
  STARS,
  '<ellipse class="g1" cx="1400" cy="380" rx="560" ry="420" fill="url(#gm)"/>',
  '<ellipse class="g2" cx="180" cy="440" rx="520" ry="400" fill="url(#gc)"/>',
  STORM,
  GLOBE,
  STREAMS,
  TRAFFIC,
  farParts.join(''),
  TRAIN,
  WHALE,
  DRONES,
  BEAMS,
  towerBodies.join(''),
  WINDOWS,
  signs.join(''),
  BILLBOARDS,
  // The whole fight, drawn elsewhere and larger, then set on two roofs in the left third of the picture: the column of
  // text covers the middle third, and rooftop figures should not stand taller than the people in the street.
  '<g transform="translate(-364.5 -20) scale(0.7)">',
  GLARE,
  ROBOT,
  SAMURAI,
  NINJA,
  FIGHT,
  '</g>',
  NEAR_CAR,
  `<rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#floor)"/>`,
  `<ellipse cx="${VANISH}" cy="${HORIZON + 40}" rx="460" ry="80" fill="url(#pool)"/>`,
  reflections.join(''),
  floorRays.join(''),
  floorLines.join(''),
  `<line x1="0" y1="${HORIZON}" x2="${W}" y2="${HORIZON}" stroke="${MAGENTA}" stroke-width="2" stroke-opacity="0.9"/>`,
  // The rain falls before the flat is drawn, so it stays outside the window.
  `<rect class="rain" x="0" y="-280" width="${W + 80}" height="${H + 280}" fill="url(#drops)"/>`,
  HACKER,
  STREET,
  `<rect class="scan" x="0" y="-200" width="${W}" height="140" fill="url(#band)"/>`,
  '</svg>',
].join('')
