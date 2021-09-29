import { DEFAULT_ID } from './actions'
import {
  createActionContainerCollector,
  createRootReducer,
  destroyModuleReducer,
  initModuleReducer,
  initRootState,
  mergeStates,
  removeModule,
} from './reducer'
import { select } from './selector'
import { buildLightStore } from './effect'
import {
  Action,
  ActionContainerCollector,
  ActionListener,
  GlobalReducer,
  ReactiveModule,
  SelectorContainer,
  StateCollector,
} from './types'

/**
 * This store is a full driver for any kind of state
 * and actions. It collect actions and creates
 * a global state for any reactive modules
 *
 * @TODO Add the ability to choose differents effect runners
 * @TODO Add some StoreOptions in order to configure the store
 *       behavior
 * @TODO Optimize the effect error handling
 */
export default class Store<S extends {} = {}> {
  private actions: ActionContainerCollector<any, any>

  private listeners: Array<ActionListener<S, any>>

  private reducer: GlobalReducer<S, Action<any>>

  private state: StateCollector<S>

  private modules: ReactiveModule<any, any, S>[]

  private produceEffects: boolean

  constructor(modules: ReactiveModule<any, any, S>[]) {
    this.modules = modules
    this.actions = createActionContainerCollector(modules)
    this.reducer = createRootReducer(this.actions)
    this.state = initRootState(modules)
    this.listeners = []
    this.produceEffects = true

    this.dispatch.bind(this)
    this.initModule.bind(this)
    this.destroyModule.bind(this)
    this.getState.bind(this)
    this.register.bind(this)
    this.unregister.bind(this)
    this.triggerActionListener.bind(this)
    this.listen.bind(this)
    this.addActionListener.bind(this)
    this.removeActionListener.bind(this)
    this.runActionEffects.bind(this)
  }

  /**
   * Dispatch an action and produce a new state
   */
  public async dispatch<P = undefined>(action: Action<P>, id?: string) {
    id
      ? (this.state = this.reducer({ ...action, id })(this.state))
      : (this.state = this.reducer(action)(this.state))

    await this.listen(action)

    if (this.produceEffects) this.runActionEffects(action)
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
   * Enable or disable the effect engine
   */
  public toggleEffectEngine(value?: boolean): void {
    if (undefined === value) {
      this.produceEffects = !this.produceEffects

      return
    }

    this.produceEffects = value
  }

  /**
   * Return the global state
   */
  public getState() {
    return this.state
  }

  /**
   * Return the state for the given module
   */
  public selectModule<S extends {} = {}>(
    mod: ReactiveModule<any, any, S>,
    id: string = DEFAULT_ID,
  ): S | undefined {
    let container = this.state[mod.name]

    if (!container) return undefined

    let state = container[id]

    if (!state) return undefined

    return state as unknown as S
  }

  /**
   * Select a given state
   */
  public select<R = undefined>(
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

  /**
   * Add an action listener
   */
  public addActionListener<P = any>(listener: ActionListener<S, P>): void {
    if (-1 === this.listeners.indexOf(listener)) {
      this.listeners.push(listener)
    }
  }

  /**
   * Remove an action listener
   */
  public removeActionListener<P = any>(listener: ActionListener<S, P>): void {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  /**
   * Trigger all listeners
   */
  private async listen<P = any>(action: Action<P>): Promise<void> {
    return Promise.all(
      this.listeners.map(l => this.triggerActionListener(action, l(this))),
    ).then(() => undefined)
  }

  /**
   * Trigger one listener
   */
  private async triggerActionListener<P = any>(
    action: Action<P>,
    listener: (a: Action<P>) => void | Promise<void>,
  ): Promise<void> {
    return new Promise((res, rej) => {
      try {
        const r: any = listener(action)

        if (r && r.then && r.catch) {
          return r.then(res).catch(rej)
        }

        res(r)
      } catch (e) {
        rej(e)
      }
    })
  }

  /**
   * Run all the effect of an action container
   */
  private async runActionEffects(action: Action<any>): Promise<void> {
    let container = this.actions[action.name]
    let lightStore = buildLightStore(this)

    if (!container) return undefined

    let effs = container.effects || []

    let promises = effs
      .map(eff => {
        try {
          const r: any = eff(lightStore)

          if (r && r.then && r.catch) return r

          return Promise.resolve(r)
        } catch (e) {
          Promise.reject(e)
        }
      })
      // @TODO Handle error more efficiently
      .map(p => p.catch(console.error))
      .map(p => p.then(() => undefined))

    return Promise.all(promises).then(() => undefined)
  }
}
