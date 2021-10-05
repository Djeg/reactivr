import { Action, StoreExtension, ActionContainer } from '../types'

export type ActionPayload = Action<any> | symbol | ActionContainer<any, any>

/**
 * Define the ability to collect and retrieve actions
 * that has been dispatched
 */
export class ActionCollector {
  private actions: Action<any>[]

  /**
   * Retrieve the length of the actions collector
   */
  get length(): number {
    return this.actions.length
  }

  constructor() {
    this.actions = []
  }

  /**
   * Retrieve the last action dispatched
   */
  last(): Action<any> | undefined {
    return this.actions[0]
  }

  /**
   * Retrieve the first action that match the given
   * payload
   *
   * @throws Error if the payload does not match
   */
  getLast(payload: ActionPayload): Action<any> {
    const action = this.actions.find(
      action => action.name === this.getPayloadName(payload),
    )

    if (!action)
      throw new Error(`
        No action named ${this.getPayloadName(
          payload,
        ).toString()} has been dispatched yet
      `)

    return action
  }

  /**
   * Retrieve the first action dispatched
   */
  first(): Action<any> | undefined {
    return this.actions[this.actions.length - 1]
  }

  /**
   * Retrieve all actions of the given payload dispatched
   */
  all(payload?: ActionPayload): Action<any>[] {
    return payload
      ? this.actions.filter(
          action => action.name === this.getPayloadName(payload),
        )
      : this.actions
  }

  /**
   * Test if an action has been dispatch
   */
  has(payload: ActionPayload): boolean {
    const name = this.getPayloadName(payload)

    return !!this.actions.filter(action => action.name === name).length
  }

  /**
   * Clear all actions collected
   */
  clear(): void {
    this.actions = []
  }

  /**
   * Contains the store extension used to collect
   * actions
   */
  getExtension(): StoreExtension<any> {
    return (store, action, id) => {
      this.actions.push({ ...action, id })
    }
  }

  /**
   * Retrieve the uniq name of an action payload
   */
  private getPayloadName(payload: ActionPayload): symbol {
    return this.isSymbolPayload(payload)
      ? payload
      : this.isActionContainer(payload)
      ? payload.actionUniqName
      : payload.name
  }

  /**
   * Test if the payload is a symbol
   */
  private isSymbolPayload(payload: ActionPayload): payload is symbol {
    return 'symbol' === typeof payload
  }

  /**
   * Test if the payload is an action container
   */
  private isActionContainer(
    payload: ActionPayload,
  ): payload is ActionContainer<any, any> {
    return 'function' === typeof payload
  }
}
