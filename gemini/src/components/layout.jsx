import { Outlet, Link } from "react-router-dom"
import useReactive from "../hooks/reactive";

/*function Header() {
  const navigate = useNavigate();
  const showMiniBar = useReactive(false);
  
  return (
    <header className="dark:bg-black dark:text-white w-full z-10 fixed h-[55px] bg-white bg-opacity-40 backdrop-blur-xl border-b">
      <div className="py-2 container flex justify-between items-center mx-auto w-full h-full px-3">
        <div onClick={() => showMiniBar.value = !showMiniBar.value}
        className="relative w-[75px] h-[37px] rounded-full px-1 py-2 border
        items-center flex">
          <div className="h-[30px] w-[30px] inline bg-gray-400 rounded-full">
            <img loading="lazy" />
             
          </div>
          
          <p className="font-semibold text-xs text-gray-400 ml-[2px]">0x2...</p>
         {
          showMiniBar.value && (
            <div className="border absolute top-10 flex flex-col rounded-lg bg-white text-sm text-gray-500">
              <a className="py-2 px-4 active:text-red-500 hover:text-blue-500 text-center font-semibold border-b">
                Account
              </a>
              <a className="py-2 px-4 active:text-red-500 hover:text-blue-500 text-center font-semibold">
                Menu
              </a>
              <a className="py-2 px-4 active:text-red-500 hover:text-blue-500 text-center font-semibold">
                Wallets
              </a>
              <a className="py-2 px-4 active:text-red-500 hover:text-blue-500 text-center font-semibold">
                Settings
              </a>
            </div>
           )
         }
        </div>
        <button onClick={() => navigate("/")} className="transition-all
        duration-200 text-white rounded font-semibold hover:shadow-md
        hover:shadow-blue-200 bg-red-600 py-2 px-4 active:text-red-500 hover:text-blue-500">
          Log Out
        </button>
      </div>
    </header>
  )
}*/
function Header() {
  return (
    <header className="px-2 w-full z-10 sticky top-0 h-[55px] bg-white bg-opacity-40 backdrop-blur-xl border-b">
      <div className="h-full w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <div className="rounded h-10 w-10 border">
          </div>
          <h1 className="text-xl font-bold text-gray-500">
            Page Title
          </h1>
        </div>
        <div className="">
        </div>
      </div>
    </header>
  )
}

function Sidebar() {
  const showMiniBar = useReactive(false);
  return (
    <center className="bg-blue-50 bg-opacity-10 pb-6 h-[100%]">
      <section className="h-[55px] flex items-center justify-center w-full">
        <h1 className="text-4xl font-bold uppercase bg-clip-text
        bg-gradient-to-r to-[#4db3dc] text-transparent from-blue-800">
          Gemini
        </h1>
      </section>
      <section className="pt-6 h-full w-full flex flex-col items-start justify-between">
        <section className="w-full flex flex-col gap-y-4">
          <SidebarLink />
          <SidebarLink />
          <SidebarLink />
          <SidebarLink />
          <SidebarLink />
          <SidebarLink />
          <SidebarLink />
        </section>
        <div class="w-[200px] self-center h-[40px] p-1 flex items-center border rounded-full">
            <div className="h-[30px] w-[30px] mr-1 inline bg-gray-400 rounded-full">
                <img loading="lazy" />
            </div>
            
            <p className="font-semibold text-md text-gray-400
            ml-[2px]">bc1p0k33ff2lxj4x...</p>
           {
            showMiniBar.value && (
              <div className="border absolute top-10 flex flex-col rounded-lg bg-white text-sm text-gray-500">
                <a className="py-2 px-4 active:text-red-500 hover:text-blue-500 text-center font-semibold border-b">
                  Account
                </a>
                <a className="py-2 px-4 active:text-red-500 hover:text-blue-500 text-center font-semibold">
                  Menu
                </a>
                <a className="py-2 px-4 active:text-red-500 hover:text-blue-500 text-center font-semibold">
                  Wallets
                </a>
                <a className="py-2 px-4 active:text-red-500 hover:text-blue-500 text-center font-semibold">
                  Settings
                </a>
              </div>
             )
           }
        </div>
      </section>
    </center>
  )
}

function SidebarLink() {
  return (
    <div class="hover:bg-blue-100  rounded-md">
      <Link className="hover:bg-clip-text
        hover:bg-gradient-to-r hover:from-[#4db3dc] hover:text-transparent
        hover:to-blue-800 w-full block flex items-center
      justify-start py-2 pl-3" to="/">
        <span className="h-7 w-7 mx-3 border">
        </span>
        <span className="font-semibold text-[18px]">
          Market
        </span>
      </Link>
    </div>
  )
}

export function Layout() {
  return (
    <main key="Layout" className="grid grid-cols-1 md:grid-cols-4">
      <aside className="hidden md:block md:col-span-1 border-r sticky top-0 h-screen">
        <Sidebar />
      </aside>
      <section className="md:col-span-3">
        <Header />
        <div className="pt-1 overflow-x-hidden overflow-y-scroll px-2">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
