import { useParams, Link } from "react-router-dom"
import { For, Show } from "rc-extended/components"
import { useFetch } from "rc-extended/use";


function Header({ name }) {

  return (
    <header className="w-full z-30 sticky h-[40px] bg-white bg-opacity-80 backdrop-blur-xl border-b flex flex-row items-center justify-between top-0 left-0 right-0 px-2 min-w-full">
        <Link to="/all" className="left-1 text-blue-600 font-semibold">
         Back
        </Link>
        <h1 className="text-md font-bold leading-none">{name}</h1>
        <div />
    </header>
  )
}

export default function SingleCharacter () {
  const { character } = useParams();
  const { result, isPending } = useFetch(`https://rickandmortyapi.com/api/character/${character}`)
  
  if (result) {
    delete result.episode
    delete result.created
    delete result.url
  }

  return (
    <main className="h-full w-full dark:invert bg-white min-h-screen">
    <Header name={result ? result.name : "Loading..."} />
    <section className="px-2">
      <Show when={!isPending}>
        <figure className="border overflow-hidden rounded-md mt-2">
          <img className="min-w-full h-auto block dark:invert" src={result && result.image} />
          <p className="text-center my-1 font-semibold">
            {result?.name}
          </p>
        </figure>
        
        <For each={result || []}>
          {(value, key) => {
            if (key === "image") return null;
            return (
              <div key={key} className="rounded-lg border p-2 my-2">
                <h2 className="text-black font-bold text-md font-cal">{key}:</h2>
                <p className="text-gray-600 font-semibold text-sm">{value?.name || value} {" "}
                <Show when={key === "status" && value === "Alive"}>
                  <span className="h-2 w-2 rounded-full bg-[#00cc00] ring-2 ring-green-400 inline-block"></span>
                </Show>
                </p>
              </div>
            )
          }}
        </For>
      </Show>
    </section>
    </main>
  )
}
