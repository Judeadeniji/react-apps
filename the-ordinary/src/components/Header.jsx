import { Link } from "react-router-dom";
import { useMenu, useCart } from '../hooks'

const CartIcon = () => {
  const { count } = useCart();
  return (
    <Link to="/cart" className="text-xl md:text-2xl relative">
      <i className="bi bi-bag inline-block" />
      <span className="absolute top-0 -right-1 bg-accent rounded-full w-4 h-4 flex items-center justify-center text-white text-[10px]">
        {count}
      </span>
    </Link>
  )
};

const CatalogList = () => {
  const c =  ["Shoes", "Bags", "Electronics"]//getUniqueCategories().slice(0, 6)

  return (
    <div className="bg-white overflow-hidden shadow-md flex flex-col rounded">
    {
      c.map(_c => (
      <div key={_c}>
        <Link className="py-3 px-4  w-full hover:bg-background text-sm font-semibold" to={`/catalog/${_c}`}>
          {_c}
        </Link>
      </div>
      ))
    }
    </div>
  )
};

export default () => {
  const { toggle, status } = useMenu();
  //alert(status)
  return (
    <header className="bg-basic bg-opacity-80 z-10 backdrop-blur-md px-2 py-2 md:py-5 md:px-4 flex items-center justify-between border-b fixed w-full left-0 right-0 top-0">
      <Link to="/" className="rounded-md flex items-center justify-center inline-block h-[40px] w-[100px]">
        <div className="w-[90%] h-full">
          <p className="text-sm font-bold">The</p>
          <h1 className="leading-[0.75rem] text-lg font-extrabold">Ordinary.</h1>
        </div>
      </Link>
      <nav className="hidden md:flex items-center justify-evenly mx-auto gap-x-8 lg:gap-x-10">
        <div role="dialog" className="hover:font-bold dropdown relative">
          <p>Catalogue</p>
          <div className="dropdown-menu z-10 hidden absolute">
            <CatalogList /> 
          </div>
        </div>
        <Link to="/catalogue/best-sellers" className="hover:font-bold">Best Sellers</Link>
        <Link to="/about" className="hover:font-bold">About The Ordinary</Link>
        <a href="https://judeadeniji.github.io" className="hover:font-bold">Blog</a>
      </nav>
      <div className="flex items-center justify-between my-auto gap-x-8 md:gap-0 md:inline-block">
        <div className="flex items-center justify-between my-auto gap-4 lg:gap-5">
        <Link to="/search" className="text-xl md:text-2xl">
          <i className="bi bi-search"/>
        </Link>
        <Link to="/catalog/favorites" className="text-xl md:text-2xl">
          <i className="bi bi-heart"/>
        </Link>
        <CartIcon />

        </div>
        <div className="md:hidden py-1 my-auto flex flex-col gap-y-[5px] items-end" onClick={toggle}>
          <span className="border-[1.5px] border-black w-[28px] rounded-lg" />
          <span className="border-[1.5px] border-black w-[18px] rounded-lg" />
          <span className="border-[1.5px] border-black w-[23px] rounded-lg" />
        </div>
      </div>
    </header>
  )
};