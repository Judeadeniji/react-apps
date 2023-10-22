import { useNavigate } from 'react-router-dom';
import { ProductSection, ProductCard } from "../components/Reusables";
import { useCart, useRecentlyViewed, useOrders, reactive } from "../hooks"


export default (() => {
  return (
    <div className="w-full px-1 mt-4">
      <Cart />
    </div>
  )
})

const PromoCodeForm = (() => (
  <div className="my-8 w-full md:h-[40px] md:flex items-center md:gap-x-2">
    <input placeholder="Enter Promo Code" className="rounded-t-sm
    placeholder-gray-500 h-[40px] md:h-full w-full focus:bg-background md:w-2/3 text-[16px] focus:outline-0 outline-0 border-0 border-b border-b-gray-500
    focus:border-b-accent" />
    <button className="active:scale-95 transition-transform duration-100 uppercase mt-3 md:mt-0 h-[40px] md:h-full md:w-1/4 w-full
    border border-accent bg-transparent hover:bg-accent text-accent
    hover:text-white text-[14px] font-semibold">
      Apply Code
    </button>
  </div>
));

const Checkout = (({ items }) => {
  const navigate = useNavigate();
  const { create } = useOrders();
  
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = subtotal * 0.045;
  const total = subtotal + vat;

  return (
    <div className="mt-3 md:mt-0 md:w-1/3">
      <h1 className="mb-8 text-[21px] uppercase font-bold">cart total</h1>
      <div className="w-full">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold uppercase">subtotal</p>
            <p className="text-sm font-semibold">{subtotal.toFixed(2)} $</p>
          </div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold uppercase">vat</p>
            <p className="text-sm font-semibold">+ {(vat).toFixed(2)} $</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold uppercase">Total</p>
            <p className="text-sm font-semibold">{total.toFixed(2)} $</p>
          </div>

          <button disabled={!items.length} className="active:scale-95 transition-transform duration-100 uppercase h-[40px] w-full bg-accent text-white text-[14px] font-semibold" onClick={() => {
            const { orderNumber } = create();
            navigate(`/cart/${orderNumber}`)
          }}>
            proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
});


const QuantityControl = (({ quantity, id }) => {
  const { update } = useCart();
  
  const increment = () => {
    update({
      id,
      updatedData: {
        quantity: quantity + 1
      }
    })
  }
  const decrement = () => {
    if (quantity < 2) return;
    update({
      id,
      updatedData: {
        quantity: quantity - 1
      }
    })
  }
  
  return (
    <div className="flex w-[100px] h-full border border-accent">
      <button onClick={decrement} className="flex w-1/3 h-full items-center
      justify-center font-bold text-[12px] border-r border-r-accent">
        -
      </button>
      <p className="flex w-1/3 h-full items-center justify-center
      font-semibold text-[16px]">{quantity}</p>
      <button onClick={increment} className="flex w-1/3 h-full items-center
      justify-center font-bold text-[12px] border-l border-l-accent">
        +
      </button>
    </div>
  )
})

const CartItem = (({ product }) => {
  const remove_from_cart = useCart().remove
  return (
    <div key={"cart-item-"+product.id} className="flex relative gap-x-4 w-full pt-1">
      <figure className="overflow-hidden bg-background rounded h-[160px] w-[120px] md:h-[180px] md:w-[140px]">
        <img className="w-full h-full object-fit" src={`data:image/jpeg;base64,${product.image}`} width="100%" height="100%" alt={product.product_title} />
      </figure>
      
       <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-y-2">
          <p className="text-sm">
            {product.product_title}
          </p>
          <p className="font-semibold text-sm">
            {product?.variant?.[0] ? product.variant[0] : ""}
          </p>
          <p className="font-semibold text-sm">
            ${product.price}
          </p>
        </div>
        
        <div className="h-[28px] justify-self-end">
          <QuantityControl id={product.id} quantity={product.quantity} />
        </div>
       </div>
       
       <button onClick={() => remove_from_cart(product.id)} className="h-9 w-9 rounded-full absolute top-0 right-0 active:scale-95 hover:bg-background bg-transparent">
         <span className="bi bi-x text-lg" />
       </button>
    </div>
  )
});

const Recent = () => {
  const recents = useRecentlyViewed().products;
  
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

const Cart = () => {
  const cart_items = useCart().products;
  return (
    <div className="w-full" key="cart-component">
      <h1 className="mt-3 mb-4 text-[21px] uppercase font-bold">shopping cart</h1>
      <div className="w-full md:gap-x-3 md:flex md:items-start">
        <div className="flex flex-col divide-y gap-y-3 mb-4 sm:mb-0 md:w-2/3">
        {
          cart_items.length > 0 ?
          cart_items.map((product,i) => {
            return (
            <div key={product.id}>
              <CartItem product={product} />
            </div>
            )
          }) :
          <h1 className="text-xl my-5">Cart is empty</h1>
        }
          <PromoCodeForm />
        </div>

        <Checkout items={cart_items} />
      </div>
        <Recent />
    </div>
  )
}