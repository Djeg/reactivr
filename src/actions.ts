import {
  Action,
  ActionContainer,
  ActionContainerEnhancer,
  ActionReducer,
  ReactiveModule,
  SimpleEffect,
} from './types'

/**
 * Contains the action default id
 */
export const DEFAULT_ID = '@default'

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
