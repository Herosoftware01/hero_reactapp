import React, { useState, useEffect, useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, DetailRow, Inject, Sort, Filter, Grid, Page } from '@syncfusion/ej2-react-grids';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Category, ChartComponent, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective, Tooltip } from '@syncfusion/ej2-react-charts';
import { KanbanComponent, ColumnsDirective as KanbanColumns, ColumnDirective as KanbanColumn } from '@syncfusion/ej2-react-kanban';

// --- CSS STYLES ---
const globalStyles = `
    .image { padding: 5px; text-align: center; }
    .image img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #e0e0e0; }
    .card-template { width: 100%; height: 100%; display: block; padding: 0; background-color: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.13); border-radius: 3px; border: 1px solid #e0e0e0; font-size: 13px; }
    .card-template-wrap { margin: 0; padding: 10px; width: 100%; }
    .e-card-header-title { font-weight: 600; margin-bottom: 5px; color: #333; }
    .e-card-content { display: block; margin-bottom: 5px; color: #666; }
    .control-pane { padding: 20px; }
    .detail-header { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #333; }
    
    /* Print Button Style */
    .print-btn {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        float: right;
        margin-bottom: 10px;
        z-index: 10;
    }
    .print-btn:hover { background-color: #0056b3; }
    
    /* Card Image Style */
    .card-thumb { width: 100%; height: 100px; object-fit: cover; border-bottom: 1px solid #eee; margin-bottom: 5px; border-radius: 2px; }
`;

// --- SUB-COMPONENT: CHILD CONTENT ---
const ChildDetailContent = (props: any) => {
    
    // DEBUG: Check what props are actually coming in
    // console.log("CHILD PROPS:", props);

    // 1. Refs for Kanbans
    const kanbanFabricRef = useRef<any>(null);
    const kanbanPrintingRef = useRef<any>(null);

    // 2. Extract Data
    // Since JSON is nested, parent id matches child jobno automatically
    const fabricData = Array.isArray(props.Fabric) ? props.Fabric : [];
    const printingData = Array.isArray(props.Printing) ? props.Printing : [];

    // 3. Chart Data
    const chartData = fabricData.map((item: any, index: number) => ({
        x: item.topbottom_des || `Fabric ${index}`,
        y: parseFloat(item.prodqty) || 1,
        process: item.process_des
    }));

    // 4. Print Handlers
    const handlePrintFabric = () => {
        if (kanbanFabricRef.current) kanbanFabricRef.current.print();
    };
    
    const handlePrintPrinting = () => {
        if (kanbanPrintingRef.current) kanbanPrintingRef.current.print();
    };

    // 5. Card Template (Shared)
    const cardTemplate = (cardProps: any) => {
        // Only show image if it is a valid HTTP URL (browsers can't load local \\ paths)
        const imgUrl = (cardProps.mainimagepath && cardProps.mainimagepath.startsWith('http')) 
            ? cardProps.mainimagepath 
            : null;

        return (
            <div className="card-template">
                {imgUrl && <img src={imgUrl} className="card-thumb" alt="Item" />}
                <div className="e-card-header" style={{padding: imgUrl ? '0 10px' : '10px'}}>
                    <div className="e-card-header-caption">
                        <div className="e-card-header-title e-tooltip-text">
                            {cardProps.topbottom_des || cardProps.jobno}
                        </div>
                    </div>
                </div>
                <div className="card-template-wrap" style={{padding: '0 10px 10px 10px'}}>
                    <div className="e-card-content">
                        <b>Process:</b> {cardProps.process_des || '-'}
                    </div>
                    <div className="e-card-content">
                        <b>Method:</b> {cardProps.m || '-'}
                    </div>
                    <div className="e-card-content">
                        <b>Qty:</b> {cardProps.prodqty || '-'}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <p style={{ textAlign: "center", paddingTop: "3px", fontSize: "17px", color: "#333" }}>
                <b>Order: {props.id}</b>
            </p>
            
            <TabComponent animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}>
                <TabItemsDirective>
                    
                    {/* TAB 1: FABRIC TASKBOARD */}
                    <TabItemDirective header={{ text: "Fabric Taskboard" }} content={() => (
                        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                            <div style={{ overflow: 'hidden' }}>
                                <button className="print-btn" onClick={handlePrintFabric}>Print Fabric</button>
                            </div>

                            {fabricData.length === 0 ? (
                                <div style={{textAlign:'center', padding:'20px'}}>No Fabric Data</div>
                            ) : (
                                <KanbanComponent 
                                    ref={kanbanFabricRef}
                                    id={`kanban_fabric_${props.id}`} 
                                    keyField="process_des" 
                                    dataSource={fabricData} 
                                    cardSettings={{ template: cardTemplate, headerField: 'topbottom_des' }}
                                >
                                    <KanbanColumns>
                                        {/* Columns match values in your JSON Fabric.process_des */}
                                        <KanbanColumn headerText="G.T.Process" keyField="G.T.Process" />
                                        <KanbanColumn headerText="Maham Tex" keyField="Maham Tex" />
                                        <KanbanColumn headerText="Texcorp Industries" keyField="Texcorp Industries" />
                                        <KanbanColumn headerText="Eveready Cotton Mills" keyField="Eveready Cotton Mills Pvt Limited" />
                                        <KanbanColumn headerText="Sri Ram Knits" keyField="Sri Ram Knits" />
                                        <KanbanColumn headerText="Others" keyField="Others" /> {/* Catch-all if needed */}
                                    </KanbanColumns>
                                </KanbanComponent>
                            )}
                        </div>
                    )} />

                    {/* TAB 2: PRINTING TASKBOARD */}
                    <TabItemDirective header={{ text: "Printing Taskboard" }} content={() => (
                        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                            <div style={{ overflow: 'hidden' }}>
                                <button className="print-btn" onClick={handlePrintPrinting}>Print Details</button>
                            </div>

                            {printingData.length === 0 ? (
                                <div style={{textAlign:'center', padding:'20px'}}>No Printing Data</div>
                            ) : (
                                <KanbanComponent 
                                    ref={kanbanPrintingRef}
                                    id={`kanban_printing_${props.id}`} 
                                    // FIX: Using "m" as keyField because it contains the status "not pending"
                                    keyField="m" 
                                    dataSource={printingData} 
                                    cardSettings={{ template: cardTemplate, headerField: 'topbottom_des' }}
                                >
                                    <KanbanColumns>
                                        {/* Columns match values in your JSON Printing.m */}
                                        <KanbanColumn headerText="Not Pending" keyField="not pending" />
                                        <KanbanColumn headerText="Pending" keyField="pending" />
                                        <KanbanColumn headerText="Completed" keyField="completed" />
                                    </KanbanColumns>
                                </KanbanComponent>
                            )}
                        </div>
                    )} />

                    {/* TAB 3: CHART */}
                    <TabItemDirective header={{ text: "Analysis Chart" }} content={() => (
                        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                            <ChartComponent 
                                id={`chart_${props.id}`}
                                height="300px" 
                                tooltip={{ enable: true }} 
                                primaryXAxis={{ valueType: 'Category', title: 'Fabric Description' }} 
                                primaryYAxis={{ title: 'Quantity' }}
                                title="Fabric Breakdown"
                            >
                                <Inject services={[Tooltip, LineSeries, Category, Legend]} />
                                <SeriesCollectionDirective>
                                    <SeriesDirective 
                                        dataSource={chartData} 
                                        xName="x" 
                                        yName="y" 
                                        name="Quantity" 
                                        marker={{ visible: true, width: 10, height: 10 }} 
                                        type='Line'
                                    />
                                </SeriesCollectionDirective>
                            </ChartComponent>
                        </div>
                    )} />

                    {/* TAB 4: BALA */}
                    <TabItemDirective header={{ text: "Bala" }} content={() => (
                        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                            <KanbanComponent 
                                id={`kanban_bala_${props.id}`} 
                                keyField="m" 
                                dataSource={printingData.length > 0 ? printingData : fabricData} 
                                cardSettings={{ template: cardTemplate, headerField: 'topbottom_des' }}
                            >
                                <KanbanColumns>
                                    <KanbanColumn headerText="Dyed" keyField="Dyed" />
                                    <KanbanColumn headerText="Printed" keyField="Printed" />
                                    <KanbanColumn headerText="Cora" keyField="Cora" />
                                    <KanbanColumn headerText="Others" keyField="Others" />
                                </KanbanColumns>
                            </KanbanComponent>
                        </div>
                    )} />

                </TabItemsDirective>
            </TabComponent>
        </div>
    );
};

// --- MAIN COMPONENT ---
function DetailTemplate() {
    
    const [gridData, setGridData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch("https://app.herofashion.com/grid_api1ord/")
            .then(response => response.json())
            .then(data => {
                console.log("Raw API Data:", data);
                
                let finalData: any[] = [];
                if (Array.isArray(data)) {
                    finalData = data;
                } else if (data.result && Array.isArray(data.result)) {
                    finalData = data.result;
                } else if (data.data && Array.isArray(data.data)) {
                    finalData = data.data;
                } else {
                    const firstArray = Object.values(data).find(val => Array.isArray(val));
                    if (firstArray) finalData = firstArray;
                }

                console.log("Final Grid Data:", finalData);
                setGridData(finalData);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const employeeTemplate = (props: any) => {
        const src = props.photo ? props.photo : `https://picsum.photos/seed/${props.id}/100/100`;
        return (<div className='image'><img src={src} alt={props.id} /></div>);
    }

    const linkTemplate = (props: any) => {
        return (<a href={`#`} style={{color: '#007bff'}}>{props.dept}</a>);
    }

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Hero Fashion Data...</div>;
    }

    return (
        <div className='control-pane'>
            <style>{globalStyles}</style>
            
            <div className='control-section'>
                <GridComponent 
                    dataSource={gridData} 
                    height='600' 
                    detailTemplate={(args) => <ChildDetailContent {...args} />}
                    width='auto' 
                    allowSorting={true} 
                    allowFiltering={true} 
                    allowPaging={true}
                    filterSettings={{ type: 'CheckBox' }}
                >
                    <ColumnsDirective>
                        <ColumnDirective headerText='Image' width='100' template={employeeTemplate} textAlign='Center' />
                        <ColumnDirective field="id" headerText='Order ID' isPrimaryKey={true} width='120'/>
                        <ColumnDirective field="name" headerText='Name' width='150' />
                        <ColumnDirective field="dept" headerText='Department' width='150' template={linkTemplate}/>
                        <ColumnDirective field="dt" headerText='Date' width='120' />
                        <ColumnDirective field="sv" headerText='Unit' width='100' />
                        <ColumnDirective field="mins" headerText='Type' width='100' />
                        <ColumnDirective field="pers" headerText='Description' width='300' visible={false} /> 
                    </ColumnsDirective>
                    <Inject services={[DetailRow, Sort, Filter, Page]} />
                </GridComponent>
            </div>
        </div>
    )
}

export default DetailTemplate;