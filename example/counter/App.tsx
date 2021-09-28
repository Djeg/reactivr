import React from 'react'
import * as Counter from './Counter'
import { Provider, Render } from '../../src/index';

export default function App() {
  return (
    <Provider modules={[Counter]}>
      <Render state={Counter}></Render>
    </Provider>
  )
}
