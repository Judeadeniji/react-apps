import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { maths, Core } from "utiliti-js";
import { useMenu, appCtx } from '../hooks'


const { roundTo } = maths;
const { DateFilter } = Core;
const df = new DateFilter();



const LikeButton = ({ id, isFavorite }) => {
  const { products } = useContext(appCtx);
  function set_favorite() {
    alert(products.value?.length)
    const newProducts = products.value.map(product => {
      if (product.id === id) {
        product.isFavorite = !product.isFavorite;
      }
      return product;
    });
    
    products.value = newProducts
  }
  return (
  <i onClick={set_favorite} className={`self-end ml-1 text-xl bi ${isFavorite ? 'text-black bi-heart-fill' : 'bi-heart'}`} />
  )
}

export const ProductCard = ({
  title,
  price,
  discount,
  id,
  slug,
  isFavorite,
  category,
  image
}) => {
 return (
   <div key={id} className="rounded-2xl">
    <Link data-br-preload="hover" to={`/catalog/${category}/${slug}`} className="hover:drop-shadow">
      <figure className="overflow-hidden rounded-t-md w-[160px] h-[185px] md:w-[180px] md:h-[195px] relative">
        <img loading="lazy" className="h-full w-full object-fit" src={`data:image/jpeg;base64,${image}`} alt={title} width="100%" height="100%" />
        {discount && (<div className="bg-accent text-basic px-[8px] py-[5px] absolute text-[10px] top-[7px] right-[7px]"> {discount}% </div>)}
      </figure>
    </Link>
      <div className="py-2 px-1 mt-2 max-w-[140px] md:max-w-[160px]">
        <div className="flex items-center justify-between gap-x-2">
          <p className="text-[11px] font-bold text-black leading-4">{title}</p>
          <LikeButton {...{id, isFavorite}} />
        </div>
        <div className="mt-1">
          <p className="text-[12px] font-bold">${!discount ? price : roundTo(price -
          (price *(discount/100)), 2)}{" "} 
          { discount && (<span
          className="text-[12px] text-gray-500 line-through">
            {price}
          </span>)}
          </p>
        </div>
      </div>
    </div>
  );
}
  
 export const SectionHeader = ({
   title,
   link,
   text
 }) => (
   <div className="w-full flex items-center justify-between p-2 my-1">
    <h4 className="text-[18px] md:text-[21px] uppercase font-bold">{title}</h4>
    {link && <Link className="underline uppercase text-[12px] font-semibold"
    to={link}>{text || "See All"}</Link>}
   </div> 
 );
 
 export const ProductSlider = ({ children }) => (
  <div className="no-scrollbar scroll-m-0 flex gap-x-[8px] md:gap-x-[12px] w-full items-start overflow-x-scroll overflow-y-scroll">
    {children}
  </div>
)

export const ProductSection = ({
  title,
  link,
  children,
}) => (
  <section className="mt-14 w-full">
    <SectionHeader {...{title, link}} />
    <ProductSlider>
      {children}
    </ProductSlider>
  </section>
);


export const AdBanner = () => {
    
  return (
  <div className="w-full h-[120px] md:h-[320px] lg:h-[380px] my-3">
    <div className="w-[95%] h-full mx-auto rounded-lg object-cover overflow-hidden">
      <img className="object-cover w-full h-full" loading="lazy" src="https://camo.envatousercontent.com/aef97db195009b6cbcad1bf9d17c707e91c89487/68747470733a2f2f6164616e696d6174652e636f6d2f656e7661746f2f636f646563616e796f6e2f68746d6c352f61642d74656d706c617465732f646573632d696d67732f637573746f6d6572732e676966" alt="ads banner" width="95%" height="100%" />
    </div>
  </div>
  )
};

export const BlogCard = ({ title, desc }) => (
  <article className="my-4 overflow-hidden rounded-2xl mx-3 border hover:drop-shadow-lg">
    <div>
      <figure className="w-full h-[190px] md:h-[420px] bg-background rounded-t-lg">
      </figure>
      <div className="p-2 flex mt-1 ml-1 items-center justify-between w-[60%]">
        <span className="text-gray-500 font-semibold
        text-[10px]">{df.text(new Date())}</span>
        <span className="text-gray-500 font-semibold text-[10px]">Comments (29)</span>
      </div>
    </div>
    <div className="px-2 py-1 mt-3 mb-5">
      <h4 className="font-bold mb-3 text-[16px] uppercase">{title}</h4>
      <p className="w-[90%] leading-tight font-semibold text-[14px] text-gray-700">{desc}</p>
    </div>
  </article>
);

export const Menu = ({ show }) => { 
  const { status, toggle } = useMenu();

  const route_to = (to) => {
    close_menu();
    //navigate(to);
  }

  return (
   <div className={`${status ? "flex" : "hidden"} menu-container`}>
    <div className="menu slide-left">
      <button className="button" onClick={toggle}>
        <i className="bi bi-box-arrow-left text-2xl m-auto font-extrabold" />
      </button>
      <ul>
        <li key="home"><Link onClick={() => route_to("/")} to="/">Home</Link></li>
        <li key="catalog"><Link onClick={() => route_to("/catalog")} to="/catalog">Catalog</Link></li>
        <li key="about"><Link onClick={() => route_to("/about")} to="/about">About</Link></li>
        <li key="blog"><a href="https://judeadeniji.github.io">Blog</a></li>
      </ul>
    </div>
   </div>
  )
};