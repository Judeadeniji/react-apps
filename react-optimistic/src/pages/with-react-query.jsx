import { useQueryChats } from "../hooks"
import { Header, Footer, Bubble } from "../components"

export default function () {
  const { isLoading, isFetching, chats } = useQueryChats();

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
      <Footer />
    </main>
  )
}