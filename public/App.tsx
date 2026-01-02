
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../src/components/Layout";
import OrderDetails from "../src/page/Order/OrderDetails";
import Ordsync from "../src/page/Order/Ordsync"; // ✅ ensure the path/case matches your file
import OrdersGridWithDetails from "../src/page/Order/newprn";
import SEODashboard from "../src/page/Dashboard/dashboard";
import Login from "../src/components/login";
import VehicleReport from "../src/page/Vehicle/vehicle";
import Entry from "../src/page/Entryscreen/Entry";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Entry />} />
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

