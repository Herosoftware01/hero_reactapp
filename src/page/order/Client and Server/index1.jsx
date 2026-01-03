
// /src/page/order/index1.jsx
import React from 'react';
import Grid1 from './client_sync';

const ORDERS_URL = 'https://app.herofashion.com/order_panda/';

export default function Apps1() {
  return (
    <div className="control-pane" style={{ padding: 16 }}>
      <div className="control-section">
        <h3 style={{ marginBottom: 8 }}>Grid with client data actions</h3>
        <Grid1
          baseUrl={ORDERS_URL}
          columns={[
            { field: 'slno',              headerText: 'SL NO',              width: 150 },
            { field: 'jobno_oms',         headerText: 'Job No OMS',         width: 120 },
            { field: 'production_unit',   headerText: 'Production Unit',    width: 200 },
            { field: 'quantity',          headerText: 'Quantity',           width: 120 },
            { field: 'shipment_complete', headerText: 'Shipment Complete',  width: 250 },
            { field: 'stylename',         headerText: 'Style Name',         width: 120 },
          ]}
        />
      </div>
    </div>
  );
}

