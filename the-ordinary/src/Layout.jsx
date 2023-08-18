import Header from "./components/Header"
import Footer from "./components/Footer"
import { Menu } from "./components/Reusables"

export default ({ children }) => {
  
  return (
   <div className="font-sf-pro font-normal items-end md:max-w-[920px] lg:max-w-[1366px]">
    <div className="border m-0 w-screen relative px-2 h-full">
      <Header />
      <div className="w-full m-0 md:mt-[120px] mt-[64px]">
        {children}
        <Menu />
      </div>
      <Footer />
    </div>
   </div>
  )
}