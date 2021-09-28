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
