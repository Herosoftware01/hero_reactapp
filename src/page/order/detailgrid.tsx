import React, { useState, useEffect } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, DetailRow, Inject, Sort, Filter, Grid } from '@syncfusion/ej2-react-grids';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';

// --- CSS STYLES (Injected) ---
const globalStyles = `
    .image { padding: 5px; text-align: center; }
    .image img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #e0e0e0; }
    .card-template { width: 100%; height: 100%; display: block; padding: 0; background-color: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.13); border-radius: 3px; border: 1px solid #e0e0e0; font-size: 13px; }
    .control-pane { padding: 20px; }
    
    /* Simple table styles for the detail template */
    .fabric-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .fabric-table th, .fabric-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .fabric-table th { background-color: #f2f2f2; }
`;

// --- SUB-COMPONENT: CHILD CONTENT (Updated for Real Data) ---
// This component now displays the 'Fabric' array from your JSON data
const ChildDetailContent = (props) => {
    
    // Check if Fabric data exists for this row
    if (!props.Fabric || props.Fabric.length === 0) {
        return <div style={{ padding: '10px' }}>No fabric details available.</div>;
    }

    return (
        <div style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
            <h4 style={{ marginTop: 0 }}>Fabric Details</h4>
            <table className="fabric-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Process</th>
                        <th>Method</th>
                    </tr>
                </thead>
                <tbody>
                    {props.Fabric.map((item, index) => (
                        <tr key={index}>
                            <td>{item.topbottom_des}</td>
                            <td>{item.prodqty}</td>
                            <td>{item.process_des}</td>
                            <td>{item.m}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- MAIN COMPONENT ---
function DetailTemplate() {
    // 1. State to hold the fetched data
    const [gridData, setGridData] = useState([]);

    // 2. Fetch data from API on component mount
    useEffect(() => {
        fetch("https://app.herofashion.com/grid_api1ord/")
            .then(response => response.json())
            .then(data => {
                console.log("Data fetched:", data); // Check console to see data structure
                setGridData(data);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    // 3. Updated Image Template to use the 'photo' field from API
    const employeeTemplate = (props) => {
        const src = props.photo ? props.photo : `https://picsum.photos/seed/${props.id}/100/100`;
        return (<div className='image'><img src={src} alt={props.id} /></div>);
    }

    return (
        <div className='control-pane'>
            {/* Injecting styles */}
            <style>{globalStyles}</style>
            
            <div className='control-section'>
                <GridComponent 
                    dataSource={gridData} // Use the state variable, not the URL string
                    height='600' 
                    detailTemplate={ChildDetailContent} // Updated detail template
                    width='auto' 
                    allowSorting={true} 
                    allowFiltering={true} 
                    filterSettings={{ type: 'CheckBox' }}
                >
                    <ColumnsDirective>
                        {/* Updated fields to match your JSON structure */}
                        <ColumnDirective headerText='Image' width='100' template={employeeTemplate} textAlign='Center' />
                        <ColumnDirective field="id" headerText='ID' width='120' isPrimaryKey={true}/>
                        <ColumnDirective field="name" headerText='Name' width='120' />
                        <ColumnDirective field="dept" headerText='Department' width='150' />
                        <ColumnDirective field="dt" headerText='Date' width='100' />
                        <ColumnDirective field="sv" headerText='Unit' width='100' />
                        <ColumnDirective field="mins" headerText='Type' width='100' />
                        {/* 'pers' contains long text, we might hide it or show it in details, adding here for reference */}
                        <ColumnDirective field="pers" headerText='Description' width='300' visible={false} /> 
                    </ColumnsDirective>
                    <Inject services={[DetailRow, Sort, Filter]} />
                </GridComponent>
            </div>
        </div>
    )
}

export default DetailTemplate;