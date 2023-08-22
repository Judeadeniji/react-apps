import { useRef } from "react"
import { Link } from "react-router-dom"
import { useQueryChats, useTemporaryData, reactive } from "./hooks"

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

export function Footer() {
  return (
    <div className="border-t py-2 flex items-center justify-between px-2 fixed bottom-0 left-0 bg-white bg-opacity-75 backdrop-blur">
     <div className="text-2xl font-cal text-gray-600 font-medium h-[33px] w-[33px] border rounded-full grid place-content-center">+</div>
     <MessageInput />
    </div>
  )
}


function MessageInput() {
  const input = useRef(null)
  const t = useTemporaryData();
  const { create } = useQueryChats();
  return (
    <form className="flex gap-x-2" onSubmit={async (e) => {
          e.preventDefault();
          const message = `${t.data.message}`;
          t.clear()
          input.current.textContent = ""
          await create("sent", message)
        }
    }>
      <span ref={input} contentEditable name="message" role="textarea" className="min-h-[1px] max-h-[150px] focus:outline-0 border w-[240px] rounded-3xl px-2 py-1 whitespace-pre-wrap overflow-y-scroll" onInput={(e) => {
        t.write("sent", `${e.target.textContent}`.trim())
      }}/>
      
      <button type="submit" className="w-[60px] h-[35px] rounded-full bg-blue-500 text-sm font-semibold text-white leading-3">
        Send
      </button>
    </form>
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
    <p className={`${sent ? "bg-blue-600" : "bg-green-600"}  ${local ? "animate-pulse opacity-90" : ""} inline-block p-3 rounded-2xl text-white font-normal text-[14px] font-sans  whitespace-pre-line`}>
      {message}
    </p>
    </div>
  )
}