import React from 'react'
import { act } from 'react-dom/test-utils'
import { render, unmountComponentAtNode } from 'react-dom'
import App from '../example/counter/App'
import { ActionCollector } from '../src/test-utils/action-collector'

let container: HTMLElement
let actions: ActionCollector

beforeEach(() => {
  container = document.createElement('main')

  document.body.appendChild(container)
})

afterEach(() => {
  unmountComponentAtNode(container)

  container.remove()
})

it('can display the counter', () => {
  act(() => {
    render(<App />, container)
  })

  let counter = document.querySelector('.counter-amount')

  expect(Number(counter?.textContent)).toBe(0)
})

it('can increment and decrement the counter', () => {
  act(() => {
    render(<App />, container)
  })

  let incrementBtn = document.querySelector('.counter-increment')
  let decrementBtn = document.querySelector('.counter-decrement')
  let counter = document.querySelector('.counter-amount')

  expect(incrementBtn).toBeDefined()
  expect(decrementBtn).toBeDefined()
  expect(counter).toBeDefined()

  act(() => {
    incrementBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(Number(counter?.textContent)).toBe(1)

  act(() => {
    decrementBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(Number(document.querySelector('.counter-amount')?.textContent)).toBe(0)
})

it('handles effects', () => {
  act(() => {
    render(<App />, container)
  })

  let incrementBtn = document.querySelector('.counter-increment')
  let counter = document.querySelector('.counter-amount')

  act(() => {
    incrementBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    incrementBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    incrementBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    incrementBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    incrementBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(Number(counter?.textContent)).toBe(5)

  let reachedFour = document.querySelector('.reached-four')

  expect(reachedFour).toBeDefined()
})
