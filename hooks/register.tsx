import type {
  HookStream,
  ProcessSpawnChunk,
  ProcessSpawnResult,
  PromptEditInput,
  Register,
  ThemeAmbience,
  ThemeMessageRule,
  ThemeSetArgs,
  ThemeSound,
} from 'claude-code'

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

// The cues, made by the app from these numbers once the person turns the theme's sound on. All but the error's
// clash sit in E minor pentatonic, so any two that overlap still agree.
const CUES: NonNullable<ThemeSound['cues']> = {
  // Sending: a low, damped thock with a breath of noise, like one key of a heavy keyboard.
  send: {
    reverb: 0.12,
    layers: [
      { wave: 'sine', notes: ['A2'], glide: -7, attack: 0.002, release: 0.14, gain: 0.55 },
      { wave: 'triangle', notes: ['A4'], glide: -12, attack: 0.002, release: 0.05, gain: 0.16 },
      { wave: 'pink', filter: { type: 'bandpass', hz: 1800 }, attack: 0.002, release: 0.05, gain: 0.14 },
    ],
  },
  // Claude done: three small bells rising over a warm low note, in a little room.
  done: {
    reverb: 0.3,
    layers: [
      { wave: 'bell', notes: ['E5', 'B5', 'E6'], step: 0.11, attack: 0.004, release: 0.9, gain: 0.3 },
      { wave: 'sine', notes: ['E3'], attack: 0.02, release: 0.7, gain: 0.2 },
      { wave: 'pink', filter: { type: 'lowpass', hz: 900 }, attack: 0.01, release: 0.18, gain: 0.08 },
    ],
  },
  // A tool call: it comes often, so one tiny data blip, barely there.
  tool: {
    layers: [
      { wave: 'triangle', notes: ['E6'], glide: 4, attack: 0.002, release: 0.04, gain: 0.07, filter: { type: 'lowpass', hz: 4000 } },
    ],
  },
  // A prompt or question waiting: two notes rising, a fourth apart, like a terminal asking for input.
  ask: {
    reverb: 0.2,
    layers: [
      { wave: 'triangle', notes: ['B4', 'E5'], step: 0.09, attack: 0.004, release: 0.22, gain: 0.22 },
      { wave: 'sine', notes: ['B3', 'E4'], step: 0.09, attack: 0.004, release: 0.3, gain: 0.12 },
    ],
  },
  // The turn failed: a short glitch, two clashing low tones sliding down under a crackle of static.
  error: {
    reverb: 0.15,
    layers: [
      { wave: 'saw', notes: ['E3'], glide: -5, attack: 0.004, release: 0.35, gain: 0.12, filter: { type: 'lowpass', hz: 900, to: 250 } },
      { wave: 'square', notes: ['F3'], glide: -5, attack: 0.004, release: 0.3, gain: 0.06, filter: { type: 'lowpass', hz: 700, to: 200 } },
      { wave: 'crackle', attack: 0.002, release: 0.12, gain: 0.1 },
    ],
  },
  // The conversation compacted: a breath of noise sweeping down while one note falls an octave, data packed away.
  compact: {
    reverb: 0.25,
    layers: [
      { wave: 'pink', filter: { type: 'bandpass', hz: 3500, to: 400 }, attack: 0.04, release: 0.55, gain: 0.16 },
      { wave: 'sine', notes: ['E5'], glide: -12, attack: 0.01, release: 0.5, gain: 0.1 },
    ],
  },
  // A click on the city: a bell whose note climbs from the left edge to the right, so the skyline plays a scale.
  click: {
    reverb: 0.3,
    layers: [
      { wave: 'bell', notes: ['E4', 'G4', 'A4', 'B4', 'D5', 'E5', 'G5', 'A5', 'B5', 'D6'], attack: 0.003, release: 0.7, gain: 0.16 },
      { wave: 'sine', notes: ['E3', 'G3', 'A3', 'B3', 'D4', 'E4', 'G4', 'A4', 'B4', 'D5'], attack: 0.005, release: 0.4, gain: 0.06 },
    ],
  },
}

// Behind the session: the storm over the city. Rain on the glass, a low neon hum that breathes, and now and then a
// far-off signal pinging between the towers. Quiet enough to work beside for hours; the person can turn it off and
// keep the cues.
const AMBIENCE: ThemeAmbience = {
  reverb: 0.3,
  layers: [
    // Rain: a soft wash that opens and closes over 16 s, and drops ticking on the window.
    { wave: 'pink', drone: true, filter: { type: 'lowpass', hz: 1400, to: 2200 }, gain: 0.1 },
    { wave: 'crackle', scatter: 4, filter: { type: 'highpass', hz: 2000 }, attack: 0.002, release: 0.04, gain: 0.05, pan: -0.3 },
    // Neon hum: two low notes, swelling slowly.
    { wave: 'sine', drone: true, notes: ['E2', 'B2'], filter: { type: 'lowpass', hz: 300 }, tremolo: { hz: 0.15, depth: 0.5 }, gain: 0.07 },
    // A distant signal: one soft bell about every 20 s.
    { wave: 'bell', notes: ['E5', 'G5', 'A5', 'B5', 'D6'], scatter: 0.05, attack: 0.01, release: 2, gain: 0.05, pan: 0.4 },
  ],
}

const AMBIENT: ThemeSetArgs = { ...LOOK, sound: { ambience: AMBIENCE, cues: CUES } }
// The cues alone, should a build find the ambience too costly.
const HEARD: ThemeSetArgs = { ...LOOK, sound: { cues: CUES } }

// From the whole look down to what the oldest build takes: a build refuses a set that names an attribute it lacks,
// or a sound out of range or too costly, and says why in the log.
const LOOKS = [AMBIENT, HEARD, LOOK, BASE] as const

// Typing in the prompt box makes soft, low sounds, ASMR style: for a letter, a muffled two-stage thock with a small
// electronic pop (one of eight keys, each a little left or right, never the same twice running); for a space, a deeper
// thock with a puff of air; a soft bloop falling away for a deletion and a low whoomp for a paste. A cursor move makes
// no sound.
const TAPS = ['tap1', 'tap2', 'tap3', 'tap4', 'tap5', 'tap6', 'tap7', 'tap8'] as const

// The sound for an edit, given the `last` one played: a letter strikes any key but that one.
const soundFor = (e: PromptEditInput, last: string | undefined): string | undefined => {
  if (e.inputText === '') {
    return e.end > e.start ? 'zip' : undefined
  }

  if (e.inputText.length > 1) {
    return 'bloom'
  }

  if (e.inputText === ' ') {
    return 'breath'
  }

  const others = TAPS.filter(tap => tap !== last)
  return others[Math.floor(Math.random() * others.length)]
}

const TYPING_KEY = 'typing-sounds'

export const register: Register = on => {
  // The engine plays no clip on Windows, so a small PowerShell process plays the typing sounds. It watches a signal
  // file, and each key writes a fresh line to it: a stamp and the sound's name.
  let isTypingOn = true
  let player: HookStream<ProcessSpawnChunk, ProcessSpawnResult> | undefined
  let signal: string | undefined
  let lastSound: string | undefined
  let taps = 0
  const run = Date.now()

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

    await $.command.register({ name: 'typing-sounds', description: 'Turn the typing sounds on or off' })
    isTypingOn = (await $.store.get(TYPING_KEY)) !== false

    // The player lives as long as this module, or until the sounds are turned off. Where powershell.exe is missing,
    // as off Windows, the spawn fails and typing stays silent.
    const env = await $.process.hookEnv()
    const data = env.CLAUDE_PLUGIN_DATA

    if (isTypingOn && data !== undefined) {
      void (async () => {
        try {
          player = $.process.spawn({
            argv: [
              'powershell.exe',
              '-NoProfile',
              '-NonInteractive',
              '-ExecutionPolicy',
              'Bypass',
              '-WindowStyle',
              'Hidden',
              '-File',
              `${$.plugin.root}/hooks/typing.ps1`,
            ],
            env: {
              TYPING_SOUNDS: `${$.plugin.root}/sounds`,
              TYPING_SIGNAL: `${data}/typing.signal`,
              TYPING_PARENT: env.CLAUDE_PID ?? '',
            },
          })

          for await (const { stream, text } of player) {
            if (stream === 'stdout' && text.startsWith('ready')) {
              signal = `${data}/typing.signal`
            } else {
              $.ui.log(`typing sounds: ${stream}: ${text.trim()}`, { to: 'debug' })
            }
          }
        } catch (error) {
          $.ui.log(`typing sounds: the player did not start: ${String(error)}`, { to: 'debug' })
        }

        player = undefined
        signal = undefined
      })()
    }

    return next(e)
  })

  on('command.run', { command: 'typing-sounds' }, async $ => {
    isTypingOn = !isTypingOn
    await $.store.set(TYPING_KEY, isTypingOn)

    if (!isTypingOn) {
      // Ending the stream ends the player.
      void player?.return({ code: null, signal: null })

      return { text: 'Typing sounds off.' }
    }

    return { text: player === undefined ? 'Typing sounds on from the next session.' : 'Typing sounds on.' }
  })

  on('prompt.edit', ($, e, next) => {
    const sound = isTypingOn ? soundFor(e, lastSound) : undefined

    if (sound !== undefined && signal !== undefined) {
      lastSound = sound
      taps += 1
      void $.fs.write(signal, `${run}.${taps} ${sound}`).catch(() => undefined)
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
