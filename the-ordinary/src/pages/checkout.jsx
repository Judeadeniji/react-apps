import { useParams, useNavigate } from "react-router-dom";
import { useOrders, useCart, reactive } from "../hooks";
import OrderItems from "../components/order-item";


const Input = (props) => {
  return (
    <input {...props} className="focus:bg-background border-0 focus:border-b-gray-600 font-semibold text-[14px] md:text-[16px] focus:outline-0 border-b border-b-gray-200 h-[38px] md:h-[42px] px-2 rounded-t-sm" />
  )
}


const BillingForm = ({ order_number }) => {
  const state = reactive(0);
  const { set_temp, commit_temp, get: get_order } = useOrders();
  const { empty } = useCart();
  const navigate = useNavigate()
  
  async function handleBillingForm(e) {
      e.preventDefault();
      state.value = 1;
      const data = new FormData(e.target);
      const _data = {};
      data.forEach((value, key) => {
        _data[key] = value;
      });
      
      await new Promise(fulfill => {
        setTimeout(function() {
          set_temp({
            data: get_order(order_number),
            meta: _data
          });
          commit_temp(order_number);
          empty();
          state.value = 0;
          fulfill();
          navigate("/orders/"+order_number);
        }, 5000);
      });
  }
  
  return (
    <form key="form" className="w-full mt-8" onSubmit={handleBillingForm}>
      <div className="flex flex-col gap-y-5 justify-start">
        <Input name="first_name" type="text" placeholder="First Name*" required />
        <Input name="last_name" placeholder="Last Name" required />
        <Input name="email" type="email" autoComplete="on" placeholder="Email*" required />
        <Input type="number" name="phone" placeholder="Phone Number"  />
        <Input name="country" placeholder="Country*" required />
        <Input name="city" placeholder="City*" required />
        <Input name="address" placeholder="Address*" required />
        <Input name="zip" type="number" placeholder="Postal Code*"  />
      </div>
    
      <button disabled={Boolean(state.value)} type="submit" className="rounded-sm mt-10 uppercase active:scale-95
      transition-all duration-100 w-full
      bg-accent h-[40px] md:h-[45px] text-basic text-[16px] font-semibold">
        { Boolean(!state.value)  ? "proceed" : "processing..." }
      </button>
    </form>
  );
}

const BillingDetails = ((params) => {
  /* Step 1 */
  return (
    <div className="w-full md:flex md:gap-x-3">
      <div key="BillingDetails" className="mt-10 md:mt-0 md:w-3/5">
        <h4 className="text-[20px] md:text-[21px] mt-4 font-bold uppercase">
         Billing details
        </h4>
         <BillingForm {...params} />
      </div>
      
      <div className="mt-10 md:mt-0 md:w-2/5">
        <h4 className="text-[20px] md:text-[21px] font-bold uppercase mt-4">
          Your order
        </h4>
        <OrderItems />
      </div>
      
    </div>
  );
});

export default () => {
  const params = useParams();
  return (
    <div key="checkout-component" className="w-full h-full">
      <BillingDetails {...params} />
    </div>
  )
}