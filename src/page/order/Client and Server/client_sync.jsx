// /src/page/order/Gridclient.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react'; // ✅ 1. Import useRef
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Filter,
  Sort,
  Toolbar,
  Search,
  Inject,
} from '@syncfusion/ej2-react-grids';
import { Ajax } from '@syncfusion/ej2-base';

// ---------------------------------------------------------
// IMPORTANT: CSS IS REQUIRED
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-grids/styles/material.css";
// ---------------------------------------------------------

export default function Grid1({ baseUrl, columns }) {
  const [gridData, setGridData] = useState([]);
  
  // ✅ 2. Create a reference to the Grid component
  const gridRef = useRef(null);
  
  const pageSettings = { pageSize: 10, pageCount: 5 };
  const searchOptions = { 
    ignoreCase: true, 
    operator: 'contains', 
    key: '' 
  };

  const ajax = useMemo(
    () =>
      new Ajax({
        type: 'GET',
        mode: true,
        onFailure: () => {
          console.error("Failed to fetch data");
        },
      }),
    []
  );

  const safeColumns = Array.isArray(columns) ? columns : [];

  useEffect(() => {
    if (!baseUrl) {
      setGridData([]);
      return;
    }

    ajax.url = baseUrl;
    ajax.send().then((e) => {
      let response;
      try {
        response = typeof e === 'string' ? JSON.parse(e) : e;
      } catch {
        response = e;
      }

      const dataArray = Array.isArray(response) ? response : response?.results ?? [];
      setGridData(dataArray);
    });
  }, [baseUrl, ajax]);

  // ✅ 3. CRITICAL FIX: Watch gridData and force refresh
  useEffect(() => {
    if (gridRef.current && gridData.length > 0) {
      // This simulates the "click" action programmatically
      gridRef.current.refresh(); 
    }
  }, [gridData]);

  return (
    <div className="control-section" style={{ width: '100%', padding: '10px' }}>
      <GridComponent
        ref={gridRef} // ✅ 4. Attach ref to GridComponent
        
        dataSource={gridData}
        allowPaging={true}
        pageSettings={pageSettings}
        allowSorting={true}
        allowFiltering={true}
        filterSettings={{ type: 'Excel' }}
        
        toolbar={['Search']}
        searchSettings={searchOptions}
        
        width="100%"
        height="400px" // Keep fixed height
        allowTextWrap={true}
        gridLines='Both'
      >
        <ColumnsDirective>
          {safeColumns.map((col, idx) => (
            <ColumnDirective 
              key={idx} 
              {...col} 
              width={col.width || 'auto'} 
            />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Filter, Sort, Toolbar, Search]} />
      </GridComponent>
    </div>
  );
}