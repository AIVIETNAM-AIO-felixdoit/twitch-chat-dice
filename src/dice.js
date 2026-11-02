// Parses dice notation such as "2d6", "d20+3" or "4d8-1".
// Kept free of Twitch and network code so it can be unit tested on its own.

const MAX_DICE = 20;
const MAX_SIDES = 1000;
const NOTATION = /^(\d*)d(\d+)([+-]\d+)?$/i;

function parseRoll(input) {
  const match = NOTATION.exec(String(input || "").trim());
  if (!match) {
    throw new Error('Use dice notation like "2d6", "d20" or "4d8+1".');
  }

  const count = match[1] === "" ? 1 : Number(match[1]);
  const sides = Number(match[2]);
  const modifier = match[3] ? Number(match[3]) : 0;

  if (count < 1 || count > MAX_DICE) {
    throw new Error(`You can roll between 1 and ${MAX_DICE} dice.`);
  }
  if (sides < 2 || sides > MAX_SIDES) {
    throw new Error(`Dice need between 2 and ${MAX_SIDES} sides.`);
  }

  return { count, sides, modifier };
}

// `random` returns a float in [0, 1). It is injectable so tests are deterministic.
function rollDice(spec, random = Math.random) {
  const rolls = [];
  for (let i = 0; i < spec.count; i += 1) {
    rolls.push(Math.floor(random() * spec.sides) + 1);
  }
  const total = rolls.reduce((sum, value) => sum + value, 0) + spec.modifier;
  return { rolls, modifier: spec.modifier, total };
}

function describeRoll(spec, result) {
  const notation = `${spec.count}d${spec.sides}${spec.modifier ? (spec.modifier > 0 ? "+" : "") + spec.modifier : ""}`;
  return `${notation}: [${result.rolls.join(", ")}] = ${result.total}`;
}

module.exports = { parseRoll, rollDice, describeRoll, MAX_DICE, MAX_SIDES };
