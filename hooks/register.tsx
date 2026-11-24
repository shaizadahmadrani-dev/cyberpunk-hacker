import type { Register, ThemeMessageRule, ThemeSetArgs } from 'claude-code'

import { PULSE, RECEIVED, SENT } from './hud.js'
import { makeColors } from './make-colors.js'
import { SCENE } from './scene.js'

const CYAN = '#00f0ff'
const GREEN = '#39ff14'
const MAGENTA = '#ff2a9d'

const SCENE_NAME = 'neon-city'

// A dark-only look: a terminal at night, lit by neon signage.
const { theme, problems } = makeColors({
  label: 'Cyberpunk hacker',
  only: 'dark',
  // Code: keywords cyan, strings green, literals magenta, names red, variables yellow.
  roles: { accent: CYAN, danger: '#ff3355', success: GREEN, warning: '#ffd400', pro: MAGENTA },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#05090b',
        'surface-1': '#090f12',
        'surface-2': '#0e181c',
        'surface-3': '#121f24',
        'text-primary': '#d7ffe6',
        'text-secondary': '#8fe3b4',
        'text-muted': '#5fa884',
      },
    },
    git: { added: GREEN, removed: '#ff3355', modified: '#ffd400' },
  },
})

// Colors and the moving city: what every build that draws looks takes.
const BASE: ThemeSetArgs = {
  colors: theme,
  backdrop: {
    scene: SCENE_NAME,
    // Dark, mostly opaque panels, so words stay readable over the neon.
    glass: { blur: 14, tint: '#05090b', opacity: 0.74 },
  },
}

// The person's message: a panel with two cut corners, a neon edge, a bright bracket on each cut and two ticks.
// Every ornament sits inside a corner's slice, so the panel fits a message of any size.
const bubble = (edge: `#${string}`): ThemeMessageRule => ({
  color: 'text-primary',
  backgroundColor: 'surface-2',
  paddingX: 18,
  paddingY: 12,
  shadow: { blur: 18, color: `${edge}66` },
  fill: {
    vector: {
      viewBox: 48,
      slice: 16,
      paths: [
        { d: 'M12 0H48V36L36 48H0V12Z', color: 'surface-2' },
        { d: 'M12 0.5H47.5V36L36 47.5H0.5V12Z', strokeWidth: 1, color: `${edge}99` },
        { d: 'M0.5 16V12L12 0.5H16', strokeWidth: 2.5, color: edge },
        { d: 'M47.5 32V36L36 47.5H32', strokeWidth: 2.5, color: edge },
        { d: 'M35 4H38V6H35ZM40 4H43V6H40Z', color: edge },
      ],
    },
  },
})

// The pane of a reply: nearly solid, so the city never fights the words. The same cut corners, a cyan bracket where it
// opens and a magenta one where it closes, three status ticks and a rule along the foot.
const PANE = '#05090bea'

const REPLY: ThemeMessageRule = {
  color: 'text-primary',
  backgroundColor: PANE,
  paddingX: 18,
  paddingY: 14,
  shadow: { blur: 20, color: '#00f0ff26' },
  fill: {
    vector: {
      viewBox: 64,
      slice: 24,
      paths: [
        { d: 'M14 0H64V50L50 64H0V14Z', color: PANE },
        { d: 'M14 0.5H63.5V50L50 63.5H0.5V14Z', strokeWidth: 1, color: '#00f0ff3d' },
        { d: 'M0.5 23V14L14 0.5H23', strokeWidth: 2, color: CYAN },
        { d: 'M63.5 41V50L50 63.5H41', strokeWidth: 2, color: MAGENTA },
        { d: 'M45 5H49V7H45ZM51 5H55V7H51Z', color: CYAN },
        { d: 'M57 5H61V7H57Z', color: GREEN },
        { d: 'M4 58H18V59.5H4Z', color: '#00f0ff80' },
      ],
    },
  },
}

// A tool call's row: a chip with a green bar down its left and its top right corner cut.
const CHIP = '#090f12f2'

// Terminal type and neon-edged rows, where the build takes `style`.
const LOOK: ThemeSetArgs = {
  ...BASE,
  style: {
    Text: { fontFamily: ['mono'] },
    Heading: { color: CYAN, fontFamily: ['mono'], fontWeight: 'bold', letterSpacing: 1.5 },
    UserMessage: [bubble(CYAN), bubble(MAGENTA)],
    AssistantMessage: REPLY,
    ToolUse: {
      color: GREEN,
      fontFamily: ['mono'],
      backgroundColor: CHIP,
      paddingX: 12,
      shadow: { blur: 10, color: '#39ff1422' },
      fill: {
        vector: {
          viewBox: 24,
          slice: 8,
          paths: [
            { d: 'M0 0H18L24 6V24H0Z', color: CHIP },
            { d: 'M0.5 0.5H18L23.5 6V23.5H0.5Z', strokeWidth: 1, color: '#39ff1455' },
            { d: 'M0 0H3V24H0Z', color: GREEN },
          ],
        },
      },
    },
  },
}

// Two soft sounds, made by the app from these numbers once the person turns the theme's sound on.
// Sending: a low, damped thock with a breath of noise, like one key of a heavy keyboard.
// Claude done: three small bells rising over a warm low note, in a little room.
const HEARD: ThemeSetArgs = {
  ...LOOK,
  sound: {
    cues: {
      send: {
        reverb: 0.12,
        layers: [
          { wave: 'sine', notes: ['A2'], glide: -7, attack: 0.002, release: 0.14, gain: 0.55 },
          { wave: 'triangle', notes: ['A4'], glide: -12, attack: 0.002, release: 0.05, gain: 0.16 },
          { wave: 'pink', filter: { type: 'bandpass', hz: 1800 }, attack: 0.002, release: 0.05, gain: 0.14 },
        ],
      },
      done: {
        reverb: 0.3,
        layers: [
          { wave: 'bell', notes: ['E5', 'B5', 'E6'], step: 0.11, attack: 0.004, release: 0.9, gain: 0.3 },
          { wave: 'sine', notes: ['E3'], attack: 0.02, release: 0.7, gain: 0.2 },
          { wave: 'pink', filter: { type: 'lowpass', hz: 900 }, attack: 0.01, release: 0.18, gain: 0.08 },
        ],
      },
    },
  },
}

// From the whole look down to what the oldest build takes: a build refuses a set that names an attribute it lacks.
const LOOKS = [HEARD, LOOK, BASE] as const

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    let set

    for (const look of LOOKS) {
      try {
        set = await $.theme.set(look)
        break
      } catch (error) {
        $.ui.log(String(error))
      }
    }

    if (set !== undefined && !set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  // While a turn runs: a small moving mark beside the app's own line, one for each thing the turn can be doing.
  // The line itself stays the app's, so its words, timer and token count are untouched.
  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (e.surface !== 'desktop') {
      return next(e)
    }

    const { Box, Svg } = $.ui.resolve(e)

    return (
      <Box flexDirection="row" alignItems="center" gap={1}>
        <Svg source={PULSE[e.props.mode]} alt={e.props.mode} width={72} height={18} />
        {await next(e)}
      </Box>
    )
  })

  // Over the block that opens a reply: a strip that draws itself in, then a light runs along it. A summary of the
  // words between two tool calls gets none, so the strip marks what Claude answers, not what it notes on the way.
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (e.surface !== 'desktop' || e.props.isSummary === true || !e.props.isFirstOfReply) {
      return next(e)
    }

    const { Box, Svg } = $.ui.resolve(e)

    return (
      <Box flexDirection="column">
        <Svg source={RECEIVED} alt="reply" width={220} height={12} />
        {await next(e)}
      </Box>
    )
  })

  // Over what the person sends: the same strip in magenta, at the side their bubble sits on. A task's notification
  // and a message from another agent or session are not the person's, so they get none.
  on('ui.render', { component: 'UserMessage' }, async ($, e, next) => {
    if (e.surface !== 'desktop' || e.props.task !== undefined || e.props.from !== undefined) {
      return next(e)
    }

    const { Box, Svg } = $.ui.resolve(e)

    return (
      <Box flexDirection="column">
        <Box alignSelf="flex-end">
          <Svg source={SENT} alt="sent" width={220} height={12} />
        </Box>
        {await next(e)}
      </Box>
    )
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.props.scene !== SCENE_NAME || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return (
      <Svg
        source={SCENE}
        alt="A neon city at night in a storm: lit towers either side of a street, a wireframe globe behind them, a whale of light and a swarm of drones in the sky, flying cars in a chase, a ninja on a roof fighting a hovering robot and a samurai robot, a street below with lamps, cars and people walking under umbrellas, and in a flat over a shop on the corner a small boxy orange creature in headphones at its laptop"
        isInteractive
      />
    )
  })
}
