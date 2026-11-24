import { expect, test } from 'claude-code/testing'

const SPINNER = {
  plugin: 'cyberpunk-hacker',
  surface: 'desktop',
  component: 'Spinner',
  requestId: 'main',
} as const

const REPLY = {
  plugin: 'cyberpunk-hacker',
  surface: 'desktop',
  component: 'AssistantMessage',
  requestId: 'message-1',
} as const

// Whether the marks move, and how they sit beside the app's own rows, is checked by eye in the app.
test('the working line keeps the app row and gains a moving mark, for every mode', async ($, on) => {
  // Nothing sits beneath the mod here: this hook stands for the row the app draws.
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })

  for (const mode of ['requesting', 'responding', 'thinking', 'tool-use'] as const) {
    const ui = await $.ui.mount({ ...SPINNER, props: { word: 'Working', message: null, suffix: '…', mode } })

    expect(await ui.find({ type: 'Svg' })).toBeDefined()
    expect(await ui.find({ type: 'Text' })).toBeDefined()
    await ui.unmount()
  }
})

test('a message the person sent carries the strip, and a task notification does not', async ($, on) => {
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })

  const sent = {
    plugin: 'cyberpunk-hacker',
    surface: 'desktop',
    component: 'UserMessage',
    requestId: 'message-0',
  } as const

  const mine = await $.ui.mount({ ...sent, props: { text: 'hola', origin: { kind: 'composer' }, isExpanded: true } })

  expect(await mine.find({ type: 'Svg' })).toBeDefined()
  expect(await mine.find({ type: 'Text' })).toBeDefined()
  await mine.unmount()

  const notice = await $.ui.mount({
    ...sent,
    props: {
      text: 'done',
      origin: { kind: 'task-notification' },
      isExpanded: true,
      task: { id: 'task-1', status: 'completed', durationMs: 1200 },
    },
  })

  expect(await notice.find({ type: 'Svg' })).toBeUndefined()
  await notice.unmount()
})

test('the block that opens a reply carries the strip, and a summary does not', async ($, on) => {
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })

  const reply = await $.ui.mount({ ...REPLY, props: { text: 'Done.', isFirstOfReply: true } })

  expect(await reply.find({ type: 'Svg' })).toBeDefined()
  expect(await reply.find({ type: 'Text' })).toBeDefined()
  await reply.unmount()

  const summary = await $.ui.mount({ ...REPLY, props: { text: 'Read 3 files.', isFirstOfReply: true, isSummary: true } })

  expect(await summary.find({ type: 'Svg' })).toBeUndefined()
  await summary.unmount()
})
