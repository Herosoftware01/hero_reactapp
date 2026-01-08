import React, { useState, useEffect, useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, DetailRow, Inject, Sort, Filter, Grid, Page } from '@syncfusion/ej2-react-grids';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Category, ChartComponent, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective, Tooltip } from '@syncfusion/ej2-react-charts';
import { KanbanComponent, ColumnsDirective as KanbanColumns, ColumnDirective as KanbanColumn } from '@syncfusion/ej2-react-kanban';

// --- RESPONSIVE CSS STYLES ---
const globalStyles = `
    /* Base Styles */
    .control-pane { padding: 20px; height: calc(100vh - 20px); display: flex; flex-direction: column; }
    .control-section { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    
    .image { padding: 5px; text-align: center; }
    .image img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #e0e0e0; }
    
    .card-template { width: 100%; display: block; padding: 0; background-color: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.13); border-radius: 3px; border: 1px solid #e0e0e0; font-size: 13px; }
    .card-template-wrap { margin: 0; padding: 10px; width: 100%; }
    .e-card-header-title { font-weight: 600; margin-bottom: 5px; color: #333; }
    .e-card-content { display: block; margin-bottom: 5px; color: #666; word-wrap: break-word; }
    
    /* Horizontal layout for printing cards */
    .e-card-content-horizontal {
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 5px;
        color: #666;
        white-space: nowrap;
    }
    
    .detail-header { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #333; }
    
    /* Print Button */
    .print-btn {
        background-color: #007bff; color: white; border: none; padding: 6px 12px;
        border-radius: 4px; cursor: pointer; font-size: 13px; float: right;
        margin-bottom: 10px; z-index: 10;
    }
    .print-btn:hover { background-color: #0056b3; }
    
    /* Card Image */
    .card-thumb { width: 100%; height: 100px; object-fit: cover; border-bottom: 1px solid #eee; margin-bottom: 5px; border-radius: 2px; }

    /* RGB Color Swatch Style */
    .rgb-swatch {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-right: 8px;
        vertical-align: middle;
        background-color: #eee; /* Default fallback */
    }

    /* RESPONSIVE TWEAKS */
    @media (max-width: 768px) {
        .control-pane { padding: 5px; }
        .image img { width: 40px; height: 40px; }
        
        /* Make Grid text wrap */
        .e-grid .e-rowcell { white-space: normal; line-height: 1.2; }
        
        /* Adjust Cards */
        .card-template { font-size: 11px; }
        .card-thumb { height: 80px; }
        
        .e-card-content-horizontal {
            display: block;
            margin-right: 0;
        }
    }

    /* Kanban Horizontal Scroll for Mobile */
    .kanban-scroll-container {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        min-height: 400px;
    }
`;

// --- SUB-COMPONENT: CHILD CONTENT (ALL FEATURES) ---
const ChildDetailContent = (props: any) => {
    
    // 1. Refs for Kanbans
    const kanbanFabricRef = useRef<any>(null);
    const kanbanPrintingRef = useRef<any>(null);

    // 2. Extract Data
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

    // --- CARD TEMPLATES ---

    // Helper to get image URL to avoid repetition
    const getImageUrl = (path: string) => {
        return (path && path.startsWith('http')) ? path : null;
    };

    // Template for FABRIC cards
    const fabricCardTemplate = (cardProps: any) => {
        const imgUrl = getImageUrl(cardProps.mainimagepath);

        return (
            <div className="card-template">
                {imgUrl && <img src={imgUrl} className="card-thumb" alt="Fabric Item" />}
                <div className="e-card-header" style={{padding: imgUrl ? '0 10px' : '10px'}}>
                    <div className="e-card-header-caption">
                        <div className="e-card-header-title e-tooltip-text">
                            {cardProps.jobno || cardProps.jobno}
                        </div>
                    </div>
                </div>
                <div className="card-template-wrap" style={{padding: '0 10px 10px 10px'}}>
                    <div className="e-card-content">
                        <b>Process:</b> {cardProps.process_des || '-'}
                    </div>
                    <div className="e-card-content">
                        <b>color:</b> {cardProps.topbottom_des || '-'}
                    </div>
                    <div className="e-card-content">
                        <b>Fabrictype:</b> {cardProps.m || '-'}
                    </div>
                    <div className="e-card-content">
                        <b>Fabric:</b> {cardProps.prodqty || '-'}
                    </div>
                </div>
            </div>
        );
    };

    // Template for PRINTING cards (Horizontal Layout with RGB)
    const printingCardTemplate = (cardProps: any) => {
        const imgUrl = getImageUrl(cardProps.mainimagepath);
        const rgbColor = cardProps.rgb || '#cccccc'; // Default fallback color

        return (
            <div className="card-template">
                {imgUrl && <img src={imgUrl} className="card-thumb" alt="Printing Item" />}
                <div className="e-card-header" style={{padding: imgUrl ? '0 10px' : '10px'}}>
                    <div className="e-card-header-caption">
                        <div className="e-card-header-title e-tooltip-text">
                            {cardProps.jobno || cardProps.jobno}
                        </div>
                    </div>
                </div>
                <div className="card-template-wrap" style={{padding: '0 10px 10px 10px', display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                    <div className="e-card-content-horizontal">
                        <b>topbottom:</b> {cardProps.top_bottom || '-'}
                    </div>
                    <div className="e-card-content-horizontal">
                        <b>individual_part:</b> {cardProps.individual_part_print_emb || '-'}
                    </div>
                    <div className="e-card-content-horizontal">
                        <b>prnclr:</b> {cardProps.topbottom_des || '-'}
                    </div>
                    <div className="e-card-content-horizontal">
                        <b>screen_1:</b> {cardProps.print_screen_1 || '-'}
                    </div>
                    <div className="e-card-content-horizontal">
                        <b>screen_2:</b> {cardProps.print_screen_2 || '-'}
                    </div>
                    <div className="e-card-content-horizontal">
                        <b>screen_3:</b> {cardProps.print_screen_3 || '-'}
                    </div>
                    <div className="e-card-content-horizontal">
                        <b>colours:</b> {cardProps.print_colours || '-'}
                    </div>
                    <div className="e-card-content-horizontal">
                        <b>inside_outside:</b> {cardProps.inside_outside_print_emb || '-'}
                    </div>
                    <div className="e-card-content-horizontal">
                        <b>prnimg:</b> {cardProps.prnfile1 || '-'}
                    </div>
                    <div className="e-card-content-horizontal" style={{display: 'flex', alignItems: 'center'}}>
                        <b>rgb:</b> 
                        <span 
                            className="rgb-swatch" 
                            style={{ backgroundColor: rgbColor, marginLeft: '5px' }}
                            title={rgbColor}
                        ></span>
                        <span>{rgbColor}</span>
                    </div>
                    <div className="e-card-content-horizontal">
                        <b>Type:</b> {cardProps.print_type || '-'}
                    </div>
                    <div className="e-card-content-horizontal">
                        <b>description:</b> {cardProps.print_description || '-'}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <p style={{ textAlign: "center", paddingTop: "3px", fontSize: "17px", color: "#333", margin: 0 }}>
                <b>Order: {props.id}</b>
            </p>
            
            <TabComponent animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}>
                <TabItemsDirective>
                    
                    {/* TAB 1: FABRIC TASKBOARD */}
                    <TabItemDirective header={{ text: "Fabric Taskboard" }} content={() => (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ overflow: 'hidden', flexShrink: 0 }}>
                                <button className="print-btn" onClick={handlePrintFabric}>Print Fabric</button>
                            </div>

                            {fabricData.length === 0 ? (
                                <div style={{textAlign:'center', padding:'20px'}}>No Fabric Data</div>
                            ) : (
                                <div className="kanban-scroll-container">
                                    <KanbanComponent 
                                        ref={kanbanFabricRef}
                                        id={`kanban_fabric_${props.id}`} 
                                        keyField="process_des" 
                                        dataSource={fabricData} 
                                        cardSettings={{ template: fabricCardTemplate, headerField: 'topbottom_des' }}
                                    >
                                        <KanbanColumns>
                                            <KanbanColumn headerText="G.T.Process" keyField="G.T.Process" />
                                            <KanbanColumn headerText="Maham Tex" keyField="Maham Tex" />
                                            <KanbanColumn headerText="Texcorp Industries" keyField="Texcorp Industries" />
                                            <KanbanColumn headerText="Eveready Cotton Mills" keyField="Eveready Cotton Mills Pvt Limited" />
                                            <KanbanColumn headerText="Sri Ram Knits" keyField="Sri Ram Knits" />
                                            <KanbanColumn headerText="Others" keyField="Others" />
                                        </KanbanColumns>
                                    </KanbanComponent>
                                </div>
                            )}
                        </div>
                    )} />

                    {/* TAB 2: PRINTING TASKBOARD - Only "Not Pending" Column */}
                    <TabItemDirective header={{ text: "Printing Taskboard" }} content={() => (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ overflow: 'hidden', flexShrink: 0 }}>
                                <button className="print-btn" onClick={handlePrintPrinting}>Print Details</button>
                            </div>

                            {printingData.length === 0 ? (
                                <div style={{textAlign:'center', padding:'20px'}}>No Printing Data</div>
                            ) : (
                                <div className="kanban-scroll-container">
                                    <KanbanComponent 
                                        ref={kanbanPrintingRef}
                                        id={`kanban_printing_${props.id}`} 
                                        keyField="m" 
                                        dataSource={printingData} 
                                        cardSettings={{ template: printingCardTemplate, headerField: 'topbottom_des' }}
                                    >
                                        <KanbanColumns>
                                            <KanbanColumn headerText="Not Pending" keyField="not pending" />
                                        </KanbanColumns>
                                    </KanbanComponent>
                                </div>
                            )}
                        </div>
                    )} />

                    {/* TAB 3: CHART */}
                    <TabItemDirective header={{ text: "Analysis Chart" }} content={() => (
                        <div style={{ height: '100%', overflow: 'hidden' }}>
                            <ChartComponent 
                                id={`chart_${props.id}`}
                                height="100%" 
                                width="100%"
                                tooltip={{ enable: true }} 
                                primaryXAxis={{ valueType: 'Category', title: 'Fabric Description', labelIntersectAction: 'Rotate45' }} 
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

                    {/* TAB 4: BALA (Uses printing template with RGB) */}
                    <TabItemDirective header={{ text: "Bala" }} content={() => (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div className="kanban-scroll-container">
                                <KanbanComponent 
                                    id={`kanban_bala_${props.id}`} 
                                    keyField="m" 
                                    dataSource={printingData.length > 0 ? printingData : fabricData} 
                                    cardSettings={{ template: printingCardTemplate, headerField: 'topbottom_des' }}
                                >
                                    <KanbanColumns>
                                        <KanbanColumn headerText="Dyed" keyField="Dyed" />
                                        <KanbanColumn headerText="Printed" keyField="Printed" />
                                        <KanbanColumn headerText="Cora" keyField="Cora" />
                                        <KanbanColumn headerText="Others" keyField="Others" />
                                    </KanbanColumns>
                                </KanbanComponent>
                            </div>
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
        return (<a href={`#`} style={{color: '#007bff', wordBreak:'break-all'}}>{props.dept}</a>);
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
                    height="100%" 
                    width='100%' 
                    detailTemplate={(args) => <ChildDetailContent {...args} />}
                    allowSorting={true} 
                    allowFiltering={true} 
                    allowPaging={true}
                    allowTextWrap={true} 
                    allowResizing={true}  
                    filterSettings={{ type: 'CheckBox' }}
                >
                    <ColumnsDirective>
                        <ColumnDirective
                            headerText="Top / Bottom"
                            width="150"
                            template={(props) => props.Fabric?.[0]?.topbottom_des || props.Printing?.[0]?.top_bottom || ""}
                        />
                        <ColumnDirective headerText='Image' width='100' template={employeeTemplate} textAlign='Center' allowResizing={false} />
                        <ColumnDirective field="id" headerText='Order ID' isPrimaryKey={true} width='120' allowResizing={true}/>
                        <ColumnDirective field="name" headerText='Name' width='150' allowResizing={true} />
                        <ColumnDirective field="dept" headerText='Department' width='150' template={linkTemplate} allowResizing={true}/>
                        <ColumnDirective field="dt" headerText='Date' width='120' allowResizing={true} />
                        <ColumnDirective field="sv" headerText='Unit' width='100' allowResizing={true} visible={true} />
                        <ColumnDirective field="mins" headerText='Type' width='100' allowResizing={true} visible={true} />
                        <ColumnDirective field="pers" headerText='Description' width='300' visible={false} allowResizing={true} /> 
                    </ColumnsDirective>
                    <Inject services={[DetailRow, Sort, Filter, Page]} />
                </GridComponent>
            </div>
        </div>
    )
}

export default DetailTemplate;