
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import OrderGridWithDetail from './page/Order/OrderDetails';
import Ordsync from './page/Order/ordsync';
import OrdersGridWithDetails from './page/Order/newprn';
import SEODashboard from './page/Dashboard/dashboard';
import Login from './components/login';
import VehicleReport from './page/Vehicle/vehicle';
import Entry from './page/Entryscreen/Entry';
import Card from './page/Card/Card';
import Card2 from './page/Card/Card2';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* ✅ index route must be self-closing */}
          <Route index element={<Entry />} />
          
          {/* ✅ normalize paths (lowercase recommended) */}
          <Route path="ordsync" element={<Ordsync />} />
          <Route path="login" element={<Login />} />
          <Route path="details" element={<OrderGridWithDetail />} />
          <Route path="order-grid-with-detail1" element={<OrdersGridWithDetails />} />
          <Route path="seo-dashboard" element={<SEODashboard />} />
          <Route path="vehicle-report" element={<VehicleReport />} />
          <Route path="card" element={<Card />} />
          <Route path="card-details" element={<Card2 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
