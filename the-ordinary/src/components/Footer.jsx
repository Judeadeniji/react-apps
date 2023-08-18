
const Footer = () => (
  <footer className="w-full relative bottom-0 py-4 mt-14">
    <div className="flex w-full items-center">
      <div className="justify-self-start w-1/3 md:w-1/4 lg:w-1/5">
        <div className="w-full h-full">
          <p className="text-sm text-gray-800 font-bold">The</p>
          <h1 className="leading-[1rem] text-2xl font-extrabold">Ordinary.</h1>
        </div>
      </div>
    </div>
    <div className="hidden md:h-[240px] mt-6 border-t md:flex items-start flex-col justify-between md:flex-row gap-x-6 gap-y-3 pt-8 pb-2">
      <div className="w-full md:w-2/9 grid place-content-center">
        <ul className="mt-2 space-y-1 uppercase text-2xl text-accent font-bold">
          <li><a href="#" className="text-gray-600 hover:text-gray-800">Link 1</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-800">Link 2</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-800">Link 3</a></li>
        </ul>
      </div>
      <div className="w-full md:w-2/9 grid place-content-center">
        <h4 className="text-lg uppercase font-bold">Catalog</h4>
        <ul className="mt-2 space-y-1">
          <li><a href="#" className="text-gray-600 hover:text-gray-800">Sub Link 1</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-800">Sub Link 2</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-800">Sub Link 3</a></li>
        </ul>
      </div>
      <div className="w-full md:w-2/9 grid place-content-center">
        <h4 className="text-lg uppercase font-bold">Customer Care</h4>
        <ul className="mt-2 space-y-1">
          <li><a href="#" className="text-gray-600 hover:text-gray-800">Sub Link 1</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-800">Sub Link 2</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-800">Sub Link 3</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-800">Sub Link 4</a></li>
        </ul>
      </div>
      <div className="w-full">
        <form className="w-full mt-2">
          <div className="mt-1 transition-all duration-200 relative">
            <input type="email" id="newsletter" name="newsletter" placeholder="Give
            an email, get the newsletter" className="text-[12px] w-full pl-1 py-1 border-0 border-b
            border-b-[silver] focus:border-b-black focus:outline-0 focus:bg-background"
            />
            <button type="submit" className="active:scale-90 hover:bg-[#00000040]
            rounded-full bg-none outline-0 h-6 w-6 border-0 absolute bottom-1 right-1">
              <i className="text-[14px] m-auto font-extrabold bi bi-arrow-right" />
            </button>
          </div>
          <div className="mt-2 flex items-center">
            <input type="checkbox" id="consent" name="consent" className="form-checkbox
            text-black h-3 w-3 mr-2" />
            <label htmlFor="consent" className="text-[10px] text-gray-600">I agree to receive promotional emails</label>
          </div>
        </form>
      </div> 
    </div>

    <div className="mt-4 px-2 flex items-center justify-between">
      <p className="text-[#717178] text-[10px]">© 2023 The Ordinary. <a
      className="underline">Terms of use privacy and policy</a></p>
      <div className="flex p-1 justify-between items-center text-[#717178] gap-x-4">
          <i className="text-sm md:text-xl lg:text-2xl bi bi-facebook"/>
          <i className="text-sm md:text-xl lg:text-2xl bi bi-twitter"/>
          <i className="text-sm md:text-xl lg:text-2xl bi bi-instagram" />
      </div>
    </div>
  </footer>
)

export default Footer 