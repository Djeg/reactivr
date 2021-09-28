import React from 'react'
import { Provider, Render } from '../../src'
import * as Counter from './Counter'

export default function App() {
  return (
    <Provider modules={[Counter]}>
      <Render state={Counter} />
    </Provider>
  )
}
