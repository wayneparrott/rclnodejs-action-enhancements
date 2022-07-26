/* eslint-disable import/prefer-default-export */

import {
  ActionResult, 
  ActionFeedback,
  ActionServer,
  ActionType,
  ActionTypeClassName,
  CancelResponse,
  GoalResponse,
  Node,
  ServerGoalHandle,
  TypeClass,
  require as load
} from 'rclnodejs';
import { typeClass2String } from './utils';

/**
 * 
 */
export abstract class RclnodejsActionServer<T extends TypeClass<ActionTypeClassName>> {

  //
  private Action: ActionType<T>;
  
  // 
  _server: ActionServer<T>;

  /**
   * 
   * @param node 
   * @param typeClass 
   * @param actionName 
   */
  constructor(public node: Node, typeClass: T, actionName: string) {
    const typeClassName = typeClass2String(typeClass);
    this._server = new ActionServer<T>(
      node,
      typeClass,
      actionName,
      _ => _ as ActionResult<T>
    );

    this.Action = load(typeClassName) as ActionType<T>;
    this._server.registerGoalCallback(this.handleGoalRequest.bind(this));
    this._server.registerHandleAcceptedCallback(this.handleGoalAccepted.bind(this));
    this._server.registerExecuteCallback(this.execute.bind(this));
    this._server.registerCancelCallback(this.handleCancelRequest);
  }

  /**
   * 
   * @param goalHandle 
   * @returns 
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleGoalRequest(goalHandle: ServerGoalHandle<T>): GoalResponse {
    return GoalResponse.ACCEPT;
  }

  /**
   * 
   * @param goalHandle 
   * 
   */
  handleGoalAccepted(goalHandle: ServerGoalHandle<T>): void {
    goalHandle.execute();
  }

  /**
   * 
   * @param goalHandle 
   * @example
   * ```
   * execute(goalHandle: ServerGoalHandle<T>): ActionResult<T> {
   * 
   *   const feedback = this.createFeedback();
   *   goalHandle.publishFeedback(feedback);
   * 
   *   goalHandle.succeed();
   * 
   *   const result = this.newResult();
   * return result;
   * }
   * ```
   */
  abstract execute(goalHandle: ServerGoalHandle<T>): ActionResult<T>;

  /**
   * 
   * @param goalHandle 
   * @returns 
   */
  handleCancelRequest(goalHandle?: ServerGoalHandle<T>): CancelResponse {
    return CancelResponse.ACCEPT;
  }

  /**
   * 
   * @returns 
   */
  createFeedback(): ActionFeedback<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (this.Action as any)['Feedback']() as ActionFeedback<T>;
  }

  /**
   * 
   * @returns 
   */
  createResult(): ActionResult<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (this.Action as any)['Result']() as ActionResult<T>;
  }
}
