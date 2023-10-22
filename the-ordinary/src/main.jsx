import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { TheOrdinary } from "./hooks"
import Layout from "./Layout"
import Home from "./pages/main-page"
import Cart from "./pages/cart"
import Catalogs from "./pages/catalogs"
import Catalog from "./pages/catalog"
import Checkout from "./pages/checkout"
import ProductPage from "./pages/product-page"
import Order from "./pages/order-detail"


//TODO: Nest children routes
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TheOrdinary>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalogs />} />
            <Route path="/catalog/:category_name" element={<Catalog />} />
            <Route path="/catalog/:category_name/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart/:order_number" element={<Checkout />} />
            <Route path="/orders/:order_number" element={<Order />} />
          </Routes>
        </Layout>
      </TheOrdinary>
    </BrowserRouter>
  </React.StrictMode>
)
