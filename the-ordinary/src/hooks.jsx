import { useState, createContext, useContext, useRef, Component } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { Http } from "utiliti-js";


export function reactive(_value) {
  const [state, setState] = useState({ _value });

  if (!("value" in state)) {
    Object.defineProperty(state, "value", {
      get() {
        return this._value;
      },
      set(newValue) {
        setState({ _value: newValue });
      },
    });
  }

  return state;
}

const appCtx = createContext(null);

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true, message: error.message, stack: error.stack };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong. {this.state.message}  {this.state.stack}</h1>;
    }

    return this.props.children;
  }
}

const queryClient = new QueryClient();

export function TheOrdinary({ children, errorFallback }) {
  const menuState = reactive(false);
  const cartState = reactive([]);
  const products = reactive([]);
  const recent = reactive([]);

  return (
      <QueryClientProvider client={queryClient}>
        <appCtx.Provider value={{ menuState, cartState, products, recent }}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </appCtx.Provider>
      </QueryClientProvider>
  );
}


export function useMenu() {
  const { menuState } = useContext(appCtx);

  return {
    status: menuState.value,
    toggle: () => (menuState.value = !menuState.value),
  };
}

export function useCart() {
  const { cartState: items } = useContext(appCtx);

  return {
    count: items.value.length,
    add: (product) => {
      const existingItem = items.value.find(
        (item) => item.id === product.id
      );
      if (existingItem) {
        existingItem.quantity += typeCheck.parseInt(product.quantity);
      } else {
        items.value = [...items.value, product];
      }
      setSessionStorage("cartItems", items.value);
    },
    remove: (id) => {
      items.value = items.value.filter((item) => item.id !== id);
      setSessionStorage("cartItems", items.value);
    },
    update: (payload) => {
      const { id, updatedData } = payload;
      const itemIndex = items.value.findIndex((item) => item.id === id);
  
      if (itemIndex !== -1) {
        const updatedItem = {
          ...items.value[itemIndex],
          ...updatedData,
        };
  
        const updatedItems = [
          ...items.value.slice(0, itemIndex),
          updatedItem,
          ...items.value.slice(itemIndex + 1),
        ];
  
        items.value = updatedItems;
        setSessionStorage("cartItems", items.value);
      }
    },
    empty: () => {
      items.value = [];
      setSessionStorage("cartItems", []);
    },
  };
}

const http = new Http();

export function useProducts() {
  const { products } = useContext(appCtx);
  const { isLoading, data } = useQuery("products", async () => {
    const response = await http.get("http://localhost:8123/api/products");
    return response.json();
  });

  if (isLoading) {
    return {
      isLoading,
      products: null,
    };
  } else {
    products.value = data;
    return {
      isLoading,
      products: products.value,
    };
  }
}

export function useProduct(slug) {
  const { isLoading, data } = useQuery(slug, async () => {
    const response = await http.get(
      `http://localhost:8123/api/products/${slug}`
    );
    return response.json();
  });

  if (isLoading) {
    return {
      isLoading,
      product: null,
    };
  } else {
    return {
      isLoading,
      product: data.result,
    };
  }
}

export function useRecentlyViewed() {
  const { recent } = useContext(appCtx);
  
  return {
    products: recent.value,
    add: (product) => {
      const exists = recent.value.find(c => c.id === product.id)
      
      if (!exists) {
        recent.value = [...recent.value, product];
      }
    }
  };
}

export function useCategories() {
  const { isLoading, data } = useQuery("categories", async () => {
    const response = await http.get("http://localhost:8123/api/products/categories");
    return response.json();
  });

  if (isLoading) {
    return {
      isLoading,
      categories: null,
    };
  } else {
    return {
      isLoading,
      categories: data.result,
    };
  }
}

export function useCategoryProducts(name) {
  const { isLoading, data } = useQuery(["category-product", name], async () => {
    const response = await http.get(
      "http://localhost:8123/api/products/categories",
      {
        params: { name },
      }
    );
    return response.json();
  });

  if (isLoading) {
    return {
      isLoading,
      products: null,
    };
  } else {
    return {
      isLoading,
      products: data.result,
    };
  }
}

export function useProductSearch(query) {
  const { isLoading, data } = useQuery(["product-search", query], async () => {
    const response = await http.get(
      "http://localhost:8123/api/products/search",
      {
        params: { q: query },
      }
    );
    return response.json();
  });

  if (isLoading) {
    return {
      isLoading,
      products: null,
    };
  } else {
    return {
      isLoading,
      products: data.result,
    };
  }
}
