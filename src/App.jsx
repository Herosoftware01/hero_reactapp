// import React from 'react'
// import {BrowserRouter, Routes, Route} from 'react-router-dom'
// import Ordsync from './page/ordsync'
// import OrderGridWithDetail from './page/orddetails'
// import ErrorBoundary from './ErrorBoundary'
// import SidebarWithMenu from './page/sidebar-menu.jsx'

// export default function App() {
//   return (
//     <>
//      <BrowserRouter>
//       <ErrorBoundary>
//         <Routes>
//           <Route path="/" element={<Ordsync/>}></Route>
//           <Route path="/details" element={<OrderGridWithDetail/>}></Route>
//           <Route path="/sidebar" element={<SidebarWithMenu/>}></Route>
//         </Routes>
//       </ErrorBoundary>
//     </BrowserRouter>
//     </>
//   )
// }

// src/App.jsx



import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import OrderDetails from './page/OrderDetails';
import Ordsync from './page/ordsync';
import OrdersGridWithDetails from './page/order/newprn';
import DailyReport from './page/daily';
import SEODashboard from './page/Dashboard/dashboard';
import Login from './components/login'

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
        </Route>

        {/* Independent route for new grid */}
        {/* <Route path="OrderGridWithDetail1" element={<OrderGridWithDetail1 />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
