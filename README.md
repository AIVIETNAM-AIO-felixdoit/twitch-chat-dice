# Chat Dice: Twitch chat dice roller with a stream overlay

Viewers type `!roll` in Twitch chat to roll dice for tabletop and party streams. The bot posts the result in chat and shows the latest roll on a stream overlay.

Built for the Codex x TwitchCon Hackathon with OpenAI Codex.

## Features

- `!roll` rolls one d20. `!roll 2d6+3` rolls any dice notation (up to 20 dice and 1000 sides).
- Invalid input gets a short explanation in chat instead of an error.
- A 5-second cooldown per viewer keeps chat from flooding.
- A browser-source overlay at `http://localhost:3000` shows the last roll and updates every second.
- Streamers and moderators can use `!roll reset` to clear the overlay. Other viewers cannot reset it. Reset works during a roll cooldown and does not remove that cooldown.

## Requirements

- Node.js 18 or newer
- A Twitch account for the bot (it can be your own account)
- A chat OAuth token with the `chat:read` and `chat:edit` scopes

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file from the example and fill in your values:
   ```bash
   cp .env.example .env
   ```
   - `TWITCH_CHANNEL`: the channel to join, without `#`
   - `TWITCH_BOT_USERNAME`: the account the bot chats as
   - `TWITCH_OAUTH_TOKEN`: the token, starting with `oauth:`. Generate one at https://twitchtokengenerator.com.
3. Load the variables into your shell and start the bot. On Windows PowerShell:
   ```powershell
   Get-Content .env | ForEach-Object { if ($_ -match '^([^#=]+)=(.*)$') { [Environment]::SetEnvironmentVariable($matches[1], $matches[2]) } }
   npm start
   ```
   On macOS or Linux:
   ```bash
   set -a; source .env; set +a; npm start
   ```
4. Open `http://localhost:3000` to check the overlay. In OBS, add a **Browser** source with that URL.

Never commit `.env` or your token. `.gitignore` already excludes it.

## Tests

```bash
npm test
```

The tests cover the dice parser and roller, reset permissions, cooldown preservation, and overlay HTTP state after reset. They do not need Twitch credentials.

## Project layout

| Path | Purpose |
| --- | --- |
| `src/dice.js` | Dice notation parser and roller, with no Twitch code |
| `src/bot.js` | Twitch chat listener, `!roll` handling, and overlay server |
| `public/overlay.html` | Overlay page that polls `/state` |
| `test/dice.test.js` | Unit tests for the dice logic |
| `test/bot.test.js` | Reset permissions and overlay HTTP state tests |

## How Codex was used

The initial scaffold was created with Claude. In this Codex thread, Codex read the handoff, reviewed the bot and dice modules, and ran the original seven tests successfully. The entrant chose `!roll reset` for streamers and moderators. Codex implemented the command using Twitch moderator/broadcaster tags, fixed the overlay user label when cleared, added reset integration tests against the local HTTP endpoint, and updated the test command and this README. The chat command matcher now also requires an exact `!roll` command boundary.

Live Twitch connectivity has not been verified in this thread.

The Codex session ID for the build thread is listed in the Devpost submission.
