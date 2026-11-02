const test = require("node:test");
const assert = require("node:assert/strict");
const { parseRoll, rollDice, describeRoll } = require("../src/dice");

test("parses standard notation", () => {
  assert.deepEqual(parseRoll("2d6"), { count: 2, sides: 6, modifier: 0 });
});

test("defaults the count to one die", () => {
  assert.deepEqual(parseRoll("d20+3"), { count: 1, sides: 20, modifier: 3 });
});

test("parses a negative modifier", () => {
  assert.deepEqual(parseRoll("4d8-1"), { count: 4, sides: 8, modifier: -1 });
});

test("rejects malformed input", () => {
  assert.throws(() => parseRoll("hello"), /dice notation/);
  assert.throws(() => parseRoll(""), /dice notation/);
});

test("rejects too many dice or sides", () => {
  assert.throws(() => parseRoll("21d6"), /between 1 and 20/);
  assert.throws(() => parseRoll("1d1001"), /between 2 and 1000/);
});

test("rolls with an injected random source", () => {
  const spec = parseRoll("2d6+1");
  const result = rollDice(spec, () => 0.99);
  assert.deepEqual(result.rolls, [6, 6]);
  assert.equal(result.total, 13);
});

test("describes a roll for chat", () => {
  const spec = parseRoll("2d6+1");
  const result = rollDice(spec, () => 0);
  assert.equal(describeRoll(spec, result), "2d6+1: [1, 1] = 3");
});
