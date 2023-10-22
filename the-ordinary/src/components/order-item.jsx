import { useCart } from "../hooks";

const OrderItem = ({ name, price, quantity, id }) => {
  return (
    <div key={id} className="font-semibold flex items-center justify-between">
      <p className="uppercase">{name}</p>
      <p className="">{quantity} x {price}</p>
    </div>
  );
};

const OrderItems = (({ items }) => {
  const { products } = useCart();
  const cart_items = items ? items : products;
  const subtotal = cart_items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = Number.parseFloat(subtotal) * 0.045;
  const total = Number.parseFloat(subtotal + vat).toFixed(2);
  
  return (
    <div className="bg-background rounded my-4 p-5">
      <div className="border-b border-b-gray-600 flex py-2 mb-6 items-center justify-between">
        <p className="text-sm font-bold uppercase text-accent">Your Order</p>
        <p className="text-sm font-bold uppercase text-accent">total</p>
      </div>

      <div className="flex mb-6 flex-col gap-y-1 text-gray-500 text-[12px] md:text-[16px]">
      {
        cart_items.map(({ product_title, price, id, quantity }) => (
          <OrderItem name={product_title} price={price} quantity={quantity} id={id} />
        ))
      }
      </div>

      <div className="border-b border-b-gray-600 flex py-2 my-3 items-center justify-between">
        <p className="text-sm font-bold uppercase text-accent">Shipping</p>
        <p className="text-green-600 text-[12px] md:text-[14px] font-semibold">FREE</p>
      </div>

      <div className="border-b border-b-gray-600 flex py-2 my-3 items-center justify-between">
        <p className="text-sm font-bold uppercase text-accent">VAT</p>
        <p className="text-gray-500 text-[12px] md:text-[14px]
        font-semibold">${vat.toFixed(2)}</p>
      </div>

      <div className="border-b border-b-gray-600 flex py-2 items-center justify-between">
        <p className="text-sm font-bold uppercase text-accent">Total</p>
        <p className="text-accent text-[14px] md:text-[16px] font-bold">${total}</p>
      </div>
    </div>
  );
});

export default OrderItems