import { NetworkInterface } from "../../architecture/NetworkInterface.ts";
import { MockWorker } from "./MockWorker.ts";

import { addTag, getTag } from "../../tags/TagsInterface.ts";

export interface RequestData {
  taskID: number;
  initialize?: {
    dataSetDir: string;
    costName: string;
  };
  evaluate?: {
    network: string;
    feedbackLoop: boolean;
  };
  train?: {
    network: string;
    rate: number;
  };
  echo?: {
    ms: number;
    message: string;
  };
}

export interface ResponseData {
  taskID: number;
  duration: number;
  initialize?: {
    status: string;
  };
  evaluate?: {
    error: number;
  };
  train?: {
    network: string;
    error: number;
  };
  echo?: {
    message: string;
  };
}

interface WorkerEventListner {
  (worker: WorkerHandler): void;
}
export interface WorkerInterface {
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  postMessage(data: RequestData): void;
  terminate(): void;
}

let globalWorkerID = 0;
export class WorkerHandler {
  private worker: WorkerInterface;

  private taskID = 1;
  private workerID = ++globalWorkerID;
  private busyCount = 0;
  private callbacks: { [key: string]: CallableFunction } = {};
  private idleListners: WorkerEventListner[] = [];

  constructor(
    dataSetDir: string,
    costName: string,
    direct: boolean = false,
  ) {
    if (typeof dataSetDir === "undefined") {
      throw "dataSet is mandatory";
    }
    const data: RequestData = {
      taskID: this.taskID++,
      initialize: {
        dataSetDir: dataSetDir,
        costName: costName,
      },
    };

    if (!direct) {
      this.worker = new Worker(
        new URL("./deno/worker.js", import.meta.url).href,
        {
          type: "module",
          deno: {
            namespace: true,
            permissions: {
              read: [
                dataSetDir,
              ],
            },
          },
        },
      );
    } else {
      this.worker = new MockWorker();
    }

    this.worker.addEventListener("message", (message) => {
      const me = message as MessageEvent;

      this.callback(me.data as ResponseData);
    });
    this.makePromise(data);
  }

  isBusy() {
    return this.busyCount > 0;
  }

  /** Notify listeners when worker no longer busy */
  addIdleListener(callback: WorkerEventListner) {
    this.idleListners.push(callback);
  }

  private callback(data: ResponseData) {
    const call = this.callbacks[data.taskID.toString()];
    if (call) {
      call(data);
    } else {
      const msg = "No callback";
      console.warn(this.workerID, msg);
      throw msg;
    }
  }

  private makePromise(data: RequestData) {
    this.busyCount++;
    const p = new Promise<ResponseData>((resolve) => {
      const call = (result: ResponseData) => {
        resolve(result);
        this.busyCount--;

        if (!this.isBusy()) {
          this.idleListners.forEach((listner) => listner(this));
        }
      };

      this.callbacks[data.taskID.toString()] = call;
    });

    this.worker.postMessage(data);

    return p;
  }

  terminate() {
    if (this.isBusy()) {
      console.warn(this.workerID, "terminated but still busy", this.busyCount);
    }

    this.worker.terminate();
    this.idleListners.length = 0;
  }

  echo(message: string, ms: number) {
    const data: RequestData = {
      taskID: this.taskID++,
      echo: {
        message: message,
        ms: ms,
      },
    };

    return this.makePromise(data);
  }

  evaluate(network: NetworkInterface, feedbackLoop: boolean) {
    const data: RequestData = {
      taskID: this.taskID++,
      evaluate: {
        network: network.toJSON(),
        feedbackLoop,
      },
    };

    return this.makePromise(data);
  }

  train(network: NetworkInterface, rate: number) {
    const json = network.toJSON();
    delete json.score;
    delete json.tags;
    const error = getTag(network, "error");
    if (error) {
      addTag(json, "untrained", error);
    }
    const data: RequestData = {
      taskID: this.taskID++,
      train: {
        network: json,
        rate: rate,
      },
    };

    return this.makePromise(data);
  }
}
