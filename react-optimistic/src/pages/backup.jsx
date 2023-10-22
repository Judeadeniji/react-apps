import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { reactive } from "../hooks"

const AwaitContext = (createContext());

function usePromiseData() {
  const { promiseData } = useContext(AwaitContext);
  return promiseData;
}

export function Await({ promiseFn, children, fallback }) {
  const [promiseData, setPromiseData] = useState(null);
  const returnRef = reactive([]);
  const thenRef = useRef(null);
  
  useEffect(() => {
    if(Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if(typeof child.type === "function") {
          if(child.type.name !== "Then") {
            throw new Error("You Must Provide <Then callback={() => ...} /> as child to <Await>")
          } else if (child.type.name === "Then") {
            thenRef.current = child
          }
        } else {
          if(!returnRef.value.includes(child)) {
            returnRef.value.push(child);
          }
        }
      }
      returnRef.value = [...returnRef.value]
    } else {
      if(children?.type.name !== "Then") {
        throw new Error("You Must Provide <Then callback={() => ...} /> as child to <Await>");
      }
    }
  }, []);

  useEffect(() => {
    promiseFn().then(data => {
      setPromiseData(data);
    });
  }, [promiseFn]);

  return (
    <AwaitContext.Provider value={{ promiseData }}>
      {promiseData !== null ? thenRef.current : ([...returnRef.value])}
    </AwaitContext.Provider>
  );
}

export function Then({ callback }) {
  try {
    const { promiseData } = useContext(AwaitContext);
    return <>{callback(promiseData)}</>;
  } catch (e) {
    throw new Error("You Must Provide <Then callback={() => ...} /> as child to <Await>");
  }
}

export function Resolve({ fallback, children }) {
  const [resolvedComponent, setResolvedComponent] = useState(null);

  useEffect(() => {
    if (Array.isArray(children.props.children)) {
      throw new Error("Only provide one child to <Resolve> component");
    }

    if (!React.isValidElement(children) || !children.type) {
      throw new TypeError("The provided child is not a valid React element.");
    }
  }, [])

  useEffect(() => {
    async function loadComponent() {
      const component = await children.type({ children: children?.children,... children.props });
      setResolvedComponent(component);
    }

    loadComponent();
  }, [children.type, ...Object.keys(children.props)]);

  if (resolvedComponent) {
    return resolvedComponent;
  }

  return (fallback || []);
}


function setReturn(cb, t) {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve(cb());
    }, t);
  });
}

function TestComponent({ data }) {
  return <h1>{data}</h1>;
}

async function AsyncTestComponent() {
  const data = await setReturn(() => "We are back " + Math.random(), 4000)
  return <h1>Hello World!! {data}</h1>;
}

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
    <h1>{count}</h1>
    <button onClick={() => setCount(c => c+1)}>
    increment
    </button>
    <Resolve fallback={"Say cheese 😁"}>
      <AsyncTestComponent />
    </Resolve>
      <Await promiseFn={() => setReturn(() => "First Await",3000)}>
        <h1>Loading...</h1>
        <Then callback={data => <TestComponent data={data} />} />
      </Await>
      <Await promiseFn={() => setReturn(() => "Second Await",5000)}>
        <h1>Loading...</h1>
        <Then callback={data => <TestComponent data={data} />} />
      </Await>
      
      <Await promiseFn={() => setReturn(() => "third Await",2000)}>
        <h1>Loading...</h1>
      </Await>
    </div>
  );
}

export default App;
