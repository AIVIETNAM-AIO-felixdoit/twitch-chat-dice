# Handoff for Codex

Written for: the Codex agent picking up this project, and the entrant who will check its work.

## Context

This is a Twitch chat dice roller for the Codex x TwitchCon Hackathon. The first version was scaffolded with Claude, not Codex. Codex is now taking over to extend and maintain it, so the Codex thread is where the build work should be recorded.

Current state:
- `src/dice.js`: dice notation parser and roller, with no Twitch code. Limits: 1 to 20 dice, 2 to 1000 sides.
- `src/bot.js`: tmi.js chat listener for `!roll`, with a 5-second per-user cooldown and an HTTP server on `OVERLAY_PORT` (default 3000) that serves `public/overlay.html` and `/state`.
- `public/overlay.html`: polls `/state` every second.
- `test/dice.test.js`: 7 unit tests. Run them with `npm test`.
- Not yet tested against live Twitch. Only the unit tests and a module load check have run.

## Rules to respect

- Keep the project connected to Twitch (chat, overlay, API, EventSub or Extension).
- Never commit `.env` or any token. `.gitignore` already excludes it.
- Keep `npm test` passing after every change.
- Do not add dependencies without a reason. `tmi.js` is pinned to `1.8.5`.

## Tasks for Codex (in order)

1. Read `src/bot.js` and `src/dice.js` and summarize how they work in the thread. Do not change code yet.
2. Run `npm test`. Fix anything that fails and report the result.
3. Add one feature the entrant chooses from this list. Ask the entrant which one if they have not said:
   - `!roll reset` for the streamer only (check `tags.mod` or `tags.badges.broadcaster`), which clears the overlay.
   - Keep the last 5 rolls on the overlay instead of only the latest one.
   - Read a viewer's roll history with `!rolls`.
4. Add tests for the new feature in `test/`.
5. Update the "Features" and "How Codex was used" sections of `README.md`. Describe only what Codex actually did in this thread.

## Done means

- `npm test` passes.
- `npm start` connects to the channel in `.env` and answers `!roll` in chat.
- The overlay at `http://localhost:3000` updates after a roll.
- The entrant can point to which changes were made in this Codex thread.
