
// /src/page/order/index.jsx
import * as React from 'react';
import Grid from './server_sync';

const ORDERS_URL = 'https://app.herofashion.com/order_panda1/';

function Apps() {
  return (
    <div className="control-pane" style={{ padding: 16 }}>
      <div className="control-section">
        <h3 style={{ marginBottom: 8 }}>Grid with on-demand data actions</h3>
        <Grid
          baseUrl={ORDERS_URL}
          columns={[
            { field: 'slno',              headerText: 'SL NO',              width: '150' },
            { field: 'jobno_oms',         headerText: 'Job No OMS',         width: '120' },
            { field: 'production_unit',   headerText: 'Production Unit',    width: '200' },
            { field: 'quantity',          headerText: 'Quantity',           width: '120' },
            { field: 'shipment_complete', headerText: 'Shipment Complete',  width: '250' },
            { field: 'stylename',         headerText: 'Style Name',         width: '120' },
          ]}
        />
      </div>
    </div>
  );
}

export default Apps;
