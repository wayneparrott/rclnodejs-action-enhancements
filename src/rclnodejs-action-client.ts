/* eslint-disable import/prefer-default-export */

import { 
  ActionFeedback,
  ActionType,
  ActionTypeClassName,
  ActionClient,
  ActionGoal,
  ClientGoalHandle,
  Node,
  TypeClass,
  require as load,
  unique_identifier_msgs 
} from 'rclnodejs';
import { typeClass2String } from './utils';

/**
 * 
 */
export abstract class RclnodejsActionClient<T extends TypeClass<ActionTypeClassName>> {

  //
  private Action: ActionType<T>;

  //
  private _client: ActionClient<T>;

  /**
   * 
   * @param node 
   * @param typeClass 
   * @param actionName 
   */
  constructor(node: Node, typeClass: T, actionName: string) {
    const typeClassName = typeClass2String(typeClass);
    this._client = new ActionClient<T>(
      node,
      typeClass,
      actionName
    );

    this.Action = load(typeClassName) as ActionType<T>;
  }


  /**
   * Send a goal and wait for the goal ACK asynchronously.
   *
   * Return a Promise object that is resolved with a ClientGoalHandle when receipt of the goal
   * is acknowledged by an action server, see client state transition https://index.ros.org/doc/ros2/Tutorials/Understanding-ROS2-Actions/
   *
   * @param goal - The goal request.
   * @param goalUuid - Universally unique identifier for the goal. If None, then a random UUID is generated.
   * @returns A Promise to a goal handle that resolves when the goal request has been accepted or rejected.
   */
  sendGoal(
        goal: ActionGoal<T>,
        goalUuid?: unique_identifier_msgs.msg.UUID): Promise<ClientGoalHandle<T>> {

    return this._client
      .sendGoal(
        goal,
        this.handleFeedback,
        goalUuid);
  }

  /**
   * Check if there is an action server ready to process requests from this client.
   *
   * @returns True if an action server is ready; otherwise, false.
   */
  isActionServerAvailable(): boolean {
    return this._client.isActionServerAvailable();
  }

  /**
   * Wait until the action server is available or a timeout is reached. This
   * function polls for the server state so it may not return as soon as the
   * server is available.
   *
   * @param timeout The maximum amount of time to wait for, if timeout
   * is `undefined` or `< 0`, this will wait indefinitely.
   * @returns True if the service is available.
   */
  waitForActionServer(timeout?: number): Promise<boolean> {
    return this._client.waitForServer(timeout);
  }

  /**
   * Destroy the underlying action client handle.
   */
  destroy() {
    this._client.destroy();
  }

  /**
   * 
   * @param feedbackMessage 
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  handleFeedback(feedbackMessage: ActionFeedback<T>) {
  }

  /**
   * 
   * @returns 
   */
  createGoal(): ActionGoal<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (this.Action as any)['Goal']() as ActionGoal<T>;
  }
}
