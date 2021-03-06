import { assert } from "https://deno.land/std@0.140.0/testing/asserts.ts";

import { Network } from "../../NEAT-TS/src/architecture/network.js";

Deno.test("if/Else", () => {
  const json = {
    nodes: [
      { type: "input", squash: "LOGISTIC", index: 0 },
      { type: "input", squash: "LOGISTIC", index: 1 },
      { type: "input", squash: "LOGISTIC", index: 2 },
      {
        type: "output",
        squash: "IF",
        index: 3,
      },
    ],
    connections: [
      { from: 2, to: 3, type: "positive" },
      { from: 1, to: 3, type: "condition" },
      { from: 0, to: 3, type: "negative" },
    ],
    input: 3,
    output: 1,
  };
  const network1 = Network.fromJSON(json);
  const network2 = Network.fromJSON(network1.toJSON());
  for (let p = 0; p < 1000; p++) {
    const a = Math.random() * 2 - 1;
    const b = Math.random() * 2 - 1;
    const flag = Math.random() > 0.5 ? 1 : 0;

    const expected = flag > 0 ? a : b;

    const actual = network2.activate([a, flag, b])[0];

    const diff = Math.abs(expected - actual);
    assert(diff < 0.00001, "If/Else didn't work " + diff);
  }
});
