
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import OrderDetails from './page/Order/OrderDetails';
import Ordsync from './page/Order/ordsync';
import OrdersGridWithDetails from './page/Order/newprn';
import SEODashboard from './page/Dashboard/dashboard';
import Login from './components/login'
import VehicleReport from './page/Vehicle/vehicle';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Ordsync />} />
          <Route path="ordsync" element={<Ordsync />} />
          <Route path="Login" element={<Login />} />
          <Route path="details" element={<OrderDetails />} />
          <Route path="OrderGridWithDetail1" element={<OrdersGridWithDetails />} />
          <Route path="SEODashboard" element={<SEODashboard />} />
          <Route path="Vehicle_Report" element={<VehicleReport />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

