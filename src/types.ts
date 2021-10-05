import Store from './store'

/**
 * Define the shape of an action. An action is a simple
 * object with two keys:
 *  - A name wich identified the action
 *  - A payload wich contains a miniaml set of data to
 *    produce the action on an interface.
 */
export type Action<Payload = undefined> = {
  name: symbol
  payload: Payload
  id?: string
}

/**
 * This is a simple helper wich defines an action
 * with a name but no payload.
 */
export type EmptyAction = Action<undefined>

/**
 * Represent an action that start or stop
 * a reactive module
 */
export type InitAction = Action<ReactiveModule<any, any, any>>

/**
 * This is the shape of an action creator. A simple
 * function that takes a payload and return an action
 */
export type ActionCreator<Payload> = Payload extends undefined
  ? () => Action<undefined>
  : (payload: Payload) => Action<Payload>

/**
 * This is the shape of a global reducer wich must
 * take a given state and an action and returns
 * a new state.
 *
 * Note that this global reducer is a curried function,
 * meaning that it's a function that takes the action and
 * return a function that takes the state
 */
export type GlobalReducer<
  S extends {} = {},
  A extends Action<any> = Action<any>,
> = (action: A) => (state: StateCollector<S>) => StateCollector<S>

/**
 * Define the shape of a dispatch function
 */
export type Dispatch<P = any> = (action: Action<P>) => void

/**
 * Now we can defined the shape of an action reducer wich
 * is quite the same thing as the global one but instead of
 * taking the action, it will only take the payload
 */
export type ActionReducer<
  State extends {} = {},
  Payload = undefined,
> = Payload extends undefined
  ? () => (state: State) => State
  : (payload: Payload) => (state: State) => State | void

/**
 * Define an action listener shape
 */
export type ActionListener<S extends {} = {}, P = any> = {
  (s: Store<S>): (a: Action<P>) => void | Promise<void>
}

/**
 * Define an action listener collector
 */
export type ActionListenerCollector<S extends {} = {}, P = any> = {
  [index: symbol]: Array<ActionListener<S, P>>
}

/**
 * This is the shape of a ligh store
 */
export type LightStore = {
  /**
   * dispatch an action into the store
   */
  dispatch: <P = any>(action: Action<P>, id?: string) => void

  /**
   * Select the state of a module
   */
  selectModule: <S extends {} = any>(
    mod: ReactiveModule<any, any, S>,
    id?: string,
  ) => S

  /**
   * Select a state from a selector
   */
  select: <R = any>(selector: SelectorContainer<any, R>, id?: string) => R
}

/**
 * Define the shape simple effect
 */
export type SimpleEffect = (
  store: LightStore,
) => <P = any>(action: Action<P>) => void | Promise<void>

/**
 * Define the shape of an effect runner
 */
export type StoreExtension<S extends {} = {}, P = any> = (
  store: Store<S>,
  action: Action<P>,
  id?: string,
) => any

/**
 * This is the shape of an ActionContainer. A superset
 * object wich could be used in order to store
 * the action
 */
export type ActionContainer<
  Payload = undefined,
  State extends {} = {},
> = ActionCreator<Payload> & {
  /**
   * Allow the action to be cast in a string in order
   * to easily retrieve it's name.
   */
  toString(): symbol | String | undefined

  /**
   * The uniq action name has a symbol
   */
  actionUniqName: symbol

  /**
   * The name has a string
   */
  actionName?: string

  /**
   * The reducers
   */
  reducers?: ActionReducer<State, Payload>[]

  /**
   * Contains the actions effects
   */
  effects?: SimpleEffect[]

  /**
   * Contains the module name
   */
  module?: ReactiveModule<any, Payload, State>
}

/**
 * This is an action container enhancers
 */
export type ActionContainerEnhancer<
  Payload = undefined,
  State extends {} = {},
> = (
  actionContainer: ActionContainer<Payload, State>,
) => ActionContainer<Payload, State>

/**
 * Define the shape of an action container collector.
 * It's role is to collect all action containers of
 * an application
 */
export type ActionContainerCollector<
  Payload = undefined,
  State extends {} = {},
> = {
  [index: symbol]: ActionContainer<Payload, State>
}

/**
 * Define the shape of a state collector. A state
 * collector will collect each individual states
 * and assign them to a symbol and a Map of
 * state in case of state reproduction
 */
export type StateCollector<State extends {} = {}> = {
  [index: symbol]: {
    [i: string]: State
  }
}

/**
 * This is a standard View Component type wich accepts props
 * and state and merge them into a uniq props argument.
 */
export type ViewComponent<State extends {} = {}, Props extends {} = {}> = (
  props: Props & State,
) => JSX.Element

/**
 * Define the subject of selector
 */
export type SelectorSubject<S extends {} = {}> =
  | symbol
  | ReactiveModule<any, any, S>

/**
 * Define the ability to select a module state part
 */
export type Selector<S extends {} = {}, R = any> = {
  (state: S): R | undefined
}

/**
 * This is a selector container
 */
export type SelectorContainer<S extends {} = {}, R = any> = Selector<S, R> & {
  __kind__: 'selector'
  subject: SelectorSubject<S>
}

/**
 * Define the shape of a reactive module. A reactive
 * module is an object that contains all nescessary informations
 * that will be used to render a module
 */
export type ReactiveModule<
  Props extends {} = {},
  Payload = undefined,
  State extends {} = {},
> = {
  name: symbol
  state: State
  View: ViewComponent<State, Props>
  [actionsOrSelectors: string]:
    | ActionContainer<Payload, State>
    | ActionContainer<ReactiveModule<any, any, any>, any>
    | SelectorContainer<State, any>
    | symbol
    | State
    | ViewComponent<State, Props>
    | any
}

/**
 * Test if a member is an action container
 */
export function isActionContainer(
  container: ActionContainer<any, any> | any,
): container is ActionContainer<any, any> {
  return (
    'function' === typeof container && undefined !== container.actionUniqName
  )
}

/**
 * Test if a member is a seletor container
 */
export function isSelectorContainer(
  container: SelectorContainer<any, any> | any,
): container is SelectorContainer<any, any> {
  return 'function' === typeof container && container['__kind__'] === 'selector'
}

/**
 * Test if a single selector is a symbol
 */
export function isSymbolSubjectSelector<S extends {} = {}>(
  selector: SelectorSubject<S>,
): selector is symbol {
  return 'symbol' === typeof selector
}

/**
 * Retrieve the name of a single subject selector
 */
export function getSubjectSelectorName<S extends {} = {}>(
  selector: SelectorSubject<S>,
): symbol {
  return isSymbolSubjectSelector(selector) ? selector : selector.name
}
