import { createContext, useContext, useState } from "react"
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "react-query";

class DB {
  constructor() {
    this.store = new Map([
      ["sent", [{
        type: "sent",
        message: "Hi 👋",
        local: false,
        timestamp: new Date()
      }]],
      ["received", [{
        type: "received",
        message: "How are you doing?",
        local: false,
        timestamp: new Date()
      }]],
    ]);
  }

  async create(type, data) {
    return await new Promise((fulfil) => {
      const response = {
        type,
        message: data,
        timestamp: new Date(),
        local: false,
      };

      setTimeout(() => {
        this.store.get(type).push(response);
        fulfil(response);
      }, 1000);
    });
  }

  async readAll() {
    return await new Promise((fulfil) => {
      setTimeout(() => {
        const allMessages = [];
        for (const [type, messages] of this.store.entries()) {
          allMessages.push(...messages.map(message => ({ type, ...message })));
        }
        
        allMessages.sort((a, b) => a.timestamp - b.timestamp);
        
        fulfil({
          messages: allMessages,
          count: allMessages.length,
        });
      }, 2000);
    });
  }

  get length() {
    const totalLength = Array.from(this.store).reduce((total, [, messages]) => total + messages.length, 0);
    return totalLength;
  }
}


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
const queryClient = new QueryClient();

export function AppProvider({ children }) {
  const legacyChats = reactive([]);
  const temp = reactive({
    type: "sent",
    message: ""
  });
  
  // chats from react query will be cached by react query by default;
  return (
    <QueryClientProvider client={queryClient}>
      <appCtx.Provider value={{ legacyChats, temp }}>
        {children}
      </appCtx.Provider>
    </QueryClientProvider>
  )
}

const server = new DB();

export function useQueryChats() {
  const queryClient = useQueryClient();

  const { isLoading, isFetching, data, refetch } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      return await server.readAll();
    },
  });

  const createMutation = useMutation({
    mutationFn: async ({ type, message }) => await server.create(type, message),
    onMutate: async ({ type, message }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['chats'] })
  
      // Snapshot the previous value
      const previousChats = queryClient.getQueryData(['chats'])
  
      // Optimistically update to the new value
      queryClient.setQueryData(['chats'], (prevData) => {
        return {
          ...prevData,
          messages: [
            ...prevData.messages,
            { 
              type,
              message,
              timestamp: new Date(),
              local: true
            }
          ],
          count: prevData.count + 1
        };
      });
  
      // Return a context object with the snapshotted value
      return { previousChats }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newMessage, context) => {
      queryClient.setQueryData(['chats'], context.previousChats)
    },
    
    // refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  });

  return {
    chats: data,
    create: async (type, data) => {
      await createMutation.mutateAsync({ type, message: data });
      if (type === "sent") {
        setTimeout(async () => {
          await createMutation.mutateAsync({ type: "received", message: data+ "\n -- you sent this" });
        }, 3000);
      }
    },
    isLoading,
    isFetching,
    isPending: createMutation.isLoading,
  };
}


export function useTemporaryData(type, data) {
  const { temp } = useContext(appCtx);
  
  return {
    data: temp.value,
    write(type, message) {
      temp.value = { type, message }
    },
    clear() {
      temp.value = {}
    }
  }
}