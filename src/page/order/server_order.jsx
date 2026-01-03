// index.jsx
import { createRoot } from 'react-dom/client';
import * as React from 'react';
// import './index.css';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Group,
  Sort,
  VirtualScroll,
  Inject,
} from '@syncfusion/ej2-react-grids';
import { Ajax } from '@syncfusion/ej2-base';

/**
 * Reusable grid that accepts baseUrl + columns and renders on same page.
 * Supports both OData and non-OData APIs.
 */

export default function Grid({ baseUrl, columns }) {
  const gridRef = React.useRef(null);
  const pageSettings = { pageSize: 10 };
  const ajax = React.useMemo(
    () =>
      new Ajax({
        type: 'GET',
        mode: true,
        onFailure: () => false,
      }),
    []
  );

  /** Build query string depending on API type */
  const buildQuery = (state) => {
    let pageQuery = '';
    let sortQuery = '';
    debugger;
    if (state?.sorted && state?.sorted?.length) {
      state.sorted.reverse();
      for (let i = 0; i < state?.sorted?.length; i++) {
        if (i == 0) {
          sortQuery += 'sort=';
        }
        if (state?.sorted[i].direction === 'ascending') {
          sortQuery += '' + state?.sorted[i].name;
        } else if (state?.sorted[i].direction === 'descending') {
          sortQuery += '-' + state?.sorted[i].name;
        }
        if (i < state?.sorted?.length - 1) {
          sortQuery += ',';
        }
      }
    }
    if (state?.skip != undefined && state?.take != undefined) {
      const page = (state?.skip + state?.take) / state?.take;
      const pageSize = state?.take;
      if (sortQuery != '') {
        pageQuery += '&';
      }
      pageQuery += 'page=' + page + '&page_size=' + pageSize;
    }
    return `${baseUrl}?${sortQuery}${pageQuery}`;
  };

  const getData = (state) => {
    ajax.url = buildQuery(state);
    return ajax.send().then((e) => {
      let response;
      try {
        response = JSON.parse(e);
      } catch {
        response = e; // in case API returns plain text/other payload
      }
      return {
        result: response.results,
        count: response.count,
      };
    });
  };

  const dataStateChange = (state) => {
    debugger;
    getData(state).then((gridData) => {
      if (gridRef.current) {
        gridRef.current.dataSource = gridData; // expects { result, count }
      }
    });
  };

  // Initial load
  React.useEffect(() => {
    dataStateChange({ skip: 0, take: pageSettings.pageSize });
  }, [baseUrl]); // re-run if URL or mode changes

  return (
    <GridComponent
      ref={gridRef}
      allowPaging={true}
      pageSettings={pageSettings}
      height={400}
      allowSorting={true}
      dataStateChange={dataStateChange}
    >
      <ColumnsDirective>
        {columns.map((col, idx) => (
          <ColumnDirective key={idx} {...col} />
        ))}
      </ColumnsDirective>
      <Inject services={[Page, VirtualScroll, Page, Group, Sort]} />
    </GridComponent>
  );
}
