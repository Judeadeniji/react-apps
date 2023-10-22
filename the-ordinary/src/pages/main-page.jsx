import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/hero";
import { AdBanner, ProductSection, ProductCard, SectionHeader, BlogCard } from "../components/Reusables";
import { useCategoryProducts, useCategories, useRecentlyViewed } from "../hooks"

const Section = (({ title }) => {
  const { products, isLoading } = useCategoryProducts(title);
  const { products: recents } = useRecentlyViewed();
  
  if(title.includes("liked") && recents.length > 0) {
    return (
        <ProductSection title={title} link={`/catalog/${title}`}>
        {
          recents && recents.map(({id, image, product_title, price, discount, isFavorite = false, slug, category }) => (
            <ProductCard {...{id,image, price, discount, title: product_title, category, isFavorite, slug}} />
          ))
        }
        </ProductSection>
    )
  } else if (!title.includes("liked")) {
    return (
        <ProductSection title={title} link={`/catalog/${title}`}>
        {
          products && products.map(({id, image, product_title, price, discount, isFavorite = false, slug, category }) => (
            <ProductCard {...{id,image, price, discount, title: product_title, category, isFavorite, slug}} />
          ))
        }
        </ProductSection>
    )
  }
  
})

export default (() => {
  const { categories = "", isLoading } = useCategories();
  
  if (isLoading) return <p>Categories Loading...</p>
  
  return (
    <section key="main-page">
      <Hero />
      <div className="mt-10 md:mt-20" />
      <AdBanner />
      <div className="mt-8">
        <Section title={categories[0]} />
        <section className="mt-10 w-full">
          <SectionHeader title="Catalogue" />
          <div className="flex flex-col md:flex-row md:gap-x-[9px] md:h-[280px] items-center w-full mt-1">
            <div className="w-full md:w-1/2 mb-1 md:mb-0 h-[250px] md:h-full">
              <figure className="w-full h-full overflow-hidden rounded-md">
                <img loading="lazy" className="h-full object-cover w-[100%]"
                src="https://img.freepik.com/free-photo/beauty-young-latin-woman-with-ideal-skin_633478-419.jpg?w=740&t=st=1688678947~exp=1688679547~hmac=d96482bd5f7a21da9e9baec7c60e94d44c2074a606d47c78bc48bae2eb51641a"
                alt="beauty-young-latin-woman-with-ideal-skin" />
              </figure>
            </div>
            <div className="mt-2 md:mt-0 md:flex md:flex-col h-auto md:h-full md:justify-between w-full md:w-1/2 mb-1 md:mb-0">
              <p className="text-[16px] text-gray-700 font-semibold md:w-2/3 leading-5 justify-self-start">
                All our products are created with love and care for your skin to help you achieve healthy and relationship with a beautiful skin
              </p>
              <div className="mt-8 md:mt-0 justify-self-end w-full">
                <Link to="/catalog/Fashion" className="flex items-center justify-between border-y border-b-0 border-y-black h-[30px]">
                  <p className="uppercase text-[14px]">Fashion</p>
                  <i className="text-[16px] font-semibold bi bi-arrow-up-right"></i>
                </Link>
                
                {
                  categories.slice(0,3).map(c => (
                <Link key={c} to={`/catalog/${c}`} className="flex items-center justify-between border-y border-b-0 border-y-black h-[30px]">
                  <p key={c} className="uppercase text-[14px]">{c}</p>
                  <i className="text-[16px] font-semibold bi bi-arrow-up-right"></i>
                </Link>
                  ))
                }
              </div>
            </div>
          </div>
        </section>
       {
         categories.slice(1, 5).map(category => (
          <Section title={category} />
         ))
       }
        <section className="mt-10 w-full">
          <SectionHeader title="From Our blog" text="read more" link="/blog" />
          <div className="mt-3 w-full md:flex md:gap-x-1 gap-y-2">
            <div className="w-full md:w-1/2">
              <BlogCard title="Our Story" desc="The captivating story of how a built a powerful JavaScript UI Library that powers this current application" />
            </div>
            <div className="w-full md:w-1/2">
              <BlogCard title="Mejor: A powerful client side framework" desc="The captivating story of how a built a powerful JavaScript UI Library that powers this current application" />
            </div>
          </div>
        </section>
       {
         categories.slice(5, categories.length).map(category => (
          <Section title={category} />
         ))
       }
        <Section title="People also liked" />
      </div>
    </section>
  )
})