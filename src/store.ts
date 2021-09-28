import {
  createActionContainerCollector,
  createRootReducer,
  initRootState,
  mergeStates,
  removeModule,
} from './reducer'
import {
  Action,
  ActionContainerCollector,
  GlobalReducer,
  ModuleStarterContainer,
  ReactiveModule,
  StateCollector,
} from './types'

/**
 * This store is a full driver for any kind of state
 * and actions. It collect actions and creates
 * a global state for any reactive modules
 */
export default class Store<S extends {} = {}> {
  private actions: ActionContainerCollector<any, any>

  private reducer: GlobalReducer<S, Action<any>>

  private state: StateCollector<S>

  private modules: ReactiveModule<any, any, S>[]

  constructor(modules: ReactiveModule<any, any, S>[]) {
    this.modules = modules
    this.actions = createActionContainerCollector(modules)
    this.reducer = createRootReducer(this.actions)
    this.state = initRootState(modules)

    this.dispatch.bind(this)
    this.startModule.bind(this)
    this.stopModule.bind(this)
    this.getState.bind(this)
    this.register.bind(this)
    this.unregister.bind(this)
  }

  /**
   * Dispatch an action and produce a new state
   */
  public dispatch<P = undefined>(action: Action<P>, id?: string) {
    id
      ? (this.state = this.reducer({ ...action, id })(this.state))
      : (this.state = this.reducer(action)(this.state))
  }

  /**
   * Initialize a given reactive module state
   */
  public startModule<
    Props extends {} = {},
    Payload = undefined,
    State extends {} = {},
  >(mod: ReactiveModule<Props, Payload, State>, id?: string): void {
    id
      ? (this.state = this.reducer({
          name: Symbol('@start'),
          payload: mod,
          id,
        })(this.state))
      : (this.state = this.reducer({
          name: Symbol('@start'),
          payload: mod,
        })(this.state))
  }

  /**
   * Destroy a given reactive module state
   */
  public stopModule<
    Props extends {} = {},
    Payload = undefined,
    State extends {} = {},
  >(mod: ReactiveModule<Props, Payload, State>, id?: string): void {
    id
      ? (this.state = this.reducer({
          name: Symbol('@stop'),
          payload: mod,
          id,
        })(this.state))
      : (this.state = this.reducer({
          name: Symbol('@stop'),
          payload: mod,
        })(this.state))
  }

  /**
   * Return the global state
   */
  public getState() {
    return this.state
  }

  /**
   * Register a new reactive module
   */
  public register<
    Props extends {} = {},
    Payload = undefined,
    State extends {} = {},
  >(mod: ReactiveModule<Props, Payload, State>): void {
    for (let m of this.modules) {
      if (m.name === mod.name) {
        return
      }
    }

    this.modules.push(mod as ReactiveModule<any, any, any>)
    this.actions = createActionContainerCollector(this.modules)
    this.reducer = createRootReducer(this.actions)
    this.state = mergeStates(this.state, initRootState(this.modules))
  }

  /**
   * Unregister a reactive module
   */
  public unregister<
    Props extends {} = {},
    Payload = undefined,
    State extends {} = {},
  >(mod: ReactiveModule<Props, Payload, State>): void {
    let newModules = this.modules.filter(m => m.name !== mod.name)

    if (newModules.length === this.modules.length) {
      return
    }

    this.modules = newModules
    this.actions = createActionContainerCollector(this.modules)
    this.reducer = createRootReducer(this.actions)
    this.state = removeModule(mod, this.state)
  }
}
