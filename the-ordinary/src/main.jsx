import './index.css'
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
import Catalogs from "./pages/catalogs"
import Catalog from "./pages/catalog"
import ProductPage from "./pages/product-page"


//TODO: Nest children routes
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TheOrdinary>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalogs />}>
            </Route>
            <Route path="/catalog/:category_name" element={<Catalog />}>
            </Route>
            <Route path="/catalog/:category_name/:slug" element={<ProductPage />} />
          </Routes>
        </Layout>
      </TheOrdinary>
    </BrowserRouter>
  </React.StrictMode>
)
