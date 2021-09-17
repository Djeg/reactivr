/**
 * Define the shape of an action. An action is a simple
 * object with two keys:
 *  - A name wich identified the action
 *  - A payload wich contains a miniaml set of data to
 *    produce the action on an interface.
 */
export type Action<Payload> = {
  name: Symbol
  payload: Payload
}

/**
 * This is a simple helper wich defines an action
 * with a name but no payload.
 */
export type SimpleAction = Action<undefined>

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
export type GlobalReducer<State, Action extends SimpleAction> = (
  action: Action,
) => (state: State) => State

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
  : (payload: Payload) => (state: State) => State

/**
 * Define the shape simple effect
 *
 * @todo make it more complex
 */
export type SimpleEffect = () => Promise<any> | any

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
  toString(): Symbol | String | undefined

  /**
   * The uniq action name has a symbol
   */
  actionUniqName?: Symbol

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
