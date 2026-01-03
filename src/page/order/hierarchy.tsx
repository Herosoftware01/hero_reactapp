import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, DetailRow, Page, Sort, FilterSettingsModel, Filter } from '@syncfusion/ej2-react-grids';
import { Grid } from '@syncfusion/ej2-grids';
import { customerData,employeeData,orderDatas } from './data';

function Hierarchy() {
    const filterSettings: FilterSettingsModel = {type: 'Excel'};
    const secondChildGrid: any = {
        dataSource: customerData,
        queryString: 'CustomerID',
        columns: [
            { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right', width: 75 },
            { field: 'ContactName', headerText: 'Contact Name', width: 100 },
            { field: 'Address', headerText: 'Address', width: 120 },
            { field: 'Country', headerText: 'Country', width: 100 }
        ]
    };
    const childGrid: any = {
        dataSource: orderDatas,
        queryString: 'EmployeeID',
        allowPaging: true,
        pageSettings: { pageSize: 6, pageCount: 5 },
        columns: [
            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
            { field: 'ShipCity', headerText: 'Ship City', width: 120 },
            { field: 'Freight', headerText: 'Freight', width: 120 },
            { field: 'ShipName', headerText: 'Ship Name', width: 150 }
        ],
        childGrid: secondChildGrid
    };
    return (
        <div className='control-pane'>
            <div className='control-section'>
                <GridComponent dataSource={employeeData} childGrid={childGrid} allowSorting={true} allowFiltering={true} filterSettings={filterSettings}>
                    <ColumnsDirective>
                        <ColumnDirective field='EmployeeID' headerText='Employee ID' width='125' textAlign='Right'/>
                        <ColumnDirective field='FirstName' headerText='Name' width='125'/>
                        <ColumnDirective field='Title' headerText='Title' width='180' />
                        <ColumnDirective field='HireDate' headerText='Hire Date' width='135' format={{ skeleton: 'yMd', type: 'date' }} textAlign='Right'/>
                        <ColumnDirective field='ReportsTo' headerText='Reports To' width='135' textAlign='Right' />
                    </ColumnsDirective>
                    <Inject services={[DetailRow, Page, Sort, Filter]} />
                </GridComponent>
            </div>
        </div>
    )
}
export default Hierarchy;