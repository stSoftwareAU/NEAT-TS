/*******************************************************************************
                                      CONFIG
*******************************************************************************/
import { NetworkInterface } from "../architecture/NetworkInterface.ts";

export interface NeatOptions {
  equal?: boolean; // No clue.

  /** Target error 0 to 1 */
  error?: number;

  clear?: boolean;

  costName?: string;

  /** The directory to store the creatures (optional) */
  creatureStore?: string;

  /** number of records per dataset file. default: 2000 */
  dataSetParitionBreak?: number;

  /** The directory to store the experiments (optional) */
  experimentStore?: string;

  /** List of creatures to start with */
  creatures?: NetworkInterface[];

  /** feedback loop ( previous result feeds back into next interaction */
  feedbackLoop?: boolean;

  /** The list of observations to focus one */
  focusList?: number[];
  /** Focus rate */
  focusRate?: number;

  growth?: number;
  elitism?: number;

  /** Once the number of minutes are reached exit the loop. */
  timeoutMinutes?: number;

  /** Tne maximum number of connections */
  maxConns?: number;

  /** Tne maximum number of gates */
  maxGates?: number;

  /** Tne maximum number of nodes */
  maxNodes?: number;

  /** Number of changes per Gene */
  mutationAmount?: number;

  /** Probability of changing a gene */
  mutationRate?: number;

  /** The target population size. */
  popsize?: number;

  /** the number of workers */
  threads?: number;
  /** the initial train rate if evolving or the rate to use when training only; default 0.01 */
  trainRate?: number;
  selection?: any;
  mutation?: any;

  iterations?: number;
  log?: number;
  /** verbose logging default: false */
  verbose?: boolean;
}
