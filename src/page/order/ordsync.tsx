import * as React from "react";
import { useEffect, useState, createRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Toolbar,
  Sort,
  Filter,
  Group,
  Page,
  Search,
  FilterSettingsModel
} from "@syncfusion/ej2-react-grids";

import { DialogComponent } from "@syncfusion/ej2-react-popups";
import {
  AIAssistViewComponent,
  ToolbarSettingsModel,
  PromptRequestEventArgs,
  ViewsDirective,
  ViewDirective
} from "@syncfusion/ej2-react-interactive-chat";

import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";

import "./assistive-grid.css";
import { fetchAI } from "./AIModel";

let assistView: AIAssistViewComponent;
let dialog: DialogComponent;
let grid: GridComponent;

const suggestionListRef = createRef<HTMLUListElement>();

function Ordsync() {
  const navigate = useNavigate();
  const [gridData, setGridData] = useState<any[]>([]);
  const [apiAvailable, setApiAvailable] = useState(true);

  // ---------------- FALLBACK DATA ----------------
  const sampleData = [
    {
      jobno_oms_id: "H12778A",
      styleid: "9198",
      company_name: "HERO FASHION",
      pono: "6987",
      reference: "APPROVAL PENDING",
      mainimagepath: "/placeholder.png",
      final_delivery_date: "1995-08-15",
      ourdeldate: "2095-08-10",
      podate: "2024-10-03",
      vessel_dt: "2095-08-10",
      printing: "",
      Emb: "",
      shipmentcompleted: false,
      ddays: -450,
      fdays: 25433,
      insdays: 0
    }
  ];

  // ---------------- API FETCH ----------------
  const fetchData = () => {
    new DataManager({
      url: "https://app.herofashion.com/order_panda/",
      adaptor: new WebApiAdaptor()
    })
      .executeQuery(new Query())
      .then((e: any) => {
        if (Array.isArray(e.result)) {
          setGridData(e.result);
          setApiAvailable(true);
        } else {
          setGridData(sampleData);
          setApiAvailable(false);
        }
      })
      .catch(() => {
        setGridData(sampleData);
        setApiAvailable(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- TOP BUTTON ----------------
  const handleTopNavigate = () => {
    navigate("/details");
  };

  // ---------------- GRID TEMPLATES ----------------
  const imageTemplate = (props: any) => (
    <img
      src={props.mainimagepath}
      width={50}
      height={50}
      onError={(e: any) => (e.target.src = "/placeholder.png")}
    />
  );

  const statusTemplate = (props: any) => (
    <span
      className={`e-badge ${
        props.shipmentcompleted ? "e-badge-success" : "e-badge-danger"
      }`}
    >
      {props.shipmentcompleted ? "Completed" : "Pending"}
    </span>
  );

  // ---------------- AI TOOLBAR ----------------
  const toolbarOptions = [
    {
      text: "AI Assist",
      id: "ai-assist-btn",
      prefixIcon: "e-assistview-icon",
      align: "Right"
    }
  ];

  const toolbarClick = (args: ClickEventArgs) => {
    if (args.item.id === "ai-assist-btn") {
      dialog?.show();
    }
  };

  const toolbarSettings: ToolbarSettingsModel = {
    items: [
      { iconCss: "e-icons e-rename", tooltip: "New Chat" },
      { iconCss: "e-icons e-refresh", tooltip: "Clear" },
      { iconCss: "e-icons e-icon-dlg-close", tooltip: "Close" }
    ],
    itemClicked: (args) => {
      if (args.item.iconCss?.includes("close")) dialog.hide();
      if (args.item.iconCss?.includes("rename")) assistView.prompts = [];
      if (args.item.iconCss?.includes("refresh")) {
        assistView.prompts = [];
        grid.setProperties({
          sortSettings: { columns: [] },
          filterSettings: { columns: [] },
          groupSettings: { columns: [] }
        });
        grid.refresh();
      }
    }
  };

  const onPromptRequest = (args: PromptRequestEventArgs) => {
    const columns = grid.columns.map((c: any) => ({ field: c.field }));
    fetchAI(args.prompt, grid, dialog, assistView, columns);
  };

  const filterSettings: FilterSettingsModel = { type: "Excel" };

  // ---------------- UI ----------------
  return (
    <div id="assistive-grid" style={{ padding: "12px" }}>
      
      {/* 🔹 TOP BUTTON (NEW) */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button
          className="e-btn e-primary"
          onClick={handleTopNavigate}
        >
          Go to Details
        </button>
      </div>

      {!apiAvailable && (
        <div className="api-banner">
          API unreachable — using local data
          <button onClick={fetchData}>Retry</button>
        </div>
      )}

      {/* 🔹 AI DIALOG */}
      <DialogComponent
        ref={(d) => (dialog = d)}
        width="500px"
        height="500px"
        visible={false}
      >
        <AIAssistViewComponent
          ref={(a) => (assistView = a)}
          toolbarSettings={toolbarSettings}
          promptRequest={onPromptRequest}
        >
          <ViewsDirective>
            <ViewDirective type="Assist" name="Ask AI" />
          </ViewsDirective>
        </AIAssistViewComponent>
      </DialogComponent>

      {/* 🔹 GRID */}
      <GridComponent
        ref={(g) => (grid = g)}
        dataSource={gridData}
        height={650}
        allowPaging
        allowFiltering
        allowSorting
        allowGrouping
        filterSettings={filterSettings}
        toolbar={toolbarOptions}
        toolbarClick={toolbarClick}
      >
        <ColumnsDirective>
          <ColumnDirective field="jobno_oms" headerText="Job No11" width="150" />
          <ColumnDirective field="styleid" headerText="Style ID Local" width="120" />
          <ColumnDirective field="company_name" headerText="Company" width="200" />
          <ColumnDirective field="pono" headerText="PO No" width="120" />
          <ColumnDirective field="reference" headerText="Reference" width="250" />
          <ColumnDirective headerText="Image" template={imageTemplate} width="100" />
          <ColumnDirective
            field="shipmentcompleted"
            headerText="Status"
            template={statusTemplate}
            width="120"
          />
        </ColumnsDirective>

        <Inject services={[Toolbar, Sort, Filter, Group, Page, Search]} />
      </GridComponent>
    </div>
  );
}

export default Ordsync;
