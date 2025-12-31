
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import OrderDetails from './page/OrderDetails';
import Ordsync from './page/ordsync';
import OrdersGridWithDetails from './page/order/newprn';
import DailyReport from './page/daily';
import SEODashboard from './page/Dashboard/dashboard';
import Login from './components/login'
import VehicleReport from './page/Vehicle/vehicle';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper for nested routes */}
        <Route path="/" element={<Layout />}>
          {/* Default page */}
          <Route index element={<Ordsync />} />
          <Route path="ordsync" element={<Ordsync />} />
          <Route path="Login" element={<Login />} />
          <Route path="details" element={<OrderDetails />} />
          <Route path="OrderGridWithDetail1" element={<OrdersGridWithDetails />} />
          <Route path="SEODashboard" element={<SEODashboard />} />
          <Route path="DailyReport" element={<DailyReport />} />
          <Route path="Vehicle_Report" element={<VehicleReport />} />
        </Route>

        {/* Independent route for new grid */}
        {/* <Route path="OrderGridWithDetail1" element={<OrderGridWithDetail1 />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

