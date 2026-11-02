# Submission notes (not part of the repo; for the Devpost form)

Written for: the hackathon entrant filling out the Devpost form.

## Checklist

- [ ] Deadline: 2 Nov 2026, 2:00 PM PT, which is 3 Nov 2026, 5:00 AM GMT+7. Check the countdown on the Devpost page.
- [x] Create the GitHub repo and push this folder. `.env` is not included. Repo: https://github.com/AIVIETNAM-AIO-felixdoit/twitch-chat-dice
- [ ] Test the bot with a real Twitch test channel and record a short video of it.
- [ ] Record a demo video under 3 minutes. Show a `!roll` in chat, the overlay updating, and a short look at the Codex thread.
- [ ] Upload the video to YouTube as public or unlisted. Do not use copyrighted music.
- [x] Run `/status` in the Codex thread where most of the build happened and copy the session ID. Session ID: `01a19dfa-c1a9-7781-8b13-c611ee07c070`
- [ ] On Devpost, click "Start project", add the repo URL, video URL, description, and session ID, then click Submit. A saved draft does not count.

## Project description (draft)

Chat Dice brings tabletop-style dice rolling into Twitch chat. Viewers type `!roll` to roll a d20, or `!roll 2d6+3` (or any dice notation up to 20 dice and 1000 sides). The bot replies in chat with each die and the total, and a stream overlay shows the latest roll with the viewer's name.

It is built for dice and party streams, where chat can take part in the game without any setup. A per-viewer cooldown and input limits keep it from being spammed.

Technical summary: Node.js, tmi.js for Twitch chat, a small HTTP server that serves the overlay and a JSON state endpoint, and a dice module with unit tests that does not depend on Twitch. How Codex was used (from the Codex thread): the initial scaffold was created before the Codex thread started. In the Codex thread, Codex read the handoff file, reviewed the bot and dice modules, and ran the original seven tests successfully. The entrant chose a `!roll reset` command for streamers and moderators. Codex implemented it using Twitch moderator and broadcaster tags, fixed the overlay label after reset, added reset tests against the local HTTP endpoint, and tightened the `!roll` command matcher so `!rolls` is not matched. Live Twitch connectivity was not verified in the Codex thread.

[Before submitting: confirm this matches your own Codex thread. Add the prompts you used and what you changed yourself.]

## Video outline (under 3 minutes)

1. 0:00–0:15: What the project does and who it is for.
2. 0:15–1:15: Show the bot running in a test channel. Type `!roll`, then `!roll 4d8+2`, then an invalid roll. Show the overlay updating.
3. 1:15–2:20: Show Codex working on the project and explain one prompt that changed the code.
4. 2:20–2:50: Run `npm test` and show the passing tests.
5. 2:50–3:00: Summary and next ideas, such as a viewer poll or a shared initiative tracker.

## Ideas to make it stronger if there is time

- Add `!roll` results to a shared tabletop initiative order.
- Add a streamer-only command to reset the overlay.
- Add an alert sound through a browser source.
