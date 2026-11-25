# Cyberpunk hacker

A theme mod for Claude Code: near-black surfaces, phosphor-green text, neon cyan and magenta accents, monospace type, cut-corner message panels, and an animated backdrop of a neon city that tells a one-minute story on a seamless loop.

## What's in it

- **Colors and type** (dark only): terminal-style mono font, neon headings, git colors to match.
- **Message panels**: cut corners with neon brackets; tool calls as green-edged chips.
- **Animated backdrop** (desktop and mobile apps): a storm over a neon street, a holographic whale, a drone swarm, a police chase, a rooftop fight, and a small orange creature hacking away at its laptop in a flat over a shop.
- **Live marks** (desktop app): a small animation beside the working line for each thing a turn can be doing, and a strip over each message.
- **Sound** (desktop app), played once you press the speaker in the session's title bar: an ambience of the storm (rain on the glass, a low neon hum, a far-off signal) and a soft cue for sending, each tool call, a question, the end of a turn, an error, a compaction and a click on the city, whose note climbs from left to right.
- **Typing sounds** (desktop app on Windows): quiet, low taps as you type in the prompt box, ASMR style, best on headphones. A letter is struck like a good mechanical key: a soft, muffled thock with a small electronic pop as it bottoms out, then the faint click of its return. There are eight keys, each a little left or right in stereo, and the same one never sounds twice in a row. A space is a deeper thock with a puff of air, a deletion a soft bloop falling away to the right and a paste a low, muffled whoomp. The engine has no audio player on Windows, so a small hidden PowerShell process plays them, for as long as the session lives. They don't follow the speaker button: `/typing-sounds` turns them off or on, and the choice is kept across sessions.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install cyberpunk-hacker --marketplace shaizadahmadrani-dev/cyberpunk-hacker
```

Answer `y` to add the marketplace, then pick a scope (the user scope applies the theme to every session).

From a shell:

```
claude plugin install cyberpunk-hacker --marketplace shaizadahmadrani-dev/cyberpunk-hacker
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `shaizadahmadrani-dev/cyberpunk-hacker`, then **Add plugin**.

## Uninstall

```
claude plugin uninstall cyberpunk-hacker@shaiz-mods
claude plugin marketplace remove shaiz-mods
```

## License

[MIT](LICENSE). The license covers this code only.

## Note

Unofficial fan art. This project is not affiliated with or endorsed by Anthropic; Claude and its mascot belong to Anthropic.
