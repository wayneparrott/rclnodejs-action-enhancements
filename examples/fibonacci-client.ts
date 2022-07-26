import { ActionGoal, ClientGoalHandle, example_interfaces, init, Node, unique_identifier_msgs } from "rclnodejs";
import { RclnodejsActionClient } from "../src/rclnodejs-action-client";

const ACTION_NAME = 'fibonacci';

type FibonnaciGoal = ActionGoal<'example_interfaces/action/Fibonacci'>;
type FibonnaciGoalHandle = ClientGoalHandle<'example_interfaces/action/Fibonacci'>;
type FibonnaciFeedback = example_interfaces.action.Fibonacci_Feedback;

export class FibActionClient extends RclnodejsActionClient<'example_interfaces/action/Fibonacci'> {

  constructor(node: Node, actionName = ACTION_NAME) {
    super(node, 'example_interfaces/action/Fibonacci', actionName);
    console.log('FibonacciActionClient created')
  }

  sendGoal(goal: FibonnaciGoal, goalUuid?: unique_identifier_msgs.msg.UUID): Promise<FibonnaciGoalHandle> {
    const handle = super.sendGoal(goal, goalUuid);
    return handle;
  }

  send(order: number, goalUuid?: unique_identifier_msgs.msg.UUID): Promise<FibonnaciGoalHandle> {
    const goal = this.createGoal();
    goal.order = order;
    return this.sendGoal(goal, goalUuid);
  }

  handleFeedback(feedbackMessage: FibonnaciFeedback): void {
    console.log('feedback: ', feedbackMessage.sequence);
  }
}

async function run() {
  await init();
  const node = new Node('FibClient');
  const client = new FibActionClient(node);
  node.spin();
  const handle = await client.send(10);
  console.log('done');
  console.log('Result: ', await handle.getResult());
}

(async function main(): Promise<void> {
  await run();
})().catch((): void => {
  process.exitCode = 1
})


