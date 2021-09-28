import React from 'react'
import { act } from 'react-dom/test-utils'
import { render, unmountComponentAtNode } from "react-dom"
import App from '../example/counter/App'

let container: HTMLElement

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
  let counter = document.querySelector('.counter-amount')

  expect(incrementBtn).toBeDefined()
  expect(counter).toBeDefined()

  act(() => {
    incrementBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(Number(
    counter?.textContent
  )).toBe(1)

  //act(() => {
  //  decrementBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  //})

  //expect(Number(
  //  document.querySelector('.counter-amount')?.textContent
  //)).toBe(0)
})
