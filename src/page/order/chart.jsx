import React, { useRef } from 'react';
// Import required components including DayMarkers for the weekend effect
import { 
  GanttComponent, 
  ColumnsDirective, 
  ColumnDirective, 
  DayMarkers,
  Inject 
} from '@syncfusion/ej2-react-gantt';
import '@syncfusion/ej2/material.css';
const GanttChartDefaultFunctionalities = () => {
  const ganttInstance = useRef(null);

  // Data exactly matching your requirements
  const taskData = [
      { TaskId: 1, TaskName: "Product concept", StartDate: new Date(2021, 3, 2), EndDate: new Date(2021, 3, 8), Duration: "5days" },
      { TaskId: 2, TaskName: "Define the product usage", StartDate: new Date(2021, 3, 2), EndDate: new Date(2021, 3, 8), Duration: "3", Progress: 30, ParentId: 1, BaselineStartDate: new Date(2021, 3, 2), BaselineEndDate: new Date(2021, 3, 2) },
      { TaskId: 3, TaskName: "Define the target audience", StartDate: new Date(2021, 3, 2), EndDate: new Date(2021, 3, 4), Progress: 40, Duration: "2Days", ParentId: 1 },
      { TaskId: 4, TaskName: "Prepare product sketch and notes", StartDate: new Date(2021, 3, 5), Duration: "4", Progress: 30, ParentId: 1, Predecessor: "2" },
      { TaskId: 5, TaskName: "Concept approval", StartDate: new Date(2021, 3, 8), EndDate: new Date(2021, 3, 8), Duration: "0", ParentId: 1, Predecessor: "3,4" },
      { TaskId: 6, TaskName: "Market research", StartDate: new Date(2021, 3, 9), EndDate: new Date(2021, 3, 18), BaselineStartDate: new Date(2021, 3, 9), BaselineEndDate: new Date(2021, 3, 9), Duration: "4", Progress: 30 },
      { TaskId: 7, TaskName: "Demand analysis", Duration: "4", Progress: 40, ParentId: 6 },
      { TaskId: 8, TaskName: "Customer strength", StartDate: new Date(2021, 3, 9), EndDate: new Date(2021, 3, 12), Duration: "4", Progress: 30, ParentId: 7, Predecessor: "5", BaselineStartDate: new Date(2021, 3, 12), BaselineEndDate: new Date(2021, 3, 13) },
      { TaskId: 9, TaskName: "Market opportunity analysis", StartDate: new Date(2021, 3, 9), EndDate: new Date(2021, 3, 12), Duration: "4", ParentId: 7, Predecessor: "5" },
      { TaskId: 10, TaskName: "Competitor analysis", StartDate: new Date(2021, 3, 15), EndDate: new Date(2021, 3, 18), Duration: "4", Progress: 30, ParentId: 6, Predecessor: "7,8" },
      { TaskId: 11, TaskName: "Product strength analysis", StartDate: new Date(2021, 3, 15), EndDate: new Date(2021, 3, 18), Duration: "4", Progress: 40, ParentId: 6, Predecessor: "9" },
      { TaskId: 12, TaskName: "Research completed", StartDate: new Date(2021, 3, 18), EndDate: new Date(2021, 3, 18), Duration: "0", Progress: 30, ParentId: 6, Predecessor: "10" },
      { TaskId: 13, TaskName: "Product design and development", StartDate: new Date(2021, 3, 19), EndDate: new Date(2021, 4, 16), Duration: "20" },
      { TaskId: 14, TaskName: "Functionality design", StartDate: new Date(2021, 3, 19), EndDate: new Date(2021, 3, 23), Duration: "4", Progress: 30, ParentId: 13, Predecessor: "12" },
      { TaskId: 15, TaskName: "Quality design", StartDate: new Date(2021, 3, 19), EndDate: new Date(2021, 3, 23), Duration: "3", Progress: 40, ParentId: 13, Predecessor: "12" },
      { TaskId: 16, TaskName: "Define reliability", StartDate: new Date(2021, 3, 24), EndDate: new Date(2021, 3, 25), Duration: "4", Progress: 30, ParentId: 13, Predecessor: "15" },
      { TaskId: 17, TaskName: "Identifying raw materials", StartDate: new Date(2021, 3, 24), EndDate: new Date(2021, 3, 25), Duration: "2", ParentId: 13, Predecessor: "15" },
      { TaskId: 18, TaskName: "Define cost plan", StartDate: new Date(2021, 3, 26), EndDate: new Date(2021, 3, 29), Duration: "2", Progress: 30, ParentId: 13, Predecessor: "17" },
      { TaskId: 19, TaskName: "Estimate manufacturing cost", StartDate: new Date(2021, 3, 26), EndDate: new Date(2021, 3, 29), Duration: "3", Progress: 40, ParentId: 18, Predecessor: "17" },
      { TaskId: 20, TaskName: "Estimate selling cost", StartDate: new Date(2021, 3, 26), EndDate: new Date(2021, 3, 29), Duration: "3", Progress: 30, ParentId: 18, Predecessor: "17" },
      { TaskId: 21, TaskName: "Development of final design", StartDate: new Date(2021, 3, 30), EndDate: new Date(2021, 4, 8), Duration: "7", ParentId: 13 },
      { TaskId: 22, TaskName: "Develop dimensions and design", StartDate: new Date(2021, 3, 30), EndDate: new Date(2021, 4, 1), Duration: "4", Progress: 30, ParentId: 21, Predecessor: "19,20" },
      { TaskId: 23, TaskName: "Develop designs to meet industry", StartDate: new Date(2021, 4, 2), EndDate: new Date(2021, 4, 3), Duration: "3", Progress: 40, ParentId: 21, Predecessor: "22" },
      { TaskId: 24, TaskName: "Include all the details", StartDate: new Date(2021, 4, 6), EndDate: new Date(2021, 4, 8), Duration: "4", Progress: 30, ParentId: 21, Predecessor: "23" },
      { TaskId: 25, TaskName: "CAD - Computer Aided Design", StartDate: new Date(2021, 4, 9), EndDate: new Date(2021, 4, 13), Duration: "3", Predecessor: "24" },
      { TaskId: 26, TaskName: "CAM - Computer Aided Manufacturing", StartDate: new Date(2021, 4, 14), EndDate: new Date(2021, 4, 16), Duration: "4", Progress: 30, Predecessor: "25" },
      { TaskId: 27, TaskName: "Finalize the design", StartDate: new Date(2021, 3, 16), EndDate: new Date(2021, 3, 16), Duration: "0", Progress: 40, Predecessor: "26" },
      { TaskId: 28, TaskName: "Prototype testing", StartDate: new Date(2021, 4, 17), EndDate: new Date(2021, 4, 22), Duration: "4", Progress: 30, Predecessor: "27" },
      { TaskId: 29, TaskName: "Include feedback", StartDate: new Date(2021, 4, 17), EndDate: new Date(2021, 4, 22), Duration: "4", Predecessor: "28ss" },
      { TaskId: 30, TaskName: "Manufacturing", StartDate: new Date(2021, 4, 23), EndDate: new Date(2021, 4, 29), Duration: "5", Progress: 30, Predecessor: "28,29" },
      { TaskId: 31, TaskName: "Assembling material into finished goods", StartDate: new Date(2021, 4, 30), EndDate: new Date(2021, 5, 5), Duration: "5", Progress: 40, Predecessor: "30" },
      { TaskId: 32, TaskName: "Final product development", StartDate: new Date(2021, 5, 6), EndDate: new Date(2021, 5, 13), Duration: "6", Progress: 30 },
      { TaskId: 33, TaskName: "Important improvement", StartDate: new Date(2021, 5, 6), EndDate: new Date(2021, 5, 10), Duration: "3", ParentId: 32, Predecessor: "31" },
      { TaskId: 34, TaskName: "Customer testing and feedback", StartDate: new Date(2021, 5, 11), EndDate: new Date(2021, 5, 13), Duration: "4", Progress: 30, ParentId: 32, Predecessor: "33" },
      { TaskId: 35, TaskName: "Final product development", StartDate: new Date(2021, 5, 14), EndDate: new Date(2021, 5, 19), Duration: "4", Progress: 40 },
      { TaskId: 36, TaskName: "Important improvement", StartDate: new Date(2021, 5, 14), EndDate: new Date(2021, 5, 19), Duration: "4", Progress: 30, ParentId: 35, Predecessor: "34" },
      { TaskId: 37, TaskName: "Address any unforeseen issues", StartDate: new Date(2021, 5, 14), EndDate: new Date(2021, 5, 19), Duration: "4", Progress: 30, Predecessor: "36ss", ParentId: 35 },
      { TaskId: 38, TaskName: "Finalize the product ", StartDate: new Date(2021, 5, 20), EndDate: new Date(2021, 6, 1), Duration: "8", Progress: 40 },
      { TaskId: 39, TaskName: "Branding the product", StartDate: new Date(2021, 5, 20), EndDate: new Date(2021, 5, 25), Duration: "4", Progress: 30, ParentId: 38, Predecessor: "37" },
      { TaskId: 40, TaskName: "Marketing and presales", StartDate: new Date(2021, 5, 26), EndDate: new Date(2021, 6, 1), ParentId: 38, Duration: "4", Predecessor: "39" }
  ];

  const taskFields = {
      id: 'TaskId',
      name: 'TaskName',
      startDate: 'StartDate',
      endDate: 'EndDate',
      duration: 'Duration',
      progress: 'Progress',
      dependency: 'Predecessor',
      parentID: 'ParentId'
  };

  const labelSettings = {
      leftLabel: 'TaskName'
  };

  const splitterSettings = {
      position: '30%'
  };

  // Template: Child Taskbar (Matches Image 2 & 3 visual of Progress Bar + Percentage)
  const taskbarTemplate = (props) => {
      return (
          <div className="e-gantt-child-taskbar-inner-div e-gantt-child-taskbar" tabIndex="-1" style={{ width: '100%' }}>
              <div className="e-gantt-child-progressbar-inner-div e-gantt-child-progressbar" style={{ height: '100%', width: props.Progress + '%', borderRadius: 0 }}>
                  <span className="e-task-label">
                      {props.Progress + "%"}
                  </span>
              </div>
          </div>
      );
  };

  // Template: Parent Taskbar
  const parentTaskbarTemplate = (props) => {
      return (
          <div className="e-gantt-parent-taskbar-inner-div e-gantt-parent-taskbar" style={{ textOverflow: 'ellipsis', width: '100%' }} tabIndex="-1">
              <div className="e-gantt-parent-progressbar-inner-div e-row-expand e-gantt-parent-progressbar" style={{ height: '100%', textOverflow: 'ellipsis', width: props.Progress + '%', borderRadius: 0 }}>
                  <span className="e-task-label">
                      {props.Progress + "%"}
                  </span>
              </div>
          </div>
      );
  };

  return (
      <div className="control-section e-gantt-default-functionalities-sample">
          {/* CRITICAL: CSS for visual matching */}
          <style>{`
              .e-gantt-default-functionalities-sample {
                  padding: 20px;
              }
              /* Taskbar height and styling */
              .e-gantt-default-functionalities-sample .e-gantt-child-taskbar {
                  height: 22px;
                  width: 100%;
              }
              .e-gantt-default-functionalities-sample .e-gantt-parent-taskbar {
                  height: 22px;
                  width: 100%;
              }
              /* Label styling (e.g., "32%") */
              .e-gantt-default-functionalities-sample .e-task-label {
                  position: absolute;
                  top: 3px;
                  font-size: 12px;
                  text-overflow: ellipsis;
                  height: 100%;
                  overflow: hidden;
              }
              /* Responsive/Bigger screen adjustments */
              .e-bigger .e-gantt-default-functionalities-sample .e-gantt-child-taskbar {
                  height: 32px;
                  width: 100%;
              }
              .e-bigger .e-gantt-default-functionalities-sample .e-gantt-parent-taskbar {
                  height: 32px;
                  width: 100%;
              }
              .e-bigger .e-gantt-default-functionalities-sample .e-task-label {
                  position: absolute;
                  top: 6px;
                  font-size: 12px;
                  text-overflow: ellipsis;
                  height: 100%;
                  overflow: hidden;
              }
              .e-gantt-defaultfunctionalities-reference-link {
                  text-decoration: none !important;
              }
              .e-gantt-defaultfunctionalities-reference-link:hover,
              .e-gantt-defaultfunctionalities-reference-link:focus {
                  text-decoration: underline !important;
              }
          `}</style>
          
          <GanttComponent
              ref={ganttInstance}
              dataSource={taskData}
              height="450px"
              width="100%"
              highlightWeekends={true} // Enables the gray weekend strips seen in the image
              treeColumnIndex={1}       // Shows the expand/collapse icons in column 1 (Name)
              projectStartDate={new Date(2021, 2, 24)}
              projectEndDate={new Date(2021, 6, 25)}
              scrollToTaskbarOnClick={true}
              taskFields={taskFields}
              labelSettings={labelSettings}
              splitterSettings={splitterSettings}
              taskbarTemplate={taskbarTemplate}
              parentTaskbarTemplate={parentTaskbarTemplate}
          >
              <ColumnsDirective>
                  <ColumnDirective field="TaskId" width="60"></ColumnDirective>
                  <ColumnDirective field="TaskName" width="250"></ColumnDirective>
                  <ColumnDirective field="StartDate"></ColumnDirective>
                  <ColumnDirective field="EndDate"></ColumnDirective>
                  <ColumnDirective field="Duration"></ColumnDirective>
                  <ColumnDirective field="Progress"></ColumnDirective>
                  <ColumnDirective field="Predecessor"></ColumnDirective>
              </ColumnsDirective>
              {/* DayMarkers is required for the specific visual output in your images */}
              <Inject services={[DayMarkers]} />
          </GanttComponent>
      </div>
  );
};

export default GanttChartDefaultFunctionalities;