import React, { useState, useEffect } from "react";
import {
  Await,
  usePromiseData,
  For,
  Show,
  Switch,
  Match,
  setReturn,
  RCXStoreProvider,
  defineStore,
  useStore,
  useStoreState,
  useComputed,
  useActions,
} from "rc-extended";
import { ErrorBoundary } from "../hooks";

// define our store
const c = defineStore("counter", {
  state: () => ({
    // define state
    count: 0
  }),
  actions: {
    // update state
    increment: ({ count, ...r }) => ({ ...r, count: count + 1 })
  },
  computed: {
    // derive state
    double: ({ state: { count } }) => count * 2
  },
  methods: {
    // other methods
    
  }
})

function Main() {
  //const { state: { count }, actions: { increment }, computed: { double } } = base(c)
 const state = useStoreState(c)
 const { double } = useComputed(c)
  const { increment } = useActions(c)
  return (
    <>
      <h1>Count is {state.count}</h1>
       <h1>Double the Count is {double()}</h1>
      <button onClick={increment}>increment</button>
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <RCXStoreProvider>
        <Main />
      </RCXStoreProvider>
    </ErrorBoundary>
  )
}

export default App;
