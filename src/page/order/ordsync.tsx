
import * as React from "react";
import { useEffect, useState, useRef } from "react";
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

import "../../styles/assistive-grid.css";

interface OrderRow {
  jobno_oms: string;
  styleid: number | string;
  company_name: string;
  pono: string;
  reference: string;
  mainimagepath: string;
  shipmentcompleted: boolean;
  podate?: Date | null;
  final_delivery_date?: Date | null;
  ourdeldate?: Date | null;
  vessel_dt?: Date | null;
  ddays?: number;
  fdays?: number;
  insdays?: number;
  hasImage?: boolean;
  validationStatus?: "OK" | "Pending";
  validationNotes?: string;
}

// Fallback data if API fails
const sampleDataRaw = [
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
    shipmentcompleted: false,
    ddays: -450,
    fdays: 25433,
    insdays: 0
  }
];

const toDate = (v: any): Date | null => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const toNumber = (v: any): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const normalizeRows = (rows: any[]): OrderRow[] =>
  rows.map((r: any) => {
    const job = r.jobno_oms ?? r.jobno_oms_id ?? "";
    const styleRaw = r.styleid ?? r.style_id ?? "";
    const styleNum = toNumber(styleRaw);
    const company = r.company_name ?? r.company ?? "";
    const po = r.pono ?? r.poNo ?? "";
    const ref = r.reference ?? r.ref ?? "";
    const img = r.mainimagepath ?? r.image ?? "/placeholder.png";

    const statusBool =
      typeof r.shipmentcompleted === "boolean"
        ? r.shipmentcompleted
        : String(r.status ?? "").toLowerCase() === "completed";

    const errors: string[] = [];
    if (!job) errors.push("Job No missing");
    if (!company) errors.push("Company missing");
    if (styleNum === null) errors.push("Style ID invalid");

    const isValid = errors.length === 0;

    return {
      jobno_oms: job,
      styleid: styleNum ?? styleRaw,
      company_name: company,
      pono: po,
      reference: ref,
      mainimagepath: img,
      shipmentcompleted: statusBool,
      podate: toDate(r.podate),
      final_delivery_date: toDate(r.final_delivery_date),
      ourdeldate: toDate(r.ourdeldate),
      vessel_dt: toDate(r.vessel_dt),
      ddays: toNumber(r.ddays) ?? undefined,
      fdays: toNumber(r.fdays) ?? undefined,
      insdays: toNumber(r.insdays) ?? undefined,
      hasImage: !!img && img !== "/placeholder.png",
      validationStatus: isValid ? "OK" : "Pending",
      validationNotes: errors.join(", ")
    };
  });

function Ordsync() {
  const navigate = useNavigate();
  const [gridData, setGridData] = useState<OrderRow[]>([]);
  const [apiAvailable, setApiAvailable] = useState(true);

  // Row count states
  const [rowCount, setRowCount] = useState(0);   // current view count (after filter/search/group/page)
  const [totalCount, setTotalCount] = useState(0); // total records bound to grid

  const gridRef = useRef<GridComponent>(null);
  const dialogRef = useRef<DialogComponent>(null);
  const assistRef = useRef<AIAssistViewComponent>(null);

  const updateRowCounts = () => {
  const g = gridRef.current as any;
  if (!g) return;

  const currentView =
    typeof g.getCurrentViewRecords === "function"
      ? g.getCurrentViewRecords()
      : g.currentViewData || [];

  const filtered =
    typeof g.getFilteredRecords === "function"
      ? g.getFilteredRecords()
      : currentView;

  const ds = g.dataSource || gridData;
  const total = Array.isArray(ds) ? ds.length : 0;

  setRowCount(filtered.length);
  setTotalCount(total);
 };


  const fetchData = () => {
    new DataManager({
      url: "https://app.herofashion.com/order_panda/",
      adaptor: new WebApiAdaptor()
    })
      .executeQuery(new Query())
      .then((e: any) => {
        const incoming = Array.isArray(e.result) ? e.result : sampleDataRaw;
        const normalized = normalizeRows(incoming);
        setGridData(normalized);
        setApiAvailable(Array.isArray(e.result));

        // Ensure immediate render (fix for "shows only after sort")
        if (gridRef.current) {
          gridRef.current.dataSource = normalized;
          gridRef.current.refresh();
        }
        // Update counts after data bind
        updateRowCounts();
      })
      .catch(() => {
        const normalized = normalizeRows(sampleDataRaw);
        setGridData(normalized);
        setApiAvailable(false);
        if (gridRef.current) {
          gridRef.current.dataSource = normalized;
          gridRef.current.refresh();
        }
        updateRowCounts();
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Keep counts in sync when gridData changes
  useEffect(() => {
    updateRowCounts();
  }, [gridData]);

  const handleTopNavigate = () => navigate("/details");

  const imageTemplate = (props: OrderRow) => (
    <img
      src={props.mainimagepath}
      width={50}
      height={50}
      onError={(e: any) => (e.target.src = "/placeholder.png")}
      alt=""
    />
  );

  const statusTemplate = (props: OrderRow) => (
    <span
      className={`e-badge ${
        props.shipmentcompleted ? "e-badge-success" : "e-badge-danger"
      }`}
    >
      {props.shipmentcompleted ? "Completed" : "Pending"}
    </span>
  );

  // Row count badge shown on right side of toolbar
  const RowCountBadge = () => (
    <div
      className="row-count-badge"
      aria-label={`Rows: ${rowCount} of ${totalCount}`}
      title={`Rows: ${rowCount} / ${totalCount}`}
    >
      Rows:&nbsp;<span className="row-count-number">{rowCount}</span>
      <span className="row-count-sep"> / </span>
      <span className="row-count-total">{totalCount}</span>
    </div>
  );

  const toolbarOptions: any[] = [
    "Search",
    {
      text: "AI Assist",
      id: "ai-assist-btn",
      prefixIcon: "e-assistview-icon",
      align: "Right"
    },
    {
      id: "row-count",
      align: "Right",
      template: RowCountBadge
    }
  ];

  const toolbarClick = (args: ClickEventArgs) => {
    if ((args as any).item?.id === "ai-assist-btn") {
      dialogRef.current?.show();
    }
  };

  const toolbarSettings: ToolbarSettingsModel = {
    items: [
      { iconCss: "e-icons e-rename", tooltip: "New Chat" },
      { iconCss: "e-icons e-refresh", tooltip: "Clear" },
      { iconCss: "e-icons e-icon-dlg-close", tooltip: "Close" }
    ],
    itemClicked: (args) => {
      const css = args.item.iconCss ?? "";
      if (css.includes("close")) dialogRef.current?.hide();
      if (css.includes("rename") && assistRef.current) assistRef.current.prompts = [];
      if (css.includes("refresh")) {
        assistRef.current && (assistRef.current.prompts = []);
        gridRef.current?.clearSorting();
        gridRef.current?.clearFiltering();
        gridRef.current?.clearGrouping();
        // Update counts after clearing operations
        setTimeout(updateRowCounts, 0);
      }
    }
  };

  const onPromptRequest = async (args: PromptRequestEventArgs) => {
    const columns =
      gridRef.current?.columns?.map((c: any) => ({
        field: c.field,
        headerText: c.headerText
      })) ?? [];
    // If you have AI:
    // await fetchAI(args.prompt, gridRef.current!, dialogRef.current!, assistRef.current!, columns);
    assistRef.current?.addPrompt({
      role: "assistant",
      content: "AI: Data bound & normalized. Try sorting Job No/Style ID/Data Quality."
    });
  };

  const filterSettings: FilterSettingsModel = { type: "Excel" };

  // Keep row counts in sync with grid lifecycle/actions
  const onDataBound = () => updateRowCounts();
  const onActionComplete = () => updateRowCounts();

  return (
    <div id="assistive-grid" style={{ padding: "12px" }}>
      {/* Top button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button className="e-btn e-primary" onClick={handleTopNavigate}>
          Go to Details
        </button>
      </div>

      {!apiAvailable && (
        <div className="api-banner">
          API unreachable — using local data
          <button className="api-retry" onClick={fetchData}>Retry</button>
        </div>
      )}

      {/* AI Dialog */}
      <DialogComponent ref={dialogRef} width="500px" height="500px" visible={false}>
        <AIAssistViewComponent
          ref={assistRef}
          toolbarSettings={toolbarSettings}
          promptRequest={onPromptRequest}
        >
          <ViewsDirective>
            <ViewDirective type="Assist" name="Ask AI" />
          </ViewsDirective>
        </AIAssistViewComponent>
      </DialogComponent>

      {/* Grid */}
      <GridComponent
        ref={gridRef}
        dataSource={gridData}
        height={650}
        allowPaging={true}
        allowFiltering={true}
        allowSorting={true}
        allowGrouping={true}
        filterSettings={filterSettings}
        toolbar={toolbarOptions}
        toolbarClick={toolbarClick}
        dataBound={onDataBound}
        actionComplete={onActionComplete}
        noRecordsTemplate={
          <div style={{ padding: 24, textAlign: "center", color: "#888" }}>
            No records found. Try Retry or check your file / column mapping.
          </div>
        }
      >
        <ColumnsDirective>
          <ColumnDirective field="jobno_oms" headerText="Job No11" width="150" />
          <ColumnDirective headerText="Image" template={imageTemplate} width="100" />
          <ColumnDirective field="styleid" headerText="Style ID Local" width="140" type="number" />
          <ColumnDirective field="company_name" headerText="Company" width="200" />
          <ColumnDirective field="pono" headerText="PO No" width="120" />
          <ColumnDirective field="reference" headerText="Reference" width="250" />

          {/* Data quality helpers */}
          <ColumnDirective field="validationStatus" headerText="Data Quality" width="130" />
          <ColumnDirective field="validationNotes" headerText="Issues" width="250" />

          {/* Optional dates */}
          <ColumnDirective field="podate" headerText="PO Date" width="140" type="date" format="yMd" />
          <ColumnDirective
            field="final_delivery_date"
            headerText="Final Delivery"
            width="150"
            type="date"
            format="yMd"
          />

          {/* Image (mainimagepath) */}
          <ColumnDirective headerText="Image" template={imageTemplate} width="100" />

          {/* Status */}
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
