import React, { useState, useEffect, useMemo } from 'react';

// --- CSS STYLES ---
const styles = `
    /* General Layout */
    .hero-container { padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
    .hero-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .search-box { padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 250px; }
    
    /* Grid/Table Styling */
    .hero-grid-container { flex: 1; overflow: auto; background: white; border: 1px solid #ddd; border-radius: 4px; }
    .hero-table { width: 100%; border-collapse: collapse; min-width: 1000px; }
    
    /* Table Headers */
    .hero-table th { background-color: #f1f1f1; position: sticky; top: 0; text-align: left; padding: 12px; border-bottom: 2px solid #ddd; cursor: pointer; user-select: none; font-weight: 600; font-size: 14px; z-index: 10; }
    .hero-table th:hover { background-color: #e9ecef; }
    
    /* Sticky Filter Row (Sticks below main header) */
    .hero-table th.filter-row { 
        position: sticky; 
        top: 45px; /* Height of the first header row approx */
        background: #fff; 
        padding: 5px; 
        z-index: 9; 
        border-bottom: 1px solid #ddd; 
        box-shadow: 0 2px 2px -2px rgba(0,0,0,0.1);
    }
    
    /* Filter Inputs */
    .filter-input { 
        width: 100%; 
        padding: 5px; 
        border: 1px solid #ccc; 
        border-radius: 3px; 
        font-size: 12px; 
        box-sizing: border-box; /* Crucial for full width */
    }
    .filter-input:focus { outline: none; border-color: #007bff; }

    .hero-table td { padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; vertical-align: top; }
    .hero-table tr:hover { background-color: #f9f9f9; }
    .hero-table tr.expanded-row td { background-color: #fafafa; border-bottom: none; padding: 0; }
    
    /* Action Buttons */
    .btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin: 0 2px; }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-outline { background-color: transparent; border: 1px solid #ddd; color: #333; }
    .btn-sm { padding: 4px 8px; font-size: 11px; }
    
    /* Detail / Tabs */
    .detail-view { padding: 20px; border-top: 1px solid #ddd; background: #fff; min-height: 400px; }
    .tabs-header { display: flex; border-bottom: 1px solid #ddd; margin-bottom: 15px; }
    .tab-item { padding: 10px 20px; cursor: pointer; border-bottom: 3px solid transparent; font-weight: 500; color: #666; }
    .tab-item.active { border-bottom-color: #007bff; color: #007bff; }
    
    /* Kanban Boards */
    .kanban-board { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; min-height: 300px; }
    .kanban-column { min-width: 250px; flex: 1; background: #f4f4f4; border-radius: 4px; padding: 10px; display: flex; flex-direction: column; }
    .kanban-col-header { font-weight: bold; margin-bottom: 10px; color: #444; text-align: center; padding: 5px; background: #e2e2e2; border-radius: 2px; }
    .kanban-card { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 10px; margin-bottom: 10px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); font-size: 12px; }
    .kanban-card img { width: 100%; height: 80px; object-fit: cover; border-radius: 2px; margin-bottom: 5px; }
    .kanban-label { font-weight: bold; color: #333; margin-bottom: 2px; }
    .kanban-val { color: #666; margin-bottom: 5px; word-wrap: break-word; }

    /* Simple Chart */
    .chart-container { height: 300px; width: 100%; position: relative; border: 1px solid #eee; padding: 20px; background: white; }
    .chart-line { fill: none; stroke: #007bff; stroke-width: 2; }
    .chart-dot { fill: white; stroke: #007bff; stroke-width: 2; r: 4; }
    .chart-axis { stroke: #ccc; stroke-width: 1; }
    .chart-text { font-size: 10px; fill: #666; }

    /* Pagination */
    .pagination { padding: 10px; display: flex; justify-content: space-between; align-items: center; background: white; border-top: 1px solid #ddd; }
    
    /* Loading */
    .loading { text-align: center; padding: 50px; font-size: 18px; color: #666; }
`;

// --- SUB-COMPONENT: CHART (Pure SVG) ---
const SimpleLineChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="loading">No Data for Chart</div>;

    const width = 800;
    const height = 300;
    const padding = 40;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;

    const maxY = Math.max(...data.map(d => parseFloat(d.y) || 0)) * 1.1 || 10;
    
    const points = data.map((d, i) => {
        const x = padding + (i / (data.length - 1 || 1)) * chartW;
        const y = padding + chartH - ((d.y / maxY) * chartH);
        return { x, y, label: d.x, val: d.y };
    });

    const pathD = points.length > 0 
        ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
        : '';

    return (
        <div className="chart-container">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} className="chart-axis" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="chart-axis" />
                {points.map((p, i) => (
                    <text key={i} x={p.x} y={height - padding + 15} textAnchor="middle" className="chart-text" transform={`rotate(45, ${p.x}, ${height - padding + 15})`}>
                        {p.label.substring(0, 10)}
                    </text>
                ))}
                <text x={padding - 5} y={height - padding} textAnchor="end" className="chart-text">0</text>
                <text x={padding - 5} y={padding} textAnchor="end" className="chart-text">{Math.round(maxY)}</text>
                <path d={pathD} className="chart-line" />
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} className="chart-dot"><title>{p.label}: {p.val}</title></circle>
                ))}
            </svg>
        </div>
    );
};

// --- SUB-COMPONENT: DETAIL VIEW ---
const DetailView = ({ rowData, onTabChange, activeTab }) => {
    const fabricData = Array.isArray(rowData.Fabric) ? rowData.Fabric : [];
    const printingData = Array.isArray(rowData.Printing) ? rowData.Printing : [];
    
    const chartData = fabricData.map((item, index) => ({
        x: item.topbottom_des || `Item ${index}`,
        y: parseFloat(item.prodqty) || 0
    }));

    const renderKanban = (data, keyField, columns) => {
        return (
            <div className="kanban-board">
                {columns.map((col) => {
                    const items = data.filter(item => (item[keyField] || '').toLowerCase() === (col.keyField || '').toLowerCase());
                    return (
                        <div key={col.headerText} className="kanban-column">
                            <div className="kanban-col-header">{col.headerText} ({items.length})</div>
                            {items.map((item, idx) => (
                                <div key={idx} className="kanban-card">
                                    {item.mainimagepath && <img src={item.mainimagepath} alt="Item" />}
                                    <div className="kanban-label">{item.jobno || 'No Job No'}</div>
                                    {item.process_des && <div className="kanban-val">{item.process_des}</div>}
                                    {item.topbottom_des && <div className="kanban-val">Color: {item.topbottom_des}</div>}
                                    {item.prodqty && <div className="kanban-val">Qty: {item.prodqty}</div>}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="detail-view">
            <div className="tabs-header">
                {['Fabric Taskboard', 'Printing Taskboard', 'Analysis Chart', 'Bala'].map((tab, index) => (
                    <div key={index} className={`tab-item ${activeTab === index ? 'active' : ''}`} onClick={() => onTabChange(index)}>
                        {tab}
                    </div>
                ))}
            </div>
            <div className="tab-content" style={{height: '350px'}}>
                {activeTab === 0 && (
                    <div style={{height: '100%'}}>
                        {fabricData.length === 0 ? <div className="loading">No Fabric Data</div> : 
                            renderKanban(fabricData, 'process_des', [
                                { headerText: 'G.T.Process', keyField: 'G.T.Process' },
                                { headerText: 'Maham Tex', keyField: 'Maham Tex' },
                                { headerText: 'Texcorp Industries', keyField: 'Texcorp Industries' },
                                { headerText: 'Others', keyField: 'Others' }
                            ])
                        }
                    </div>
                )}
                {activeTab === 1 && (
                    <div style={{height: '100%'}}>
                         {printingData.length === 0 ? <div className="loading">No Printing Data</div> : 
                            renderKanban(printingData, 'm', [
                                { headerText: 'Not Pending', keyField: 'not pending' },
                                { headerText: 'Pending', keyField: 'pending' },
                                { headerText: 'Completed', keyField: 'completed' }
                            ])
                        }
                    </div>
                )}
                {activeTab === 2 && (<div><SimpleLineChart data={chartData} /></div>)}
                {activeTab === 3 && (
                     <div style={{height: '100%'}}>
                        {printingData.length === 0 ? <div className="loading">No Data for Bala View</div> : 
                            renderKanban(printingData, 'm', [
                                { headerText: 'Dyed', keyField: 'Dyed' },
                                { headerText: 'Printed', keyField: 'Printed' },
                                { headerText: 'Cora', keyField: 'Cora' }
                            ])
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
function DetailTemplateVanilla() {
    const [gridData, setGridData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // NEW: Column Filter State
    const [columnFilters, setColumnFilters] = useState({});

    const [sortCol, setSortCol] = useState('id');
    const [sortAsc, setSortAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    
    const [expandedRows, setExpandedRows] = useState({});
    const [activeTabs, setActiveTabs] = useState({}); 

    // Fetch Data
    useEffect(() => {
        setLoading(true);
        fetch("https://app.herofashion.com/grid_api1ord/")
            .then(res => res.json())
            .then(data => {
                let finalData = [];
                if (Array.isArray(data)) finalData = data;
                else if (data?.result) finalData = data.result;
                else if (data?.data) finalData = data.data;
                else {
                    const firstArray = Object.values(data).find(val => Array.isArray(val));
                    if (firstArray) finalData = firstArray;
                }
                setGridData(finalData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // UPDATED: Data Processing with Global Search AND Column Filters
    const processedData = useMemo(() => {
        let result = [...gridData];

        // 1. Global Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(item => 
                (item.name && item.name.toLowerCase().includes(lowerTerm)) ||
                (item.id && item.id.toString().includes(lowerTerm)) ||
                (item.dept && item.dept.toLowerCase().includes(lowerTerm))
            );
        }

        // 2. Column Filters (Iterate over columnFilters state)
        Object.keys(columnFilters).forEach(key => {
            const filterValue = columnFilters[key];
            if (filterValue) {
                const lowerVal = filterValue.toLowerCase();
                // Handle nested fields (like Fabric[0].topbottom_des)
                if(key === 'topbottom_des') {
                     result = result.filter(row => 
                        (row.Fabric && row.Fabric[0] && row.Fabric[0].topbottom_des || '').toLowerCase().includes(lowerVal)
                    );
                } else {
                    // Handle standard fields
                    result = result.filter(row => 
                        (row[key] || '').toString().toLowerCase().includes(lowerVal)
                    );
                }
            }
        });

        // 3. Sort
        result.sort((a, b) => {
            let valA = a[sortCol];
            let valB = b[sortCol];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });

        return result;
    }, [gridData, searchTerm, columnFilters, sortCol, sortAsc]);

    const totalPages = Math.ceil(processedData.length / rowsPerPage);
    const paginatedData = processedData.slice(
        (currentPage - 1) * rowsPerPage, 
        currentPage * rowsPerPage
    );

    const handleSort = (col) => {
        if (sortCol === col) setSortAsc(!sortAsc);
        else { setSortCol(col); setSortAsc(true); }
    };

    const handleFilterChange = (key, value) => {
        setColumnFilters(prev => ({...prev, [key]: value}));
        setCurrentPage(1); // Reset to page 1 on filter
    };

    const clearFilters = () => {
        setColumnFilters({});
        setCurrentPage(1);
    };

    const toggleExpand = (id) => {
        setExpandedRows(prev => ({...prev, [id]: !prev[id]}));
        if (!expandedRows[id] && !activeTabs[id]) {
            setActiveTabs(prev => ({...prev, [id]: 0}));
        }
    };

    const handleTabChange = (rowId, tabIndex) => {
        setActiveTabs(prev => ({...prev, [rowId]: tabIndex}));
    };

    if (loading) return <div className="loading">Loading Hero Fashion Data...</div>;

    return (
        <div className="hero-container">
            <style>{styles}</style>
            <div className="hero-header">
                <h2 style={{margin:0, color:'#333'}}>Hero Fashion Orders</h2>
                <div style={{display:'flex', gap:'10px'}}>
                     <button className="btn btn-secondary btn-sm" onClick={clearFilters}>Clear Filters</button>
                    <input 
                        type="text" 
                        className="search-box" 
                        placeholder="Global Search..." 
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            <div className="hero-grid-container">
                <table className="hero-table">
                    <thead>
                        {/* MAIN HEADER ROW */}
                        <tr>
                            <th onClick={() => handleSort('id')} width="120">ID {sortCol === 'id' ? (sortAsc ? '▲' : '▼') : ''}</th>
                            <th width="100">Image</th>
                            <th onClick={() => handleSort('name')} width="150">Name {sortCol === 'name' ? (sortAsc ? '▲' : '▼') : ''}</th>
                            <th onClick={() => handleSort('dept')} width="150">Department {sortCol === 'dept' ? (sortAsc ? '▲' : '▼') : ''}</th>
                            <th onClick={() => handleSort('dt')} width="120">Date {sortCol === 'dt' ? (sortAsc ? '▲' : '▼') : ''}</th>
                            <th onClick={() => handleSort('sv')} width="100">Unit {sortCol === 'sv' ? (sortAsc ? '▲' : '▼') : ''}</th>
                            <th width="200">Top/Bottom</th>
                            <th width="100">Actions</th>
                        </tr>
                        
                        {/* NEW: FILTER HEADER ROW */}
                        <tr>
                            <th className="filter-row">
                                <input 
                                    className="filter-input" 
                                    placeholder="Search ID" 
                                    value={columnFilters['id'] || ''} 
                                    onChange={(e) => handleFilterChange('id', e.target.value)} 
                                />
                            </th>
                            <th className="filter-row"></th> {/* No filter for Image */}
                            <th className="filter-row">
                                <input 
                                    className="filter-input" 
                                    placeholder="Search Name" 
                                    value={columnFilters['name'] || ''} 
                                    onChange={(e) => handleFilterChange('name', e.target.value)} 
                                />
                            </th>
                            <th className="filter-row">
                                <input 
                                    className="filter-input" 
                                    placeholder="Search Dept" 
                                    value={columnFilters['dept'] || ''} 
                                    onChange={(e) => handleFilterChange('dept', e.target.value)} 
                                />
                            </th>
                            <th className="filter-row">
                                <input 
                                    className="filter-input" 
                                    placeholder="Date" 
                                    value={columnFilters['dt'] || ''} 
                                    onChange={(e) => handleFilterChange('dt', e.target.value)} 
                                />
                            </th>
                            <th className="filter-row">
                                <input 
                                    className="filter-input" 
                                    placeholder="Unit" 
                                    value={columnFilters['sv'] || ''} 
                                    onChange={(e) => handleFilterChange('sv', e.target.value)} 
                                />
                            </th>
                            <th className="filter-row">
                                <input 
                                    className="filter-input" 
                                    placeholder="Fabric Color" 
                                    value={columnFilters['topbottom_des'] || ''} 
                                    onChange={(e) => handleFilterChange('topbottom_des', e.target.value)} 
                                />
                            </th>
                            <th className="filter-row"></th> {/* No filter for Action */}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map(row => (
                            <React.Fragment key={row.id}>
                                <tr>
                                    <td>{row.id}</td>
                                    <td>
                                        <img src={row.photo || `https://picsum.photos/seed/${row.id}/50/50`} alt="User" style={{width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover'}}/>
                                    </td>
                                    <td>{row.name}</td>
                                    <td style={{color:'#007bff'}}>{row.dept}</td>
                                    <td>{row.dt}</td>
                                    <td>{row.sv}</td>
                                    <td>{Array.isArray(row.Fabric) && row.Fabric.length > 0 ? row.Fabric[0].topbottom_des : '-'}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline" onClick={() => toggleExpand(row.id)}>
                                            {expandedRows[row.id] ? 'Collapse ▲' : 'Expand Details ▼'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedRows[row.id] && (
                                    <tr className="expanded-row">
                                        <td colSpan="8">
                                            <DetailView rowData={row} activeTab={activeTabs[row.id] || 0} onTabChange={(idx) => handleTabChange(row.id, idx)} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <span>Showing {paginatedData.length} of {processedData.length} records</span>
                    <div style={{display:'flex', gap:'5px'}}>
                        <button className="btn btn-secondary btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
                        <span>Page {currentPage} of {totalPages || 1}</span>
                        <button className="btn btn-secondary btn-sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailTemplateVanilla;