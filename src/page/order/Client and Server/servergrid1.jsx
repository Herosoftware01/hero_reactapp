import React, { useEffect, useState } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  DetailRow,
  Page,
  Sort,
  Filter
} from '@syncfusion/ej2-react-grids';

function Server_Grid1() {

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- FETCH API ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://app.herofashion.com/order_panda1/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // --- CRITICAL FIX: Extract 'results' array from the API object ---
        // The API returns { count: ..., results: [...] }
        // We must pass the array inside 'results' to the grid.
        if (result.results && Array.isArray(result.results)) {
          setData(result.results);
        } else {
          console.error("API results format unexpected", result);
          setData([]);
        }

        setError(null);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- CHILD GRID TEMPLATE ---------------- */
  const detailTemplate = (props) => {
    return (
      <GridComponent
        dataSource={[props]} 
        allowPaging={true}
        pageSettings={{ pageSize: 6 }}
        height="450"
      >
        <ColumnsDirective>
          <ColumnDirective field="jobno_oms" headerText="jobno_oms" width={120} />
          <ColumnDirective field="stylename" headerText="stylename" width={120} />
          <ColumnDirective field="buyer" headerText="buyer" width={220} />
          <ColumnDirective field="quantity" headerText="Qty" textAlign="Right" width={80} />
          <ColumnDirective field="production_unit" headerText="production_unit" textAlign="Right" width={80} />
          <ColumnDirective
            headerText="Image"
            width={120}
            template={(row) =>
              row.mainimagepath ? (
                <img
                  src={row.mainimagepath}
                  alt=""
                  style={{ width: 60, height: 60, objectFit: 'contain' }}
                />
              ) : (
                <span>No Image</span>
              )
            }
          />
        </ColumnsDirective>
      </GridComponent>
    );
  };

  /* ---------------- LOADING / ERROR ---------------- */
  if (isLoading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;

  /* ---------------- PARENT GRID ---------------- */
  return (
    <div className="control-pane" style={{ padding: '20px' }}>
      <div className="control-section">
        <GridComponent
          dataSource={data}
          allowPaging={true}
          allowSorting={true}
          allowFiltering={true}
          pageSettings={{ pageSize: 20 }}
          filterSettings={{ type: 'Excel' }}
          detailTemplate={detailTemplate}
          height="500px" 
        >
          <ColumnsDirective>
            {/* Changed field="id" to field="slno" to match the API Image */}
            <ColumnDirective field="slno" headerText="ID" width={90} textAlign="Right" />
            
            <ColumnDirective
                field="jobno_oms"
                headerText="jobno_oms"
                width={110}
                textAlign="Right"
            />
            
            <ColumnDirective field="stylename" headerText="stylename" width={150} />
            <ColumnDirective field="buyer" headerText="buyer" width={120} />
            <ColumnDirective field="quantity" headerText="quantity" width={120} />
            <ColumnDirective field="production_unit" headerText="production_unit" width={100} textAlign="Right" />
            <ColumnDirective field="merch" headerText="merch" width={100} textAlign="Right" />
            <ColumnDirective field="quality_controller" headerText="quality_controller" width={120} />
          </ColumnsDirective>

          <Inject services={[DetailRow, Page, Sort, Filter]} />
        </GridComponent>
      </div>
    </div>
  );
}

export default Server_Grid1;