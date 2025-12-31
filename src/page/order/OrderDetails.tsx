import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { registerLicense } from '@syncfusion/ej2-base';

// Register Syncfusion license for this page
registerLicense('Ngo9BigBOggjHTQxAR8/V1JGaF5cXGpCf0x0Q3xbf1x2ZFBMYVlbQHBPMyBoS35Rc0RhW3hedXVQQ2heWUB2VEFf');
import { GridComponent, ColumnsDirective, ColumnDirective, DetailRow, Inject as GridInject, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Category, ChartComponent, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective, Tooltip, Inject as ChartInject } from '@syncfusion/ej2-react-charts';
import { KanbanComponent, ColumnsDirective as KanbanColumns, ColumnDirective as KanbanColumn } from '@syncfusion/ej2-react-kanban';

// --- Placeholder Data for Detail Template (Kanban and Chart) ---
// In a real application, this data would be fetched based on the parent row's data.
const placeholderTaskDetail = [
    { 'Id': 'Task 1', 'Summary': 'Analyze the new requirements gathered from the customer.', 'Status': 'Open', 'Estimate': 5, 'Spent': 2 },
    { 'Id': 'Task 7', 'Summary': 'Fix the issues reported in Safari browser.', 'Status': 'InProgress', 'Estimate': 2, 'Spent': 3 },
    { 'Id': 'Task 21', 'Summary': 'Bug fixes for existing application', 'Status': 'Close', 'Estimate': 4, 'Spent': 4 },
    { 'Id': 'Task 22', 'Summary': 'Implement new user authentication flow.', 'Status': 'InProgress', 'Estimate': 8, 'Spent': 4 },
];

const placeholderChartData = [
    { status: 'Open', estimatedHours: 5, spentHours: 2 },
    { status: 'InProgress', estimatedHours: 10, spentHours: 7 },
    { status: 'Testing', estimatedHours: 0, spentHours: 0 },
    { status: 'Close', estimatedHours: 4, spentHours: 4 },
];


// --- Main React Component ---
function OrderGridWithDetail() {
    const [orderData, setOrderData] = useState([]);
    // Cached detail data per order (keyed by jobno_oms_id)
    const [detailDataMap, setDetailDataMap] = useState<Record<string, any[]>>({});
    // Loading flags per order while fetching detail tasks
    const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});

    // Known status keys used by Kanban and Chart
    const STATUS_KEYS = ['Open','InProgress','Testing','Close'];

    // Normalize a task object from the API into the shape we need for the Kanban/chart
    const normalizeTask = (t: any) => {
        const rawStatus = (t.Status || t.status || t.state || t.stage || '').toString();
        const s = rawStatus.replace(/\s+/g, '').toLowerCase();
        let Status = 'Open';
        if (s.includes('progress') || s.includes('inprogress')) Status = 'InProgress';
        else if (s.includes('test')) Status = 'Testing';
        else if (s.includes('done') || s.includes('close') || s.includes('completed')) Status = 'Close';
        else if (s.includes('open')) Status = 'Open';

        return {
            Id: t.Id || t.id || t.task_id || t.name || t.title || `${t.jobno_oms_id || ''}-${Math.random().toString(36).slice(2,8)}`,
            Summary: t.Summary || t.summary || t.description || t.desc || t.note || '',
            Status,
            Estimate: Number(t.Estimate ?? t.estimate ?? t.estimatedHours ?? 0),
            Spent: Number(t.Spent ?? t.spentHours ?? t.spent ?? 0),
            // keep raw task for debugging
            __raw: t
        };
    }; 

    // --- Selected task / click handlers ---
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    // Grid ref so we can toggle detail rows with our own button (keeps expand controls reliable)
    const gridRef = useRef<any>(null);

    // Read URL search params to allow linking to a specific order (e.g. /details?job=H12531A)
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const jobToOpen = params.get('job');
        if (!jobToOpen || !orderData || !orderData.length) return;
        // Wait briefly to ensure grid has rendered rows
        setTimeout(() => {
            try {
                const g = gridRef.current?.grid || gridRef.current?.ej2Instances || gridRef.current;
                if (!g) return;
                const idx = typeof g.getRowIndexByPrimaryKey === 'function' ? g.getRowIndexByPrimaryKey(jobToOpen) : -1;
                if (idx < 0) return;
                const tr = g.getRowByIndex(idx);
                if (!tr) return;
                // expand the detail row and trigger data fetch
                if (g.detailRowModule && typeof g.detailRowModule.expand === 'function') {
                    g.detailRowModule.expand(tr);
                }
                // trigger fetch for tasks
                const rowData = orderData.find((r:any) => String(r?.jobno_oms_id) === String(jobToOpen));
                if (rowData) setTimeout(() => { detailDataBound({ data: rowData }); }, 50);
            } catch (err) {
                console.error('auto-open detail error', err);
            }
        }, 120);
    }, [location.search, orderData]);

    const toggleDetailRow = (primaryKey: any) => {
        // tolerate either the React ref object or underlying ej2 instance
        let g: any = gridRef.current;
        if (!g || !primaryKey) return;
        // some ref wrappers expose the ej2 instance under 'grid' or 'ej2Instances'
        g = g.grid || g.ej2Instances || g;
        if (!g) return;
        try {
            // Find the row index for the primary key (jobno_oms_id is declared as primary key)
            const rowIndex = (typeof g.getRowIndexByPrimaryKey === 'function') ? g.getRowIndexByPrimaryKey(primaryKey) : -1;
            if (rowIndex < 0) {
                // fallback: search visible rows to match primary key value
                const rows = g.getRows ? g.getRows() : [];
                const found = rows.findIndex((r: any) => r.getAttribute && r.getAttribute('data-uid') && (r.querySelector('[data-colindex]')?.textContent || '').includes(String(primaryKey)));
                if (found >= 0) {
                    // try to use found index
                    // continue with found index where possible
                } else {
                    // nothing we can do
                    console.debug('toggleDetailRow: rowIndex not found', primaryKey);
                    return;
                }
            }
            const tr = g.getRowByIndex(rowIndex);
            if (!tr) return;
            const next = tr.nextElementSibling;
            const isExpanded = next && next.classList && next.classList.contains('e-detailrow');
            console.debug('toggleDetailRow', { primaryKey, rowIndex, isExpanded, tr, next, grid: !!g });
            if (isExpanded) {
                // collapse expects the detail row element (the expanded sibling), not the parent tr
                if (g.detailRowModule && typeof g.detailRowModule.collapse === 'function') {
                    g.detailRowModule.collapse(next);
                } else if (typeof g.detailCollapseAll === 'function') {
                    g.detailCollapseAll();
                }
            } else {
                if (g.detailRowModule && typeof g.detailRowModule.expand === 'function') {
                    g.detailRowModule.expand(tr);
                } else if (typeof g.detailExpandAll === 'function') {
                    g.detailExpandAll();
                }

                // After expanding, ensure detail data is fetched for this row so sub-components show real data
                try {
                    const pk = primaryKey;
                    const already = detailDataMap && detailDataMap[pk];
                    const loading = loadingDetails && loadingDetails[pk];
                    if (!already && !loading) {
                        // find the order object from orderData and call detailDataBound with it
                        const row = (orderData || []).find((r: any) => String(r?.jobno_oms_id) === String(pk));
                        if (row) {
                            // call the same handler used by Grid's expand event
                            // but do it asynchronously to give the DOM a moment to insert the detail container
                            setTimeout(() => {
                                try { detailDataBound({ data: row }); } catch (e) { console.error('detailDataBound invoke error', e); }
                            }, 50);
                        }
                    }
                } catch (err) {
                    console.error('post-expand fetch error', err);
                }
            }
        } catch (err) {
            console.error('toggleDetailRow error', err);
        }
    };

    const expandToggleTemplate = (props: any) => {
        const pk = props?.jobno_oms_id;
        return (
            <a
                href="#"
                role="button"
                className="custom-expand"
                onClick={(e: any) => { e.preventDefault(); e.stopPropagation(); toggleDetailRow(pk); }}
                title="Show details"
                aria-label={`Toggle details for ${pk}`}
            >
                <span>&#9656;</span>
            </a>
        );
    };
    const onCardClick = (args: any) => {
        // Kanban card click args may expose .data or .cardData depending on version
        const data = args?.data || args?.cardData || (args?.data && Array.isArray(args.data) ? args.data[0] : null);
        if (!data) return;
        const normalized = normalizeTask(data);
        setSelectedTask(normalized);
    };

    const onChartPointClick = (args: any, tasks: any[] = []) => {
        const status = args?.point?.x || args?.point?.category || (args?.point && args.point.x);
        if (!status) return;
        const filtered = tasks.filter(t => t.Status === status);
        setSelectedTask({ groupStatus: status, tasks: filtered });
    };

    const clearSelected = () => setSelectedTask(null);

    // --- CSS Injection ---
    useEffect(() => {
        const css = `
            .card-template-wrap { width: 100%; height: auto; }
            .e-kanban .e-card-template .card-template-wrap { padding: 0; }
            .e-kanban .e-card-template .card-template-wrap td { vertical-align: top; }
            .e-kanban .e-card-template .card-template-wrap .e-card-header { margin-bottom: 4px; }
            .e-kanban .e-card-template .card-template-wrap .e-card-header-caption,
            .e-kanban .e-card-template .card-template-wrap .e-card-content,
            .e-kanban .e-card-template .card-template-wrap .e-card-header-title { padding: 0; }
            .e-kanban .e-card-template .card-template-wrap .e-tooltip-text { padding-bottom: 5px; }
            .image img { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }

            /* Make detail expand toggle visible and clickable */
            .e-detailrowexpand a, .custom-expand {
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                background: #f6f8f9;
                color: #333;
                cursor: pointer;
                text-decoration: none;
                border: 1px solid rgba(0,0,0,0.04);
            }
            .e-detailrowexpand a:hover, .custom-expand:hover { background: #e9f0f4; }
            .custom-expand span { font-size: 14px; line-height: 14px; }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // --- Data Fetching ---
    useEffect(() => {
        fetch('https://app.herofashion.com/order_panda/')
            .then(response => {
                if (!response.ok) { throw new Error('Network response was not ok'); }
                return response.json();
            })
            .then(data => {
                // The grid expects an array. If the API returns a single object, wrap it.
                const dataArray = Array.isArray(data) ? data : [data];

                // If the order objects already include tasks, normalize and cache them for detail templates
                const initialDetails: Record<string, any[]> = {};
                dataArray.forEach((o: any) => {
                    const id = o?.jobno_oms_id;
                    const candidates = o?.tasks || o?.task_list || o?.task || o?.tasks_list || [];
                    if (id && candidates && candidates.length) {
                        initialDetails[id] = candidates.map(normalizeTask);
                    }
                });

                setOrderData(dataArray);
                if (Object.keys(initialDetails).length) {
                    setDetailDataMap(prev => ({ ...prev, ...initialDetails }));
                }
            })
            .catch(error => console.error('There was a problem with your fetch operation:', error));
    }, []); // Empty dependency array ensures this runs only once on mount

    // --- Templates for Detail Row ---
    
    // This event would be used to fetch detail data for the specific row if the API supported it
    const detailDataBound = async (args) => {
        const id = args?.data?.jobno_oms_id;
        console.log("Expanding row:", id);
        if (!id) return;
        // If already fetched, do nothing
        if (detailDataMap[id]) return;
        setLoadingDetails(prev => ({ ...prev, [id]: true }));

        const tryNormalize = (arr: any[]) => arr.map(normalizeTask);

        try {
            // Try the dedicated tasks endpoint first
            let resp = await fetch(`http://127.0.0.1:8000/order_panda/${id}/tasks/`);
            if (resp.ok) {
                const taskData = await resp.json();
                const tasksArray = Array.isArray(taskData) ? taskData : [taskData];
                const normalized = tryNormalize(tasksArray);
                console.log('Fetched tasks for', id, normalized);
                setDetailDataMap(prev => ({ ...prev, [id]: normalized }));
                return;
            }

            // If tasks endpoint not found, try fetching the order itself and look for a tasks field
            resp = await fetch(`http://127.0.0.1:8000/order_panda/${id}/`);
            if (resp.ok) {
                const order = await resp.json();
                const candidates = order?.tasks || order?.task_list || order?.task || order?.tasks_list || [];
                if (candidates && candidates.length) {
                    const normalized = tryNormalize(candidates);
                    console.log('Using embedded tasks for', id, normalized);
                    setDetailDataMap(prev => ({ ...prev, [id]: normalized }));
                    return;
                }
            }

            // Last resort: no tasks found, keep empty.
            setDetailDataMap(prev => ({ ...prev, [id]: [] }));
        } catch (error) {
            console.error('Error fetching detail tasks:', error);
            setDetailDataMap(prev => ({ ...prev, [id]: [] }));
        } finally {
            setLoadingDetails(prev => ({ ...prev, [id]: false }));
        }
    };  

    const cardTemplate = (props) => {
        // props may include __order_balances and __order_summary when rendered inside the detail template
        const orderId = props.__order_id || props.jobno_oms_id || '';
        const orderCompany = props.__order_summary?.company || props.company_name || '';
        const balances = props.__order_balances || {};
        const balanceEntries = Object.keys(balances || {}).slice(0,3).map(k => ({ k, v: balances[k] }));
        return (
            <div className="card-template">
                <table className="card-template-wrap">
                    <tbody>
                        <tr>
                            <td className="e-title">
                                <div className="e-card-header">
                                    <div className="e-card-header-caption">
                                        <div className="e-card-header-title e-tooltip-text">{props.Id}</div>
                                    </div>
                                </div>
                                <div className="e-card-content e-tooltip-text">{props.Summary}</div>
                                <div style={{ marginTop: 6, color: '#333', fontSize: 12 }}>
                                    {orderId && <span style={{ marginRight: 10 }}><b>Order:</b> {orderId}</span>}
                                    {orderCompany && <span style={{ marginRight: 10 }}><b>Company:</b> {orderCompany}</span>}
                                </div>
                                {balanceEntries.length > 0 && (
                                    <div style={{ marginTop: 6, color: '#666', fontSize: 12 }}>
                                        {balanceEntries.map(be => (
                                            <div key={be.k}><b>{String(be.k).replace(/_/g,' ')}:</b> {String(be.v)}</div>
                                        ))}
                                    </div>
                                )}
                                <span className="e-card-content"><b>Estimated:</b> {props.Estimate}h</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    const taskTemplate = (tasks: any[] = [], orderId?: string) => {
        const uniqueKanbanId = `kanban-${orderId ?? Math.random().toString(36).slice(2,8)}`;
        return (
            <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                {tasks.length === 0 ? (
                    <div style={{ padding: 24, color: '#666' }}>No tasks to display for this order.</div>
                ) : (
                    <KanbanComponent id={uniqueKanbanId} key={uniqueKanbanId} keyField="Status" dataSource={tasks} cardSettings={{ template: cardTemplate, headerField: 'Id' }} cardClick={onCardClick}>
                        <KanbanColumns>
                            <KanbanColumn headerText="Open" keyField="Open" />
                            <KanbanColumn headerText="In Progress" keyField="InProgress" />
                            <KanbanColumn headerText="Testing" keyField="Testing" />
                            <KanbanColumn headerText="Done" keyField="Close" />
                        </KanbanColumns>
                    </KanbanComponent>
                )}
            </div>
        );
    };

    const chartTemplate = (tasks: any[] = [], orderId?: string) => {
        // aggregate tasks into chart-friendly format
        const statuses = ['Open', 'InProgress', 'Testing', 'Close'];
        const aggregated = statuses.map(status => {
            const filtered = tasks.filter(t => t.Status === status);
            const estimated = filtered.reduce((sum, t) => sum + (Number(t.Estimate) || 0), 0);
            const spent = filtered.reduce((sum, t) => sum + (Number(t.Spent) || 0), 0);
            return { status, estimatedHours: estimated, spentHours: spent };
        });
        const chartData = tasks.length ? aggregated : placeholderChartData;
        const uniqueChartId = `chart-${orderId ?? Math.random().toString(36).slice(2,8)}`;
        return (
            <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                <ChartComponent id={uniqueChartId} height="302px" tooltip={{ enable: true }} primaryXAxis={{ valueType: 'Category', title: 'Status' }} title="Burndown Chart" pointClick={(args) => onChartPointClick(args, tasks)}>
                    <ChartInject services={[Tooltip, LineSeries, Category, Legend]} />
                    <SeriesCollectionDirective>
                        <SeriesDirective dataSource={chartData} xName="status" yName="estimatedHours" name="Estimated Hours" marker={{ visible: true, width: 10, height: 10 }} />
                        <SeriesDirective dataSource={chartData} xName="status" yName="spentHours" name="Spent Hours" marker={{ visible: true, width: 10, height: 10 }} />
                    </SeriesCollectionDirective>
                </ChartComponent>
            </div>
        );
    }; 

    const gridDetailTemplate = (props: any) => {
        const headertext = [{ text: "Taskboard" }, { text: "Burndown Chart" }];
        const id = props?.jobno_oms_id;
        const isLoading = id ? !!loadingDetails[id] : false;

        // Build balances/details list dynamically from order props (regex) and add fallback field names present in your API
        const fallbackFieldNameList = ['quantity','qty','shipmentcompleted','shipment_completed','remaining','balance','amount','fdays','days','quantity1','quantity_left','u36','slno'];
        const presentFallbacks = fallbackFieldNameList.filter(k => k in (props || {}) && props[k] !== null && props[k] !== undefined && String(props[k]).trim().length > 0);

        const candidateRegex = /bal|balance|qty|quantity|remaining|due|amount|shipment|left|fdays/i;
        const balanceCandidates = Object.keys(props || {}).filter(k => candidateRegex.test(k));
        const mergedFields = Array.from(new Set([...balanceCandidates, ...presentFallbacks]));
        const balanceFields = mergedFields.filter(k => {
            const v = props[k];
            return v !== null && v !== undefined && (typeof v === 'number' || (typeof v === 'string' && String(v).trim().length > 0));
        });

        const tasksRaw = id ? (detailDataMap[id] || []) : [];
        // attach order-level balances/summary into each task so Kanban card template can show them
        const orderBalancesObj = balanceFields.reduce((acc:any, k) => { acc[k] = props[k]; return acc; }, {});
        const tasksForKanban = tasksRaw.map(t => ({ ...t, __order_balances: orderBalancesObj, __order_id: id, __order_summary: { company: props?.company_name, jobno: props?.jobno_oms_id } }));
        const renderTaskContent = () => {
            if (isLoading) {
                return (
                    <div style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(140px,1fr))', gap: 8, marginBottom: 12 }}>
                            <div><b>ID:</b> {props?.jobno_oms_id}</div>
                            <div><b>Style:</b> {props?.styleid}</div>
                            <div><b>PO:</b> {props?.pono}</div>
                            <div><b>Company:</b> {props?.company_name}</div>
                            <div><b>Delivery:</b> {props?.final_delivery_date || props?.finaldelvdate}</div>
                            <div><b>Reference:</b> {props?.reference}</div>
                        </div>
                        <div style={{ color: '#666' }}>Loading tasks…</div>
                    </div>
                );
            }
            return taskTemplate(tasksForKanban, id);
        };

        const orderSummary = (
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #eee', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 90 }}>
                    <img src={props?.mainimagepath || props?.image_order} alt={props?.jobno_oms_id} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }} onError={(e:any) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))', gap: 8 }}>
                    <div><b>ID:</b> {props?.jobno_oms_id}</div>
                    <div><b>Job #:</b> {props?.jobnoomsnew}</div>
                    <div><b>Style:</b> {props?.styleid}</div>
                    <div><b>PO:</b> {props?.pono}</div>
                    <div><b>Delivery:</b> {props?.final_delivery_date || props?.finaldelvdate}</div>
                    <div><b>Company:</b> {props?.company_name}</div>
                    <div style={{ gridColumn: '1 / -1' }}><b>Reference:</b> {props?.reference}</div>
                </div>
                <div style={{ minWidth: 200 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Balances</div>
                    {balanceFields.length === 0 ? (
                        <div style={{ color: '#666' }}>No balance fields present in this order.</div>
                    ) : (
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {balanceFields.map((k) => (
                                <li key={k}><b>{k.replace(/_/g, ' ')}:</b> {String(props[k])}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );

        const balancesEl = (
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Order Details</div>
                {balanceFields.length === 0 ? (
                    <div style={{ color: '#666' }}>No additional numeric/detail fields detected for this order.</div>
                ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {balanceFields.map((k) => (
                            <li key={k}><b>{String(k).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</b> {String(props[k])}</li>
                        ))}
                    </ul>
                )}
            </div>
        );

        return (
            <div>
                {orderSummary}
                {balancesEl}

                {/* Selected task/group details shown when user clicks a card or a chart point */}
                {selectedTask && (
                    <div style={{ padding: '12px 20px', borderTop: '1px solid #eee', background: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 700 }}>{selectedTask.groupStatus ? `Tasks: ${selectedTask.groupStatus}` : `Task: ${selectedTask.Id}`}</div>
                            <button onClick={clearSelected} style={{ border: '1px solid #ccc', background: '#fff', padding: '4px 8px', cursor: 'pointer' }}>Close</button>
                        </div>
                        <div style={{ paddingTop: 8 }}>
                            {selectedTask.groupStatus ? (
                                <ul style={{ margin: 0 }}>
                                    {selectedTask.tasks.map((t:any) => (
                                        <li key={t.Id}><b>{t.Id}</b> — {t.Summary} <span style={{ fontWeight: 700 }}>({t.Estimate}h / {t.Spent}h)</span></li>
                                    ))}
                                </ul>
                            ) : (
                                <div>
                                    <div><b>Summary:</b> {selectedTask.Summary}</div>
                                    <div><b>Status:</b> {selectedTask.Status}</div>
                                    <div><b>Estimate:</b> {selectedTask.Estimate}h</div>
                                    <div><b>Spent:</b> {selectedTask.Spent}h</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <p style={{ textAlign: "center", paddingTop: "8px", fontSize: "17px", fontWeight: "bold" }}>Sprint</p>
                <TabComponent key={`tab-${id ?? Math.random().toString(36).slice(2,8)}`} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}>
                    <TabItemsDirective>
                        <TabItemDirective header={headertext[0]} content={() => renderTaskContent()} />
                        <TabItemDirective header={headertext[1]} content={() => chartTemplate(tasksRaw, id)} />
                    </TabItemsDirective>
                </TabComponent>
                {/* wire chart point clicks to show tasks with that status */}
                <div style={{ display: 'none' }}>{/* placeholder to avoid JSX warning */}</div>
            </div>
        );
    };

    // --- Template for the Main Grid Image Column ---
    const imageTemplate = (props) => (
        <div className='image'>
            <img src={props.mainimagepath} alt={props.jobno_oms_id} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }} />
        </div>
    );
    
    return (
        <div className='control-pane'>
            <div className='control-section'>
                <h3>Data Grid</h3>
                <p>This sample demonstrates the Grid component's with the detail template feature. It lets users click the expand button in each grid row to display detailed information about that row.</p>
                <br/>
                <GridComponent ref={gridRef} dataSource={orderData} detailDataBound={detailDataBound} detailTemplate={gridDetailTemplate} allowSorting={true} allowFiltering={true} filterSettings={{ type: 'CheckBox' }}>
                    <ColumnsDirective>
                        {/* explicit expand/collapse button column (ensures the button is always visible and independent per row) */}
                        <ColumnDirective headerText='' width='48' template={expandToggleTemplate} textAlign='Center' allowSorting={false} allowFiltering={false} />
                        <ColumnDirective headerText='Image' width='100' template={imageTemplate} textAlign='Center' />
                        <ColumnDirective field="jobno_oms" headerText='ID' isPrimaryKey={true} width={150} />
                        <ColumnDirective field="styleid" headerText='Style ID' width={120} />
                        <ColumnDirective field="pono" headerText='PO Number' width={120} />
                        <ColumnDirective field="final_delivery_date" headerText='Delivery Date' width={150} />
                        <ColumnDirective field="jobnoomsnew" headerText='Job Number' width={120} />
                        <ColumnDirective field="company_name" headerText='Company' width={160} />
                        <ColumnDirective field="reference" headerText='Reference' width={200} />
                    </ColumnsDirective>
                    <GridInject services={[DetailRow, Sort, Filter]} />
                </GridComponent>
            </div>
        </div>
    );
}
export default OrderGridWithDetail;