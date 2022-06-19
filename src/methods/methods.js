/*******************************************************************************
                                  METHODS
*******************************************************************************/
import { Activation } from "./activation.js";

import { Selection } from "./selection.js";
import { Crossover } from "./crossover.js";
import { Cost } from "./cost.js";
import { Gating } from "./gating.js";
import { ConnectionGroup } from "./ConnectionGroup.ts";
import { Rate } from "./rate.js";

export const Methods = {
  activation: Activation,

  selection: Selection,
  crossover: Crossover,
  cost: Cost,
  gating: Gating,
  connection: ConnectionGroup,
  rate: Rate,
};
