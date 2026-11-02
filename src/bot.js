// Twitch chat bot: viewers type !roll in chat, the bot rolls dice,
// posts the result, and updates a stream overlay served from this process.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const tmi = require("tmi.js");
const { parseRoll, rollDice, describeRoll } = require("./dice");

const PORT = Number(process.env.OVERLAY_PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const ROLL_COOLDOWN_MS = 5000;

const lastRoll = { user: null, text: "Type !roll 2d6 in chat to start.", at: null };
const lastRollAt = new Map();

function serveFile(res, file, type) {
  fs.readFile(path.join(PUBLIC_DIR, file), (err, data) => {
    if (err) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": type }).end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === "/state") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(lastRoll));
    return;
  }
  serveFile(res, "overlay.html", "text/html; charset=utf-8");
});

function handleRoll(user, args, tags = {}) {
  if (String(args || "").trim().toLowerCase() === "reset") {
    if (!tags.mod && !tags.badges?.broadcaster) {
      return `@${user} only the streamer or a moderator can reset the overlay.`;
    }
    Object.assign(lastRoll, { user: null, text: "Type !roll 2d6 in chat to start.", at: null });
    return `@${user} cleared the overlay.`;
  }

  const now = Date.now();
  const last = lastRollAt.get(user) || 0;
  if (now - last < ROLL_COOLDOWN_MS) {
    return `@${user} wait a few seconds before rolling again.`;
  }

  let spec;
  try {
    spec = parseRoll(args || "d20");
  } catch (err) {
    return `@${user} ${err.message}`;
  }

  lastRollAt.set(user, now);
  const result = rollDice(spec);
  const text = describeRoll(spec, result);
  Object.assign(lastRoll, { user, text, at: now });
  return `@${user} rolled ${text}`;
}

function main() {
  const channel = process.env.TWITCH_CHANNEL;
  const username = process.env.TWITCH_BOT_USERNAME;
  const token = process.env.TWITCH_OAUTH_TOKEN;

  if (!channel || !username || !token) {
    console.error("Set TWITCH_CHANNEL, TWITCH_BOT_USERNAME and TWITCH_OAUTH_TOKEN. See .env.example.");
    process.exit(1);
  }

  const client = new tmi.Client({
    options: { debug: false },
    identity: { username, password: token.startsWith("oauth:") ? token : `oauth:${token}` },
    channels: [channel],
  });

  client.on("message", (chan, tags, message, self) => {
    if (self) return;
    const match = /^!roll(?:\s+(.*))?$/i.exec(message.trim());
    if (!match) return;
    const reply = handleRoll(tags["display-name"] || tags.username, match[1], tags);
    client.say(chan, reply).catch((err) => console.error("Could not send chat message:", err.message));
  });

  client.connect().then(() => console.log(`Connected to #${channel}`));
  server.listen(PORT, () => console.log(`Overlay at http://localhost:${PORT}`));
}

if (require.main === module) {
  main();
}

module.exports = { handleRoll, server };
