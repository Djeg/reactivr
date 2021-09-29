/**
 * Define the shape of a property selector
 */
export type PropertySelector = string | number | Array<string | number>

/**
 * Select a property of a object by giving
 * it a property selector (could be a string, a number or
 * an array of both)
 */
export function prop<R = any, O extends {} = any>(
  selector: PropertySelector,
): (object: O) => R | undefined {
  let properties: Array<string> = isArraySelector(selector)
    ? selector.map(s => String(s))
    : [String(selector)]

  let [firstProp, ...restProp] = properties

  return (object: O) => {
    let member = object as unknown as any
    let subject = member[firstProp] as unknown as R | undefined

    if (undefined === subject) return undefined

    if (restProp.length > 0) return prop(restProp)(subject)

    return subject
  }
}

/**
 * Test if a selector is an array
 */
export function isArraySelector(
  selector: PropertySelector,
): selector is Array<string> {
  return 'object' === typeof selector && undefined !== selector.length
}
