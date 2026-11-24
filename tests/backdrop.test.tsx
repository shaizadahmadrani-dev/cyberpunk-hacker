import { expect, test } from 'claude-code/testing'

const BACKDROP = {
  plugin: 'cyberpunk-hacker',
  component: 'Backdrop',
  requestId: 'backdrop',
  props: {
    scene: 'neon-city',
    plugin: 'cyberpunk-hacker',
    glass: { blur: 14, tint: '#05090b', opacity: 0.74 },
  },
} as const

// The test host has no `$.theme`, so the look itself is checked by eye in the app.
test('the backdrop draws the city as an Svg on desktop and mobile', async $ => {
  for (const surface of ['desktop', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...BACKDROP, surface })
    const svg = await ui.find({ type: 'Svg' })

    expect(svg).toBeDefined()
    await ui.unmount()
  }
})
