import { ServerGoalHandle, ActionResult, Node, GoalResponse, init, CancelResponse } from "rclnodejs";
import { RclnodejsActionServer } from "../src";

const ACTION_NAME = 'fibonacci';

type FibonnaciGoalHandle = ServerGoalHandle<'example_interfaces/action/Fibonacci'>;
type FibonnaciResult =  ActionResult<'example_interfaces/action/Fibonacci'>;

export class FibActionServer extends RclnodejsActionServer<'example_interfaces/action/Fibonacci'> {

  constructor(node: Node, actionName = ACTION_NAME) {
    super(node, 'example_interfaces/action/Fibonacci', actionName);
    console.log('FibonacciActionServer created');
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleGoalRequest(goalHandle: FibonnaciGoalHandle): GoalResponse {
    console.log('Handle goal request');
    return GoalResponse.ACCEPT;
  }

  handleGoalAccepted(goalHandle: FibonnaciGoalHandle): void {
    console.log('Handle goal accepted');
    goalHandle.execute();
  }

  execute(goalHandle: FibonnaciGoalHandle): FibonnaciResult {
    console.log('Executing goal....', this.Action);

    let sequence = [0, 1];
    const feedback = this.createFeedback();
    for (let i=1; i < goalHandle.request.order; i++) {
      sequence.push(sequence[i] + sequence[i-1]);
      feedback.sequence = sequence;
      goalHandle.publishFeedback(feedback);
    }

    goalHandle.succeed();

    let result = this.createResult();
    result.sequence = sequence;
    return result;
  }

  handleCancelRequest(goalHandle?: FibonnaciGoalHandle): CancelResponse {
    console.log('Handle cancel request');
    return CancelResponse.ACCEPT;
  }
}

async function run() {
  await init();
  const node = new Node('FibServer');
  new FibActionServer(node);
  node.spin();
}

(async function main(): Promise<void> {
  run();
})().catch((): void => {
  process.exitCode = 1
})
