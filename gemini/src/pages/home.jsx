import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="dark:bg-black dark:text-white w-full z-10 fixed h-[55px] bg-white bg-opacity-40 backdrop-blur-xl border-b">
      <div className="py-2 container flex justify-between items-center mx-auto w-full h-full px-3">
        <h1 className="text-xl font-bold space-x-1">Gemini</h1>
        <button onClick={() => navigate("/u/dashboard")} className="transition-all duration-200 text-white rounded font-semibold hover:shadow-md hover:shadow-blue-200 bg-gradient-to-r from-cyan-400 to-blue-800 py-2 px-4">
          Enter App
        </button>
      </div>
    </header>
  )
}

function CTRI({ head, body }) {
  return (
      <div className="h-[70px] md:w-1/4 border border-blue-200 flex flex-col
      gap-0 items-center justify-center w-[80%] rounded-xl">
        <h4 className="text-2xl uppercase font-bold bg-clip-text bg-gradient-to-r from-[#4db3dc] text-transparent to-blue-800">
          {head}
        </h4>
        <p className="text-blue-500 text-xs font-normal">{body}</p>
      </div>

  )
}

function CTR() {
  return (
    <div className="mt-6 mb-3 flex justify-center items-center mx-auto flex-wrap md:flex-nowrap gap-3">
      <CTRI head="$1.28B" body="$USHI Price" />
      <CTRI head="$1.59B" body="Total Liquidity" />
      <CTRI head="$224.06B" body="Total Volume" />
      <CTRI head="$14.85K" body="Total Pairs" />
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate();
  return (
    <main className="w-full select-none overflow-hidden dark:bg-black">
      <Header />
      <div className="w-full mt-28 flex flex-col md:flex-row gap-y-9 md:gap-0 md:px-6">
        <section className="relative p-3 md:w-1/2 m-0">
          <div className="flex top-0 flex-col w-full h-full text-center md:text-left">
          <h1 className="font-cal dark:text-white text-5xl md:text-5xl font-bold leading-[55px]">
            Be a {" "}
            <span className="bg-clip-text bg-gradient-to-r from-[#4db3dc]
            text-transparent to-blue-800">
              DeFi Chef
            </span>
              {" "} With $ushi
          </h1>
          <p className="text-md font-semibold dark:text-[#ccc] space-x-1 mt-3 text-gray-600">
            Swap, Earn, Sell, Stack yields, Borrow, Leverage AI On one
            Decentralized community Driven Platform. Welcome Home To DeFi
          </p>
          <div className="self-center justify-self-center mx-auto mt-4 flex gap-x-3">
          <button onClick={() => navigate("/u/dashboard")} className="text-white rounded font-semibold hover:shadow-md hover:shadow-blue-200 bg-gradient-to-r from-cyan-400 to-blue-800 py-2 px-5">
            Enter App
          </button>
          <button className="text-transparent rounded font-semibold border
          border-blue-500 bg-clip-text bg-gradient-to-r from-[#4db3dc]
            text-transparent to-blue-800 py-2 px-4">
            Learn More
          </button>
          </div>
        <div className="-z-50 blur-2xl absolute -right-36 -top-16 h-72 w-72
        rounded-r-full rounded-l-2xl bg-gradient-to-bl from-blue-50 to-pink-200" />

        </div>
        </section>
        <section className="w-full relative grid place-content-center h-full md:w-1/2 m-0">
          <div className="h-72 -z-50 absolute rounded-full w-72 m-auto bg-gradient-to-bl md:left-0 -left-28 -top-2 from-blue-100 via-cyan-300
          via-purple-100 to-transparent blur-lg" />
          <div className="my-4 mx-auto w-80 h-56">
            <img loading="lazy" className="h-full w-full -mt-12 scale-[2.5] object-center" src="/gemini-hero.png" />
          </div>
        </section>
      </div>
      <CTR />
    </main>
  )
}