import { useState } from "react";

export default function useReactive(input) {
  const store = {};
  const [getter, setter] = useState(input);

  Object.defineProperty(store, "value", {
    get() {
      return getter;
    },
    set(value) {
      setter(value);
    },
  });
  
  return store;
}
