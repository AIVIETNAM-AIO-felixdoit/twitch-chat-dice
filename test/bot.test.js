const test = require("node:test");
const assert = require("node:assert/strict");
const { handleRoll, server } = require("../src/bot");

test("overlay reset respects permissions and clears the HTTP state", async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}/state`;
  const state = async () => (await fetch(url)).json();
  const emptyState = {
    user: null,
    text: "Type !roll 2d6 in chat to start.",
    at: null,
  };

  try {
    assert.match(handleRoll("viewer", "2d6"), /rolled 2d6/);
    const rolled = await state();
    assert.equal(rolled.user, "viewer");
    assert.equal(typeof rolled.at, "number");

    assert.match(handleRoll("viewer", "reset"), /only the streamer or a moderator/);
    assert.deepEqual(await state(), rolled);

    assert.match(handleRoll("viewer", " RESET ", { mod: true }), /cleared the overlay/);
    assert.deepEqual(await state(), emptyState);
    // Reset does not remove the existing roll cooldown.
    assert.match(handleRoll("viewer", "d20"), /wait a few seconds/);

    handleRoll("another-viewer", "d20");
    assert.match(handleRoll("streamer", "reset", { badges: { broadcaster: "1" } }), /cleared the overlay/);
    assert.deepEqual(await state(), emptyState);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
  }
});
