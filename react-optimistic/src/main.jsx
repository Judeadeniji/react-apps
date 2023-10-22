import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import RQ from "./pages/with-react-query"
import NoRQ from "./pages/without-react-query"
import Aw from "./pages/await"
import { AppProvider } from "./hooks"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Aw />} />
          <Route path="/rq" element={<RQ />} />
          <Route path="/legacy" element={<NoRQ />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
