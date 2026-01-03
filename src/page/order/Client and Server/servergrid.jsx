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

function Server_Grid() {

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- FETCH API ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://app.herofashion.com/grid_api/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
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
        dataSource={props.details}
        allowPaging={true}
        pageSettings={{ pageSize: 6 }}
        height={250}
      >
        <ColumnsDirective>
          <ColumnDirective field="jobno" headerText="Job No" width={120} />
          <ColumnDirective field="topbottom_des" headerText="Top/Bottom" width={120} />
          <ColumnDirective field="process_des" headerText="Process" width={220} />
          <ColumnDirective field="prodqty" headerText="Qty" textAlign="Right" width={80} />
          <ColumnDirective field="m" headerText="Mins" textAlign="Right" width={80} />
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
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  /* ---------------- PARENT GRID ---------------- */
  return (
    <div className="control-pane">
      <div className="control-section">
        <GridComponent
          dataSource={data}
          allowPaging={true}
          allowSorting={true}
          allowFiltering={true}
          pageSettings={{ pageSize: 10 }}
          filterSettings={{ type: 'Excel' }}
          detailTemplate={detailTemplate}
        >
          <ColumnsDirective>
            <ColumnDirective field="id" headerText="ID" width={90} textAlign="Right" />
            {/* <ColumnDirective field="dt" headerText="Date" width={90} textAlign="Right"  /> */}
            <ColumnDirective
                field="dt"
                headerText="Date"
                width={110}
                textAlign="Right"
                type="date"
                format={{ type: 'date', format: 'dd/MM/yyyy' }}
                />
            <ColumnDirective field="name" headerText="Name" width={150} />
            <ColumnDirective field="dept" headerText="Dept" width={120} />
            <ColumnDirective field="category" headerText="Category" width={120} />
            <ColumnDirective field="salary" headerText="Salary" width={100} textAlign="Right" />
            <ColumnDirective field="mins" headerText="Minutes" width={100} textAlign="Right" />
            <ColumnDirective field="pers" headerText="pers" width={120} />
          </ColumnsDirective>

          <Inject services={[DetailRow, Page, Sort, Filter]} />
        </GridComponent>
      </div>
    </div>
  );
}

export default Server_Grid;
