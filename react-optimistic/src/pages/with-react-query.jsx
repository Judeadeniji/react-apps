import { useRef } from "react"
import { useQueryChats, useTemporaryData, reactive } from "../hooks"
import { Header, Footer, Bubble } from "../components"

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
           create("sent", message)
           create("sent", message)
           create("sent", message)
           create("sent", message)
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

export default function () {
  const { isLoading, chats } = useQueryChats();

  if (isLoading) {
    return (
      <p>Setting Up...</p>
    )
  }
  
  return (
    <main className="min-h-screen w-full relative">
      <Header user="React Query" />
        <section className="min-h-screen w-full py-[60px] px-2 flex flex-col gap-y-2">
          {
            chats.messages.map(({ type, message, local }) => <Bubble sent={type === "sent"} message={message} local={local} />)
          }
        </section>
      <Footer>
        <MessageInput />
      </Footer>
    </main>
  )
}