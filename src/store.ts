import { DEFAULT_ID } from './actions'
import { SelectorContainer } from './types'
import {
  createActionContainerCollector,
  createRootReducer,
  destroyModuleReducer,
  initModuleReducer,
  initRootState,
  mergeStates,
  removeModule,
} from './reducer'
import {
  Action,
  ActionContainerCollector,
  GlobalReducer,
  ReactiveModule,
  StateCollector,
} from './types'
import { select } from './selector'

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
    this.initModule.bind(this)
    this.destroyModule.bind(this)
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
  public initModule<
    Props extends {} = {},
    Payload = undefined,
    State extends {} = {},
  >(mod: ReactiveModule<Props, Payload, State>, id?: string): void {
    this.state = initModuleReducer(mod, id)(this.state)
  }

  /**
   * Destroy a given reactive module state
   */
  public destroyModule<
    Props extends {} = {},
    Payload = undefined,
    State extends {} = {},
  >(mod: ReactiveModule<Props, Payload, State>, id?: string): void {
    this.state = destroyModuleReducer(mod, id)(this.state)
  }

  /**
   * Return the global state
   */
  public getState() {
    return this.state
  }

  /**
   * Select a given state
   */
  public select<S extends {} = {}, R = undefined>(
    selector: SelectorContainer<any, R>,
    id: string = DEFAULT_ID,
  ): R | undefined {
    return select(selector, id)(this.state)
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
