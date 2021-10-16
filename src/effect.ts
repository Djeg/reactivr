import { DEFAULT_ID } from './actions'
import Store from './store'
import {
  isReactiveModule,
  isSelectorContainer,
  isSymbol,
  LightStore,
  SelectorContainer,
  StoreExtension,
} from './types'

/**
 * Add the ability to run simple effect based on thunk
 *
 * @TODO Find a way to handle errors more efficiently
 */
export const simpleEffectRunner: StoreExtension<any, any> = (
  store,
  action,
  id,
) => {
  let container = store.getActionContainer(action)
  let lightStore = buildLightStore(store, id)

  if (!container) return undefined

  let effs = container.effects || []

  let promises = effs
    .map(eff => {
      try {
        const r: any = eff(lightStore)(id ? { ...action, id } : action)

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

/**
 * Build a light store on top of a store
 */
export const buildLightStore = (
  store: Store<any>,
  stateId: string = DEFAULT_ID,
): LightStore => {
  const dispatch: LightStore['dispatch'] = (action, id = stateId) => {
    store.dispatch(action, id)
  }

  const select: LightStore['select'] = (selector, id = stateId) => {
    let state = null

    if (isSymbol(selector)) {
      let allState = store.getState()
      state = allState[selector][id]
    }

    if (isSelectorContainer(selector)) {
      state = store.select(selector as unknown as SelectorContainer<any>, id)
    }

    if (isReactiveModule(selector)) {
      state = store.selectModule(selector, id)
    }

    if (undefined === state)
      throw new Error(`
        Unable to select the state.


        This is probably due to a missing assignement inside
        your Provider components or a missing Render.
        Make sure you have assign the module correctly inside
        the container and you have called Render with the
        right module id.
      `)

    return state
  }

  return {
    dispatch,
    select,
  }
}
