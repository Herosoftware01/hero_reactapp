
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './page/Layout';
import OrderDetails from './page/OrderDetails';
import Ordsync from './page/ordsync';
import OrdersGridWithDetails from './page/newprn';
import DailyReport from './page/daily';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper for nested routes */}
        <Route path="/" element={<Layout />}>
          {/* Default page */}
          <Route index element={<Ordsync />} />
          <Route path="ordsync" element={<Ordsync />} />
          <Route path="details" element={<OrderDetails />} />
          <Route path="OrderGridWithDetail1" element={<OrdersGridWithDetails />} />
          <Route path="DailyReport" element={<DailyReport />} />
        </Route>

        {/* Independent route for new grid */}
        {/* <Route path="OrderGridWithDetail1" element={<OrderGridWithDetail1 />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
