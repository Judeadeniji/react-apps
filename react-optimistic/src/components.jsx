
import { Link } from "react-router-dom"
import { reactive } from "./hooks"

function Menu() {
  return (
    <div className="bg-white shadow rounded-xl border p-2 divide-y text-gray-600 absolute top-10 right-3 flex flex-col">
      <Link to="/" className="py-1 px-2 text-center font-semibold text-md">
        React Query
      </Link>
      <Link to="/legacy" className="py-1 px-2 text-center font-semibold text-md">
        Legacy
      </Link>
    </div>
  )
}

export function Header({ user }) {
  const showMenu = reactive(false)
  return (
    <header className="fixed top-0 right-0 left-0 h-[50px] border-b w-full flex flex-row items-center px-2 bg-white bg-opacity-75 backdrop-blur justify-between relative">
      <figure className="h-9 w-9 rounded-full border justify-self-start">
      </figure>
      <p className="font-bold text-md font-cal">{user}</p>
      
      <button onClick={() => showMenu.value = !showMenu.value} className="rotate-90">•••</button>
      
      { showMenu.value && <Menu /> }
    </header>
  )
}

export function Footer({ children }) {
  return (
    <div className="border-t py-2 flex items-center justify-between px-2 fixed bottom-0 left-0 bg-white bg-opacity-75 backdrop-blur">
     <div className="text-2xl font-cal text-gray-600 font-medium h-[33px] w-[33px] border rounded-full grid place-content-center">+</div>
      {children}
    </div>
  )
}

export function Bubble({ sent, message, local }) {
  
  if (!sent && local) {
    return (
      <div className={`${sent ? "self-end flex-row-reverse" : ""} max-w-[64%] min-w-0 my-1 inline-flex gap-x-1`}>
        <figure className="h-9 w-9 rounded-full border justify-self-start self-end" />
        <div className="flex items-center h-9 px-3 text-2xl animate-pulse rounded-full bg-gray-100">
          <span className="animate-bounce">•</span>
          <span className="animate-bounce">•</span>
          <span className="animate-bounce">•</span>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`${sent ? "self-end flex-row-reverse" : ""} max-w-[64%] min-w-0 my-1 inline-flex gap-x-1`}>
    <figure className="h-9 w-9 rounded-full border justify-self-start self-end">
      </figure>
    <p className={`${sent ? "bg-blue-600" : "bg-green-600"}  ${local === true ? "animate-pulse opacity-90" : local === "failed" ? "bg-red-500": ""} inline-block p-3 rounded-2xl text-white font-normal text-[14px] font-sans  whitespace-pre-line`}>
      {message}
    </p>
    </div>
  )
}