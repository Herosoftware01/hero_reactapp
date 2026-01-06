
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import OrderGridWithDetail from './page/Order/OrderDetails';
import Ordsync from './page/Order/ordsync';
import OrdersGridWithDetails from './page/Order/newprn';
import SEODashboard from './page/Dashboard/dashboard';
import Login from './components/login'
import VehicleReport from './page/Vehicle/vehicle';
import Entry from './page/Entryscreen/Entry';
import Card from './page/Card/Card';
import Card2 from './page/Card/Card2';
// import Grid from './page/order/ordergrid';
import Apps from './page/order/Client and Server/index';
// import Apps from './page/order/index';
import Apps1 from './page/order/Client and Server/index1';
import Hierarchy from './page/order/hierarchy';
import Server_Grid from './page/order/Client and Server/servergrid';
import Server_Grid1 from './page/order/Client and Server/servergrid1';
// import DetailTemplate from './page/detailgrid';
import DetailTemplate from "./page/order/detailgrid"; 
import GanttChartDefaultFunctionalities from "./page/order/chart"; 
// import Grid1 from './page/order/Gridclient';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Entry />} />
          {/* <Route index element={<Entry />} /> */}
          <Route path="ordsync" element={<Ordsync />} />
          <Route path="Login" element={<Login />} />
          <Route path="details" element={<OrderGridWithDetail />} />
          <Route path="OrderGridWithDetail1" element={<OrdersGridWithDetails />} />
          <Route path="SEODashboard" element={<SEODashboard />} />
          <Route path="Vehicle_Report" element={<VehicleReport />} />
          <Route path="card" element={<Card />} />
           <Route path="card-details" element={<Card2 />} />
           {/* <Route path="Apps1" element={<Grid />} /> */}
           {/* <Route path="Grid1" element={<Grid1 />} /> */}
           <Route path="Apps13" element={<Apps />} />
           <Route path="Apps1" element={<Apps1 />} />
           <Route path="Hierarchy" element={<Hierarchy />} />
           <Route path="/server_grid" element={<Server_Grid />} />
           <Route path="/server_grid1" element={<Server_Grid1 />} />
           <Route path="/DetailTemplate" element={<DetailTemplate />} />
           <Route path="/GanttChart" element={<GanttChartDefaultFunctionalities />} />
           {/* <Route path="Apps1" element={<Apps1 />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}


// /src/App.jsx
// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Layout from './components/Layout';
// import OrderGridWithDetail from './page/Order/OrderDetails';
// import Ordsync from './page/Order/ordsync';
// import OrdersGridWithDetails from './page/Order/newprn';
// import SEODashboard from './page/Dashboard/dashboard';
// import Login from './components/login';
// import VehicleReport from './page/Vehicle/vehicle';
// import Entry from './page/Entryscreen/Entry';
// import Card from './page/Card/Card';
// import Card2 from './page/Card/Card2';

// import OrderGrid from './page/order/ordergrid'; // ✅ reusable grid component
// import Apps from './page/order/index';           // ✅ page that renders OrderGrid

// // Example columns reused across routes
// const commonColumns = [
//   { field: 'slno',               headerText: 'SL NO',               width: 150 },
//   { field: 'jobno_oms',          headerText: 'Job No OMS',          width: 120 },
//   { field: 'production_unit',    headerText: 'Production Unit',     width: 200 },
//   { field: 'quantity',           headerText: 'Quantity',            width: 120 },
//   { field: 'shipment_complete',  headerText: 'Shipment Complete',   width: 250 },
//   { field: 'stylename',          headerText: 'Style Name',          width: 120 },
// ];

// const ORDERS_URL = 'https://app.herofashion.com/order_panda1/';

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Entry />} />
//           <Route path="ordsync" element={<Ordsync />} />
//           <Route path="Login" element={<Login />} />
//           <Route path="details" element={<OrderGridWithDetail />} />
//           <Route path="OrderGridWithDetail1" element={<OrdersGridWithDetails />} />
//           <Route path="SEODashboard" element={<SEODashboard />} />
//           <Route path="Vehicle_Report" element={<VehicleReport />} />
//           <Route path="card" element={<Card />} />
//           <Route path="card-details" element={<Card2 />} />

//           {/* Route: direct reusable grid with props */}
//           <Route
//             path="Apps1"
//             element={<OrderGrid baseUrl={ORDERS_URL} columns={commonColumns} />}
//           />

//           {/* Route: page that uses OrderGrid internally */}
//           <Route path="Apps13" element={<Apps />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }
