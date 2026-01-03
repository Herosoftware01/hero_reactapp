import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { registerLicense } from '@syncfusion/ej2-base';

// Replace with your actual Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1JGaF5cXGpCf0x0Q3xbf1x2ZFBMYVlbQHBPMyBoS35Rc0RhW3hedXVQQ2heWUB2VEFf');

import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  DetailRow,
  Inject as GridInject,
  Sort,
  Filter,
} from '@syncfusion/ej2-react-grids';

import {
  TabComponent,
  TabItemDirective,
  TabItemsDirective,
} from '@syncfusion/ej2-react-navigations';

import {
  Category,
  ChartComponent,
  Legend,
  LineSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  Tooltip,
  Inject as ChartInject,
} from '@syncfusion/ej2-react-charts';

import {
  KanbanComponent,
  ColumnsDirective as KanbanColumns,
  ColumnDirective as KanbanColumn,
} from '@syncfusion/ej2-react-kanban';

function OrderGridWithDetail() {
  const [orderData, setOrderData] = useState<any[]>([]);
  const [detailDataMap, setDetailDataMap] = useState<Record<string, any[]>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const gridRef = useRef<any>(null);
  const location = useLocation();

  // Normalize task status
  const normalizeTask = (t: any) => {
    const rawStatus = (t.Status || t.status || '').toString().toLowerCase();
    let Status = 'Open';
    if (rawStatus.includes('progress')) Status = 'InProgress';
    else if (rawStatus.includes('test')) Status = 'Testing';
    else if (rawStatus.includes('close') || rawStatus.includes('done')) Status = 'Close';

    return {
      Id: t.Id || t.id || `task-${Math.random().toString(36).substr(2, 9)}`,
      Summary: t.Summary || t.summary || 'No summary',
      Status,
      Estimate: Number(t.Estimate ?? 0),
      Spent: Number(t.Spent ?? 0),
    };
  };

  // Fetch main order data + convert date strings to Date objects
  useEffect(() => {
    setIsLoading(true);

    fetch('https://app.herofashion.com/order_panda/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
      })
      .then((data) => {
        const arr = Array.isArray(data) ? data : [data];

        // Critical fix: Convert final_delivery_date strings to real Date objects
        const processedData = arr.map((order: any) => ({
          ...order,
          final_delivery_date: order.final_delivery_date
            ? new Date(order.final_delivery_date)
            : null,
        }));

        setOrderData(processedData);
        setIsLoading(false);

        // Force grid refresh after data load
        if (gridRef.current) {
          setTimeout(() => {
            gridRef.current.refresh();
          }, 0);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setIsLoading(false);
        setOrderData([]);
      });
  }, []);

  // Auto-expand row if ?job= param is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jobToOpen = params.get('job');
    if (!jobToOpen || !orderData.length || !gridRef.current) return;

    setTimeout(() => {
      const grid = gridRef.current;
      const rowIndex = grid.getRowIndexByPrimaryKey(jobToOpen);
      if (rowIndex >= 0) {
        const rowElement = grid.getRowByIndex(rowIndex);
        grid.detailRowModule.expand(rowElement);

        // Preload detail data
        const rowData = orderData.find((r) => String(r.jobno_oms) === String(jobToOpen));
        if (rowData) detailDataBound({ data: rowData });
      }
    }, 500);
  }, [location.search, orderData]);

  // Load tasks when detail row expands
  const detailDataBound = async (args: any) => {
    const id = args?.data?.jobno_oms;
    if (!id || detailDataMap[id]) return;

    setLoadingDetails((prev) => ({ ...prev, [id]: true }));

    try {
      const resp = await fetch(`https://app.herofashion.com/order_panda/${id}/tasks/`);
      const tasks = resp.ok ? await resp.json() : [];
      const normalized = Array.isArray(tasks) ? tasks.map(normalizeTask) : [];

      setDetailDataMap((prev) => ({ ...prev, [id]: normalized }));
    } catch (err) {
      console.error('Error loading tasks:', err);
      setDetailDataMap((prev) => ({ ...prev, [id]: [] }));
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Image template
  const imageTemplate = (props: any) => (
    <img
      src={props.mainimagepath || 'https://via.placeholder.com/80'}
      alt={props.jobno_oms || 'Order'}
      style={{
        width: 70,
        height: 70,
        objectFit: 'cover',
        borderRadius: 6,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    />
  );

  // Custom "View Details" link to toggle expand/collapse
  const expandToggleTemplate = (props: any) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      const grid = gridRef.current;
      if (!grid) return;

      const rowIndex = grid.getRowIndexByPrimaryKey(props.jobno_oms);
      if (rowIndex === -1) return;

      const rowElement = grid.getRowByIndex(rowIndex);
      const isExpanded = rowElement.classList.contains('e-detailrowexpand');

      if (isExpanded) {
        grid.detailRowModule.collapse(rowElement);
      } else {
        grid.detailRowModule.expand(rowElement);
      }
    };

    return (
      <a
        href="#"
        onClick={handleClick}
        style={{
          color: '#007bff',
          fontWeight: '500',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
        onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
        onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
      >
        View Details
      </a>
    );
  };

  // Burndown-style Chart
  const chartTemplate = (tasks: any[]) => {
    const statuses = ['Open', 'InProgress', 'Testing', 'Close'];
    const aggregated = statuses.map((status) => {
      const filtered = tasks.filter((t) => t.Status === status);
      return {
        status,
        estimatedHours: filtered.reduce((sum: number, t: any) => sum + t.Estimate, 0),
        spentHours: filtered.reduce((sum: number, t: any) => sum + t.Spent, 0),
      };
    });

    return (
      <ChartComponent
        height="350px"
        primaryXAxis={{ valueType: 'Category', title: 'Task Status' }}
        primaryYAxis={{ title: 'Hours' }}
        tooltip={{ enable: true }}
        legendSettings={{ visible: true }}
      >
        <ChartInject services={[LineSeries, Category, Legend, Tooltip]} />
        <SeriesCollectionDirective>
          <SeriesDirective
            dataSource={aggregated}
            xName="status"
            yName="estimatedHours"
            name="Estimated Hours"
            type="Line"
            marker={{ visible: true }}
            width={3}
          />
          <SeriesDirective
            dataSource={aggregated}
            xName="status"
            yName="spentHours"
            name="Spent Hours"
            type="Line"
            marker={{ visible: true }}
            width={3}
          />
        </SeriesCollectionDirective>
      </ChartComponent>
    );
  };

  // Kanban Board for tasks
  const taskTemplate = (tasks: any[]) => (
    <KanbanComponent
      dataSource={tasks}
      keyField="Status"
      cardSettings={{
        headerField: 'Id',
        contentField: 'Summary',
        showHeader: true,
      }}
      height="400px"
    >
      <KanbanColumns>
        <KanbanColumn headerText="Open" keyField="Open" />
        <KanbanColumn headerText="In Progress" keyField="InProgress" />
        <KanbanColumn headerText="Testing" keyField="Testing" />
        <KanbanColumn headerText="Done" keyField="Close" />
      </KanbanColumns>
    </KanbanComponent>
  );

  // Detail row template
  const gridDetailTemplate = (props: any) => {
    const id = props.jobno_oms;
    const tasks = detailDataMap[id] || [];

    return (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderTop: '2px solid #e0e0e0' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
          Tasks for Order: <strong>{id}</strong>
        </h4>

        {loadingDetails[id] ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available for this order.</p>
        ) : (
          <TabComponent height="420px">
            <TabItemsDirective>
              <TabItemDirective header={{ text: 'Task Board' }} content={() => taskTemplate(tasks)} />
              <TabItemDirective header={{ text: 'Burndown Chart' }} content={() => chartTemplate(tasks)} />
            </TabItemsDirective>
          </TabComponent>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Order Details Grid</h2>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>
          Loading orders...
        </div>
      ) : orderData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
          No orders found.
        </div>
      ) : (
        <GridComponent
          ref={gridRef}
          dataSource={orderData}
          height="700px"
          detailTemplate={gridDetailTemplate}
          detailDataBound={detailDataBound}
          allowSorting={true}
          allowFiltering={true}
          filterSettings={{ type: 'CheckBox' }}
        >
          <ColumnsDirective>
            <ColumnDirective
              headerText="Actions"
              width="130"
              textAlign="Center"
              template={expandToggleTemplate}
            />
            <ColumnDirective headerText="Image" width="100" template={imageTemplate} />
            <ColumnDirective
              field="jobno_oms"
              headerText="Order ID"
              isPrimaryKey={true}
              width="150"
            />
            <ColumnDirective field="styleid" headerText="Style ID" width="130" />
            <ColumnDirective field="pono" headerText="PO Number" width="140" />
            <ColumnDirective
              field="final_delivery_date"
              headerText="Delivery Date"
              width="160"
              type="date"
              format={{ type: 'date', format: 'yMd' }}
            />
            <ColumnDirective field="jobnoomsnew" headerText="Job Number" width="140" />
            <ColumnDirective field="company_name" headerText="Company" width="200" />
            <ColumnDirective field="reference" headerText="Reference" width="220" />
          </ColumnsDirective>

          <GridInject services={[DetailRow, Sort, Filter]} />
        </GridComponent>
      )}
    </div>
  );
}

export default OrderGridWithDetail;