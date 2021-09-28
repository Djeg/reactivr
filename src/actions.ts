import {
  Action,
  ActionContainer,
  ActionContainerEnhancer,
  ActionReducer,
  ReactiveModule,
  SimpleEffect,
} from './types'

/**
 * This symbol is used to start a module
 */
export const START_ID = '@start'
export const START = Symbol(START_ID)

/**
 * This symbol is used to stop a module
 */
export const STOP_ID = '@stop'
export const STOP = Symbol(STOP_ID)

/**
 * This function generate a uniq action name
 */
export const uniqName = () => `_${Math.random().toString(36).substr(2, 9)}`

/**
 * Creates an ActionCreator
 */
export function action<Payload = undefined, State extends {} = {}>(
  ...enhancers: ActionContainerEnhancer<Payload, State>[]
): ActionContainer<Payload, State> {
  let name = uniqName()
  let uname = Symbol(name)

  let actionCreator = (<unknown>((payload?: Payload) => ({
    name: uname,
    payload: payload ?? undefined,
  }))) as ActionContainer<Payload, State>

  actionCreator.toString = () => name
  actionCreator.actionUniqName = uname
  actionCreator.actionName = name
  actionCreator.reducers = []
  actionCreator.effects = []

  for (let enhancer of enhancers) {
    actionCreator = enhancer(actionCreator)
  }

  return actionCreator
}

/**
 * Enhance an action container by giving it a name
 */
export function when<P = undefined, S extends {} = {}>(name: string) {
  const whenActionEnhancer: ActionContainerEnhancer<P, S> = actionContainer => {
    let uname = Symbol(name)

    let newActionCreator = (<unknown>((payload?: P) => ({
      name: uname,
      payload: payload ?? undefined,
    }))) as ActionContainer<P, S>

    newActionCreator.toString = () => name
    newActionCreator.actionUniqName = uname
    newActionCreator.actionName = name
    newActionCreator.reducers = actionContainer.reducers
    newActionCreator.effects = actionContainer.effects

    return newActionCreator
  }

  return whenActionEnhancer
}

/**
 * Enhance an action by giving it the role of a starter
 * action
 */
export function whenStart<S extends {} = {}>() {
  const whenStartEnhancer: ActionContainerEnhancer<
    ReactiveModule<any, any, S>,
    S
  > = actionContainer => {
    let uname = Symbol(START_ID)

    let newActionCreator = (<unknown>((
      payload?: ReactiveModule<any, any, any>,
    ) => ({
      name: uname,
      payload: payload,
    }))) as ActionContainer<ReactiveModule<any, any, S>, S>

    newActionCreator.toString = () => START_ID
    newActionCreator.actionUniqName = uname
    newActionCreator.actionName = START_ID
    newActionCreator.reducers = actionContainer.reducers
    newActionCreator.effects = actionContainer.effects

    return newActionCreator
  }

  return whenStartEnhancer
}

/**
 * Enhance an action by giving it the role of a stopper
 * action
 */
export function whenStop<S extends {} = {}>() {
  const whenStartEnhancer: ActionContainerEnhancer<
    ReactiveModule<any, any, S>,
    S
  > = actionContainer => {
    let uname = Symbol(STOP_ID)

    let newActionCreator = (<unknown>((
      payload?: ReactiveModule<any, any, any>,
    ) => ({
      name: uname,
      payload: payload,
    }))) as ActionContainer<ReactiveModule<any, any, S>, S>

    newActionCreator.toString = () => STOP_ID
    newActionCreator.actionUniqName = uname
    newActionCreator.actionName = STOP_ID
    newActionCreator.reducers = actionContainer.reducers
    newActionCreator.effects = actionContainer.effects

    return newActionCreator
  }

  return whenStartEnhancer
}

/**
 * Enhance an action container by attaching it a reducer
 */
export function reduce<P = undefined, S extends {} = {}>(
  reducer: ActionReducer<S, P>,
) {
  const reduceEnhancer: ActionContainerEnhancer<P, S> = actionContainer => {
    actionContainer.reducers?.push(reducer)

    return actionContainer
  }

  return reduceEnhancer
}

/**
 * Attach an effect to an action container
 */
export function produce<P = undefined, S extends {} = {}>(
  effect: SimpleEffect,
) {
  const produceEnhancer: ActionContainerEnhancer<P, S> = actionContainer => {
    actionContainer.effects?.push(effect)

    return actionContainer
  }

  return produceEnhancer
}

/**
 * Test if an action is a @start action
 */
export function isStartAction(action: Action<any>): boolean {
  return isStartActionName(action.name)
}

/**
 * Test if an action is a stop action
 */
export function isStopAction(action: Action<any>): boolean {
  return isStopActionName(action.name)
}

/**
 * Test if an action name is a @start one
 */
export function isStartActionName(name: symbol): boolean {
  return new RegExp(START_ID).test(name.toString())
}

/**
 * Test if an action name is a @stop one
 */
export function isStopActionName(name: symbol): boolean {
  return new RegExp(STOP_ID).test(name.toString())
}
