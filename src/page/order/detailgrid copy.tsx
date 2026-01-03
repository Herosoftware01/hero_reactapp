import React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, DetailRow, Inject, Sort, Filter, Grid } from '@syncfusion/ej2-react-grids';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Category, ChartComponent, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective, Tooltip } from '@syncfusion/ej2-react-charts';
import { KanbanComponent, ColumnsDirective as KanbanColumns, ColumnDirective as KanbanColumn } from '@syncfusion/ej2-react-kanban';

// --- MOCK DATA (Embedded) ---
const fab_print = https://app.herofashion.com/grid_api1ord/
const employeeDetail = [
    {
        EmployeeID: "Emp1001",
        Name: "Alice Smith",
        MailID: "alice@example.com",
        SoftwareTeam: "Frontend",
        ReportTo: "John Doe"
    },
    {
        EmployeeID: "Emp1002",
        Name: "Bob Jones",
        MailID: "bob@example.com",
        SoftwareTeam: "Backend",
        ReportTo: "Jane Smith"
    },
    {
        EmployeeID: "Emp1003",
        Name: "Charlie Brown",
        MailID: "charlie@example.com",
        SoftwareTeam: "QA",
        ReportTo: "John Doe"
    }
];

const taskDetail = [
    // Tasks for Alice Smith
    { Id: "T1", Assignee: "Alice Smith", Status: "Open", Summary: "Design Home Page", Estimate: 5, Spent: 1 },
    { Id: "T2", Assignee: "Alice Smith", Status: "InProgress", Summary: "Implement Grid", Estimate: 8, Spent: 4 },
    
    // Tasks for Bob Jones
    { Id: "T3", Assignee: "Bob Jones", Status: "Open", Summary: "API Integration", Estimate: 10, Spent: 0 },
    { Id: "T4", Assignee: "Bob Jones", Status: "Testing", Summary: "Fix Login Bug", Estimate: 4, Spent: 3 },
    { Id: "T5", Assignee: "Bob Jones", Status: "Close", Summary: "Database Setup", Estimate: 6, Spent: 6 },

    // Tasks for Charlie Brown
    { Id: "T6", Assignee: "Charlie Brown", Status: "InProgress", Summary: "Write Test Cases", Estimate: 5, Spent: 2 },
    { Id: "T7", Assignee: "Charlie Brown", Status: "Close", Summary: "Review PRs", Estimate: 2, Spent: 2 },
];

// --- CSS STYLES (Injected) ---
const globalStyles = `
    .image { padding: 5px; text-align: center; }
    .image img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #e0e0e0; }
    .card-template { width: 100%; height: 100%; display: block; padding: 0; background-color: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.13); border-radius: 3px; border: 1px solid #e0e0e0; font-size: 13px; }
    .card-template-wrap { margin: 0; padding: 10px; width: 100%; }
    .e-card-header-title { font-weight: 600; margin-bottom: 5px; color: #333; }
    .e-card-content { display: block; margin-bottom: 5px; color: #666; }
    .control-pane { padding: 20px; }
`;

// --- SUB-COMPONENT: CHILD CONTENT ---
// This component handles the logic for the detail row (Kanban & Chart)
const ChildDetailContent = (props: any) => {
    
    // 1. Filter Tasks for this specific Employee
    const tasks = taskDetail.filter((task) => task.Assignee === props.Name);

    // 2. Prepare Data for Chart
    const generateSalesData = (tasks: any) => {
        const statusCategories = ['Open', 'InProgress', 'Testing', 'Close'];
        const statusData = statusCategories.map((status) => {
            const filteredTasks = tasks.filter((task: any) => task.Status === status);
            const estimatedHours = filteredTasks.reduce((sum: any, task: any) => sum + parseFloat(task.Estimate), 0);
            const spentHours = filteredTasks.reduce((sum: any, task: any) => sum + parseFloat(task.Spent), 0);
            let taskid = '';
            if (filteredTasks.length) { taskid = filteredTasks[0].Id; }
            return { spentHours, estimatedHours, status, taskid };
        });
        return statusData;
    };
    
    const salesData = generateSalesData(tasks);

    // 3. Kanban Card Template
    const cardTemplate = (cardProps: any) => {
        return (
            <div className="card-template">
                <table className="card-template-wrap" style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td className="e-title">
                                <div className="e-card-header">
                                    <div className="e-card-header-caption">
                                        <div className="e-card-header-title e-tooltip-text">
                                            {cardProps.Id}
                                        </div>
                                    </div>
                                </div>
                                <table className="card-template-wrap">
                                    <tbody>
                                        <tr className='e-tooltip-text'>
                                            <td>
                                                <div className="e-card-content">
                                                    {cardProps.Summary}
                                                </div>
                                                <span className="e-card-content"><b>Estimated:</b> {cardProps.Estimate}h</span>
                                                <span className="e-card-content" style={{display:'block', marginTop:'2px'}}><b>Spent:</b> {cardProps.Spent}h</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table >
            </div >
        );
    };

    // 4. Render Function
    return (
        <div>
            <p style={{ textAlign: "center", paddingTop: "3px", fontSize: "17px" }}><b>Sprint</b></p>
            <TabComponent animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}>
                <TabItemsDirective>
                    <TabItemDirective header={{ text: "Taskboard" }} content={() => (
                        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                            <KanbanComponent 
                                id={`kanban_${props.EmployeeID}`} // Unique ID is critical
                                cssClass="kanban-swimlane-template" 
                                keyField="Status" 
                                dataSource={tasks} 
                                cardSettings={{ template: cardTemplate, headerField: 'Id' }}
                            >
                                <KanbanColumns>
                                    <KanbanColumn headerText="Open" keyField="Open" />
                                    <KanbanColumn headerText="In Progress" keyField="InProgress" />
                                    <KanbanColumn headerText="Testing" keyField="Testing" />
                                    <KanbanColumn headerText="Done" keyField="Close" />
                                </KanbanColumns>
                            </KanbanComponent>
                        </div>
                    )} />

                    
                    <TabItemDirective header={{ text: "Burndown Chart" }} content={() => (
                        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                            {/* <ChartComponent 
                                id={`chart_${props.EmployeeID}`} // Unique ID is critical
                                height="302px" 
                                tooltip={{ enable: true }} 
                                primaryXAxis={{ valueType: 'Category', title: 'Status' }} 
                                title="Burndown Chart"
                            >
                                <Inject services={[Tooltip, LineSeries, Category, Legend]} />
                                <SeriesCollectionDirective>
                                    <SeriesDirective dataSource={salesData} xName="taskid" yName="estimatedHours" name="Estimated Hours" marker={{ visible: true, width: 10, height: 10 }} type='Line'/>
                                    <SeriesDirective dataSource={salesData} xName="taskid" yName="spentHours" name="Spent Hours" marker={{ visible: true, width: 10, height: 10 }} type='Line'/>
                                </SeriesCollectionDirective>
                            </ChartComponent> */}
                              <KanbanComponent 
                                id={`kanban_${props.EmployeeID}`} // Unique ID is critical
                                cssClass="kanban-swimlane-template" 
                                keyField="Status" 
                                dataSource={tasks} 
                                cardSettings={{ template: cardTemplate, headerField: 'Id' }}
                            >
                                <KanbanColumns>
                                    <KanbanColumn headerText="Open" keyField="Open" />
                                    <KanbanColumn headerText="In Progress" keyField="InProgress" />
                                    {/* <KanbanColumn headerText="Testing" keyField="Testing" />
                                    <KanbanColumn headerText="Done" keyField="Close" /> */}
                                </KanbanColumns>
                            </KanbanComponent>
                        </div>
                    )} />
                    <TabItemDirective header={{ text: "Bala" }} content={() => (
                        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                            <KanbanComponent 
                                id={`kanban_${props.EmployeeID}`} // Unique ID is critical
                                cssClass="kanban-swimlane-template" 
                                keyField="Status" 
                                dataSource={tasks} 
                                cardSettings={{ template: cardTemplate, headerField: 'Id' }}
                            >
                                <KanbanColumns>
                                    <KanbanColumn headerText="Open" keyField="Open" />
                                    <KanbanColumn headerText="In Progress" keyField="InProgress" />
                                    <KanbanColumn headerText="Testing" keyField="Testing" />
                                    <KanbanColumn headerText="Done" keyField="Close" />
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

    const emailTemplate = (props: any) => {
        return (<div><a href={`mailto:${props.MailID}`}>{props.MailID}</a></div>);
    }

    const employeeTemplate = (props: any) => {
        // Using Placeholder images
        const seed = props.EmployeeID.replace("Emp", "");
        var src = `https://picsum.photos/seed/${seed}/100/100`;
        return (<div className='image'><img src={src} alt={props.EmployeeID} /></div>);
    }

    return (
        <div className='control-pane'>
            {/* Injecting styles */}
            <style>{globalStyles}</style>
            
            <div className='control-section'>
                <GridComponent 
                    dataSource={employeeDetail} 
                    height='600' 
                    detailTemplate={(args) => <ChildDetailContent {...args} />}
                    width='auto' 
                    allowSorting={true} 
                    allowFiltering={true} 
                    filterSettings={{ type: 'CheckBox' }}
                >
                    <ColumnsDirective>
                        <ColumnDirective headerText='Image' width='180' template={employeeTemplate} textAlign='Center' />
                        <ColumnDirective field="EmployeeID" headerText='ID' isPrimaryKey={true} width={70}/>
                        <ColumnDirective field="Name" headerText='Name' width={100} />
                        <ColumnDirective field="MailID" headerText='Email' width={150} template={emailTemplate}/>
                        <ColumnDirective field="SoftwareTeam" headerText='Team(s)' width={100} />
                        <ColumnDirective field="ReportTo" headerText='Reporter' width={100} />
                    </ColumnsDirective>
                    <Inject services={[DetailRow, Sort, Filter]} />
                </GridComponent>
            </div>
        </div>
    )
}

export default DetailTemplate;