
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Ordsync from './page/Order/ordsync';
import SEODashboard from './page/Dashboard/dashboard';
import Login from './components/login';
import VehicleReport from './page/Vehicle/vehicle';
import Entry from './page/Entryscreen/Entry';
import Apps from './page/order/Client and Server/index';
import Apps1 from './page/order/Client and Server/index1';
import Hierarchy from './page/order/hierarchy';
import Server_Grid from './page/order/Client and Server/servergrid';
import Server_Grid1 from './page/order/Client and Server/servergrid1';
import GanttChartDefaultFunctionalities from './page/order/chart';


const DetailTemplate = React.lazy(() => import('./page/order/detailgrid'));
const OrderGridWithDetail = React.lazy(() => import('./page/Order/OrderDetails'));
const OrdersGridWithDetails = React.lazy(() => import('./page/Order/newprn'));
const Card = React.lazy(() => import('./page/Card/Card'));
const Card2 = React.lazy(() => import('./page/Card/Card2'));

// GreyRollChecking
const GreyLayout = React.lazy(() => import('./GreyRollChecking/components/GreyLayout')) 
const EntryPage = React.lazy(() => import('./GreyRollChecking/pages/EntryPage'))
const Checking = React.lazy(() => import('./GreyRollChecking/pages/Checking'))
const RollChecking = React.lazy(() => import('./GreyRollChecking/pages/RollChecking'))
const MachineReport = React.lazy(() => import('./GreyRollChecking/components/MachineReport')) 
const Machine = React.lazy(() => import('./GreyRollChecking/pages/Machine'))

export default function App() {
  return (
    <BrowserRouter>
       <Suspense fallback={<div>Loading...</div>}>
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


            {/* GreyRollChecking */}
            <Route path="/grey-app" element={<GreyLayout />}>
                <Route index element={<EntryPage />} />
                <Route path="/grey-app/machine/:id" element={<Machine />} />
                <Route path="/grey-app/machine/:id/checking" element={<Checking />} />
                <Route path="/grey-app/machine/:id/details" element={<RollChecking />} />
                <Route path="/grey-app/machine/:id/report" element={<MachineReport />} />
            </Route>

          </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
