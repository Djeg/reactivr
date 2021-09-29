import { PropertySelector, prop } from './prop'

/**
 * Same as the prop function bu with a default
 * value if the prop doesn't exists
 */
export const propOr =
  <R = any, O extends {} = any>(defaultValue: R, selector: PropertySelector) =>
  (object: O): R => {
    const result = prop(selector)(object)

    return undefined === result ? defaultValue : result
  }
