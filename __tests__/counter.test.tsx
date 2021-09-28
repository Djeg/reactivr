import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import App from '../example/counter/App'

let container: HTMLDivElement = document.createElement('div')

beforeEach(() => {
  document.body.appendChild(container)
})

afterEach(() => {
  unmountComponentAtNode(container as HTMLDivElement)
  container.remove()
  container.innerHTML = ''
})


it('can be mounted', () => {
  act(() => {
    render(<App />, container)
  })

  let amount = container.querySelector('.counter-amount')?.textContent

  expect(Number(amount)).toBe(0)
})

it('can triggers actions', () => {
  act(() => {
    render(<App />, container)
  })

  let amount = container.querySelector('.counter-amount')?.textContent

  expect(Number(amount)).toBe(0)

  act(() => {
    container.querySelector('.counter-increment')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  amount = container.querySelector('.counter-amount')?.textContent

  expect(Number(amount)).toBe(1)
})
