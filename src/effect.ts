import Store from './store'
import { DEFAULT_ID } from './actions'
import { getSubjectSelectorName, LightStore } from './types'

/**
 * Build a light store on top of a store
 */
export const buildLightStore = (store: Store<any>): LightStore => {
  const dispatch: LightStore['dispatch'] = (action, id = DEFAULT_ID) => {
    store.dispatch(action, id)
  }

  const selectModule: LightStore['selectModule'] = (mod, id = DEFAULT_ID) => {
    const state = store.selectModule(mod, id)

    if (undefined === state)
      throw new Error(`
        Unable to select the state of the module ${mod.name.toString()} (${id}).


        This is probably due to a missing assignement inside
        your Provider components or a missing Render.
        Make sure you have assign the module correctly inside
        the container and you have called Render with the
        right module id.
      `)

    return state
  }

  const select: LightStore['select'] = (selector, id) => {
    const state = store.select(selector, id)

    if (undefined === state)
      throw new Error(`
        Unable to select the state of the module ${getSubjectSelectorName(
          selector.subject,
        ).toString()} (${id}).


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
    selectModule,
  }
}
