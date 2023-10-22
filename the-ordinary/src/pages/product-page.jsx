import { useParams } from "react-router-dom"
import { ProductSection, ProductCard } from "../components/Reusables";
import { reactive, useProduct, useCategoryProducts, useRecentlyViewed, useCart } from "../hooks"


const ProductImages = ({ src }) => {
  return (
    <div className="w-full h-[320px] md:h-full gap-y-2 flex flex-col overflow-hidden rounded-md m-0">
      <div className="w-full h-2/3">
        <figure className="bg-background w-full h-full">
          <img className="w-full h-full object-cover" src={src} alt={src} width="auto" height="auto" />
        </figure>
      </div>
      <div className="w-full h-1/3 gap-x-2 flex">
        <figure className="w-1/3 bg-background h-full">
          <img className="w-full h-full object-cover" src={src} alt={src} width="auto" height="auto" />
        </figure>
        <figure className="w-1/3 bg-background h-full">
          <img className="w-full h-full object-cover" src={src} alt={src} width="auto" height="auto" />
        </figure>
        <figure className="w-1/3 bg-background h-full">
          <img className="w-full h-full object-cover" src={src} alt={src} width="auto" height="auto" />
        </figure>
      </div>
    </div>
  )
}

const ProductMeta = () => (
  <div className="w-full px-2 md:px-0">
    <div className="border-b-[0.8px] mb-1 border-b-accent py-1 w-full">
      <h5 className="mb-1 font-bold text-[16px] md:text-[18px]">
        Product Description
      </h5>
      <p className="text-[14px] mt-1 md:text-[16px]">
        Explore the remarkable features and benefits of this product.
      </p>
    </div>
  
    <div className="border-b-[0.8px] mb-1 border-b-accent py-1 w-full">
      <h5 className="mb-1 font-bold text-[16px] md:text-[18px]">
        Highlights
      </h5>
      <p className="text-[14px] mt-1 md:text-[16px]">
        Discover the key features and advantages of this product.
      </p>
    </div>
  
    <div className="border-b-[0.8px] mb-1 border-b-accent py-1 w-full">
      <h5 className="mb-1 font-bold text-[16px] md:text-[18px]">
        Suitable For
      </h5>
      <p className="text-[14px] mt-1 md:text-[16px]">
        Ideal for various uses and applications.
      </p>
    </div>
  
    <div className="border-b-[0.8px] mb-1 border-b-accent py-1 w-full">
      <h5 className="mb-1 font-bold text-[16px] md:text-[18px]">
        Format
      </h5>
      <p className="text-[14px] mt-1 md:text-[16px]">
        Available in different formats to suit your preferences.
      </p>
    </div>
  
    <div className="border-b-[0.8px] mb-1 border-b-accent py-1 w-full">
      <h5 className="mb-1 font-bold text-[16px] md:text-[18px]">
        Key Features
      </h5>
      <p className="text-[14px] mt-1 md:text-[16px]">
        Experience the power of the standout features that make this product exceptional.
      </p>
    </div>
  </div>
  )

const ProductDetails = ({ product }) => {
  const { add: set_recently_viewed } = useRecentlyViewed()
  const { add: add_to_cart } = useCart()
  set_recently_viewed(product)
  const { product_title, variant = [], review, price, discount, count, id } = product;
  const _count = reactive(1)
  const selectedVariant = reactive(variant?.[0]);
  
  const increment = () => _count.value++
  const decrement = () => {
    if (_count.value < 2) return;
    _count.value--
  }
  
  const addToCart = () => {
    // store the count value
    const quantity = Number.parseInt(_count.value);
    // reset it back to 1
    _count.value = 1;
    add_to_cart({
      ...product,
         quantity,
    });
  }
  
  const renderStars = () => {
    const fullStars = Math.floor(review);
    const hasHalfStar = review - fullStars >= 0.5;
    
    const stars = [];
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="bi bi-star-fill" />);
    }
  
    if (hasHalfStar) {
      stars.push(<span key="half" className="bi bi-star-half" />);
    }
  
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={i + fullStars} className="bi bi-star" />);
    }
  
    return stars;
}

  
  return (
    <div className="w-full">
      <div className="flex flex-col gap-y-3">
        <h4 className="text-[18px] md:text-[24px] lg:text-[26px] font-semibold">
          {product_title}
        </h4>
        
        <div className="flex justify-between gap-x-2 w-[40%] text-[13px]">
          <div className="flex gap-x-1">
            {renderStars()}
          </div>
          
          <span className="text-gray-400">{review}</span>
          
          <span className="text-gray-400">({count})</span>
        </div>

        
        <div className="my-5 w-[45%] flex justify-between gap-x-4 items-center">
        {variant.length > 1 ? (
          <div className="flex border border-accent whitespace-nowrap h-[28px] w-auto">
            {variant.map((product, index) => (
              <div
                key={index}
                className={`w-1/${variant.length} px-2 h-full ${
                  product === selectedVariant.value ? 'bg-accent text-basic' :
                  `bg-basic text-accent ${index !== variant.length -1 ?
                  'border-r' : ''} border-r-accent`
                } flex items-center justify-center text-sm`}
              >
                {product.trim().split("").slice(0,5).join("")}
              </div>
            ))
            }
          </div>
        ) : <comment />}
          <p className="font-bold text-[13px]">${!discount ? price :
          (price - (price * (discount/100))).toFixed(2)}</p>
        </div>
        
        <ProductMeta />
        
        <div className="flex mt-4 gap-x-4 items-center h-[34px]">
          <div className="flex w-[100px] h-full border border-accent">
            <button onClick={decrement} className="flex w-1/3 h-full items-center
            justify-center font-bold text-[12px] border-r border-r-accent">
              -
            </button>
            <p className="flex w-1/3 h-full items-center justify-center
            font-semibold text-[16px]">
              {_count.value}
            </p>
            <button onClick={increment} className="flex w-1/3 h-full items-center
            justify-center font-bold text-[12px] border-l border-l-accent">
              +
            </button>
          </div>
          <button className="bg-accent w-[150px] h-full text-basic uppercase
          text-[12px] font-semibold"
          onClick={addToCart}>
            Add to basket
          </button>
        </div>
      </div>
    </div>
  )
};



const ProductDescHeader = ({ index }) => {
  
  const active = "border-b-2 font-bold border-b-accent"
  
  return (
   <div className="transition-all duration-300 border-b h-[34px] text-[14px] font-semibold border-b-accent flex gap-x-6 items-start">
      <div className={`${index.value === 1 ? active : ""} h-full py-1 flex items-center justify-center`}
      onClick={() => index.value = 1}>
        Description
      </div>
      
      <div className={`${index.value === 2 ? active : ""} h-full py-1 flex items-center justify-center`}
      onClick={() => index.value = 2}>
        Additional Information
      </div>
      
      <div className={`${index.value === 3 ? active : ""} h-full py-1 flex items-center justify-center`} onClick={() => index.value = 3}>
        Reviews (13)
      </div>
    </div>
  )
}

const ProductDescBody = ({ index }) => (
    <p className="font-semibold py-1 text-[12px]">
      zebra problem pencil joke churn skin care lorem dolor illness virtual festival work piano limit exchange festival.
      Tap on the headers to Switch rows.
    </p>
  )

const ProductAdditionalInfo = () => (
    <p className="font-semibold py-1 text-[12px]">
      Any other Additional info will be seen here.
      Tap on the headers to Switch rows.
    </p>
)

const ProductReviews = () => (
    <p className="font-semibold py-1 text-[12px]">
      Reviews will be here. Customer Reviews are a good thing.
    </p>
)

const ProductDesc = () => {
  const section = reactive(1);
  
  return (
    <div className="h-full w-full">
      <ProductDescHeader index={section} />
      
      <div className="w-full mt-3 md:pr-5">
        {
          section.value === 1 ?
          <ProductDescBody index={section} /> : 
          section.value === 2 ?
          <ProductAdditionalInfo index={section} /> :
          <ProductReviews index={section} />
        }
      </div>
    </div>
  )
}

const Recent = () => {
  const { products: recents } = useRecentlyViewed();
  
  return (
      recents.length > 2 &&
      (<div className="w-full my-16">
        <ProductSection title="Recently Viewed">
        {recents.map(({id, image, product_title, price, discount, isFavorite, slug, category }) => (
          <ProductCard {...{id, image, price, discount, title: product_title, category, isFavorite, slug}} />
        ))
        }
        </ProductSection>
      </div>)
  )
}

const Similar = ({ category: category_name }) => {
  const { isLoading, products: similar } = useCategoryProducts(category_name)
  
  if(isLoading) {
    return <p>Loading Similar...</p>
  }
  
  return (
    <ProductSection title="similar products" link={`/catalog/${category_name}`}>
        {
          similar.map(({id, image, product_title, price, discount, isFavorite, slug, category }) => (<ProductCard {...{id, image, price, discount, title: product_title, category, isFavorite, slug}} />)).reverse()
        }
    </ProductSection>
  )
}

export default () => {
  const { slug, category_name } = useParams();
  const { product, isLoading } = useProduct(slug);
  
  if (isLoading) {
    return <p>Loading...</p>
  } 
  
  return (
    <div className="mt-5 mb-0 mx-0">
      <div className="w-full md:gap-x-4 md:flex">
        <div className="mb-8 md:mb-0 md:w-1/2 lg:w-1/3">
          <ProductImages src={`data:image/jpeg;base64,${product.image}`} />
        </div>
        <div className="md:w-1/2 lg:w-2/3">
          <ProductDetails product={product} />
        </div>
      </div>
      
      <div className="w-full my-16">
        <ProductDesc />
      </div>
      
      <div className="w-full my-16">
        <Similar category={category_name} />
      </div>
      
      <Recent />
    </div>
  )
}
