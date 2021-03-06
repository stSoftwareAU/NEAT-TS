import { assert } from "https://deno.land/std@0.140.0/testing/asserts.ts";

import { Network } from "../../NEAT-TS/src/architecture/network.js";

Deno.test("TagNode", () => {
  const json = {
    nodes: [
      { bias: 0, type: "input", squash: "LOGISTIC", index: 0 },
      { bias: 0, type: "input", squash: "LOGISTIC", index: 1 },
      { bias: 0, type: "input", squash: "LOGISTIC", index: 2 },
      {
        bias: 0,
        type: "output",
        squash: "MEAN",
        index: 3,
        tags: [
          {
            name: "hello",
            value: "world",
          },
        ],
      },
    ],
    connections: [
      { weight: 1, from: 0, to: 3 },
      { weight: 1, from: 1, to: 3 },
      { weight: 1, from: 2, to: 3 },
    ],
    input: 3,
    output: 1,
  };
  const network = Network.fromJSON(json);

  const json2 = network.toJSON();

  const network2 = Network.fromJSON(json2);
  const json3 = network2.toJSON();

  // console.info( JSON.stringify( json3, null, 2));

  const tags = json3.nodes[3].tags;
  assert(tags != null, "Should have tags");

  assert(tags.length == 1, "Should have one tag");
});
