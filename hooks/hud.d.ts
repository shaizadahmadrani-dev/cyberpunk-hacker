/** A small moving mark for each thing a turn can be doing, drawn beside the line that says so. Pure vector, CSS animation. */
export const PULSE: Readonly<Record<'requesting' | 'responding' | 'thinking' | 'tool-input' | 'tool-use', string>>

/** A strip drawn over a reply: it draws itself in, then a light runs along it. Pure vector, CSS animation. */
export const RECEIVED: string

/** The same strip in the other colors, drawn over a message the person sent. */
export const SENT: string
