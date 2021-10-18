import * as React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { ActionCollector } from '../src/test-utils'
import Store from '../src/store'
import * as Menu from '../example/SubStateSelector/Menu'
import { createTestingStore } from '../src/test-utils/testStore'
import App from '../example/SubStateSelector/App'
import { act } from 'react-dom/test-utils'

let container: HTMLElement
let store: Store<any>
let actions: ActionCollector

beforeEach(() => {
  container = document.createElement('main')

  let testing = createTestingStore({
    modules: [Menu],
  })

  store = testing.store
  actions = testing.actions

  document.body.appendChild(container)
})

afterEach(() => {
  unmountComponentAtNode(container)

  container.remove()
})

it('can display the menu', () => {
  act(() => {
    render(<App store={store} />, container)
  })

  let menu = document.querySelector('#menu')
  let btn = document.querySelector('header button')

  expect(menu).toBeDefined()
  expect(btn).toBeDefined()

  expect(Number(menu?.classList.length)).toBe(0)
  expect(btn?.textContent).toBe('open')
})

it('can open the menu', () => {
  act(() => {
    render(<App store={store} />, container)
  })

  let menu = document.querySelector('#menu')

  expect(menu).toBeDefined()

  expect(Number(menu?.classList.length)).toBe(0)

  act(() => {
    store.dispatch(Menu.toggle())

    render(<App store={store} />, container)
  })

  let menu2 = document.querySelector('#menu')
  let btn = document.querySelector('header button')

  expect(menu2).toBeDefined()
  expect(btn).toBeDefined()

  expect(Number(menu2?.classList.length)).toBe(1)
  expect(menu2?.classList.item(0)).toBe('is-open')
  expect(btn?.textContent).toBe('close')
})
