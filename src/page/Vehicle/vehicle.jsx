import React, { useState, useEffect, useMemo } from "react";
import {
  RefreshCw,
  Car,
  LayoutGrid,
  Filter,
  IndianRupee,
  Search, // Added Search Icon
  X,      // Added X Icon for closing filters
  ChevronDown
} from "lucide-react";

function VehicleReport() {
  const currentYear = new Date().getFullYear();

  // --- STATE ---
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State for Mobile
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [expFilter, setExpFilter] = useState("");
  
  // Date Filters
  const [startYear, setStartYear] = useState(String(currentYear));
  const [endYear, setEndYear] = useState(String(currentYear));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const API_URL = "http://10.1.21.13:7300/";

  // --- API FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const safeData = Array.isArray(data) ? data : data.data || [];
      setExpenses(safeData);
    } catch (err) {
      console.error("API error:", err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- FILTER LOGIC ---
  const getFilteredResults = (data, criteria) => {
    let result = [...data];

    if (criteria.search) {
      const t = criteria.search.toLowerCase();
      result = result.filter((item) =>
        Object.values(item).some((v) => String(v).toLowerCase().includes(t))
      );
    }

    if (criteria.vehicle) result = result.filter((i) => i.mcno === criteria.vehicle);
    if (criteria.exp) result = result.filter((i) => i.exp === criteria.exp);

    if (criteria.sDate && criteria.eDate) {
      const s = new Date(criteria.sDate);
      const e = new Date(criteria.eDate);
      e.setHours(23, 59, 59, 999);
      result = result.filter((i) => {
        if (!i.date) return false;
        const d = new Date(i.date);
        return d >= s && d <= e;
      });
    } else if (criteria.sYear && criteria.eYear) {
      let sY = parseInt(criteria.sYear);
      let eY = parseInt(criteria.eYear);
      if (sY > eY) [sY, eY] = [eY, sY];
      result = result.filter((i) => {
        if (!i.date) return false;
        const y = new Date(i.date).getFullYear();
        return y >= sY && y <= eY;
      });
    }
    result.sort((a, b) => a.slno - b.slno);
    return result;
  };

  // --- MEMOIZED DATA ---
  const filteredData = useMemo(() => {
    return getFilteredResults(expenses, {
      search: searchTerm,
      vehicle: vehicleFilter,
      exp: expFilter,
      sDate: startDate,
      eDate: endDate,
      sYear: startYear,
      eYear: endYear,
    });
  }, [expenses, searchTerm, vehicleFilter, expFilter, startDate, endDate, startYear, endYear]);

  const vehicleOptions = useMemo(() => {
    const dataForOptions = getFilteredResults(expenses, {
      search: searchTerm,
      vehicle: "", 
      exp: expFilter,
      sDate: startDate,
      eDate: endDate,
      sYear: startYear,
      eYear: endYear,
    });
    return [...new Set(dataForOptions.map((i) => i.mcno))].sort();
  }, [expenses, searchTerm, expFilter, startDate, endDate, startYear, endYear]);

  const expOptions = useMemo(() => {
    const dataForOptions = getFilteredResults(expenses, {
      search: searchTerm,
      vehicle: vehicleFilter,
      exp: "",
      sDate: startDate,
      eDate: endDate,
      sYear: startYear,
      eYear: endYear,
    });
    return [...new Set(dataForOptions.map((i) => i.exp))].sort();
  }, [expenses, searchTerm, vehicleFilter, startDate, endDate, startYear, endYear]);

  const yearOptions = useMemo(() => {
    const dataForOptions = getFilteredResults(expenses, {
      search: searchTerm,
      vehicle: vehicleFilter,
      exp: expFilter,
      sDate: "",
      eDate: "",
      sYear: "",
      eYear: "",
    });
    const years = dataForOptions
      .map((i) => (i.date ? new Date(i.date).getFullYear() : null))
      .filter((y) => y !== null);
    return [...new Set(years)].sort((a, b) => b - a);
  }, [expenses, searchTerm, vehicleFilter, expFilter]);


  // --- HELPERS ---
  const clearFilters = () => {
    setSearchTerm("");
    setVehicleFilter("");
    setExpFilter("");
    setStartDate("");
    setEndDate("");
    setStartYear(String(currentYear));
    setEndYear(String(currentYear));
    setShowFilters(false); // Close mobile menu on clear
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const groupedData = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const key = item.billno || item.slno;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filteredData]);

  // --- STATISTICS ---
  const allBillsCount = new Set(expenses.map(r => r.billno || r.slno)).size;
  const filteredBillsCount = Object.keys(groupedData).length;
  const totalAmount = filteredData.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const overallTotal = expenses.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const activeVehiclesCount = new Set(filteredData.map((i) => i.mcno)).size;
  const totalVehiclesCount = new Set(expenses.map((i) => i.mcno)).size;


  // --- RENDER ---
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-slate-600">Loading vehicle data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600 font-bold mb-2">{error}</p>
        <button onClick={fetchData} className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition">
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* ----------------------------------------------------------------------- */}
      {/* RESPONSIVE HEADER SECTION */}
      {/* ----------------------------------------------------------------------- */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-[99%] mx-auto px-4 py-3">
          
          {/* TOP ROW: Logo, Title, Mobile Toggle */}
          <div className="flex justify-between items-center mb-3 md:mb-0">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Car className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <h1 className="text-lg md:text-xl font-bold uppercase tracking-wider text-slate-800">
                Vehicle Report
              </h1>
            </div>

            {/* Mobile: Toggle Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`md:hidden p-2 rounded-lg transition-colors ${showFilters ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'}`}
            >
              {showFilters ? <X size={20} /> : <Filter size={20} />}
            </button>
          </div>

          {/* MAIN CONTROLS CONTAINER */}
          {/* Mobile: Hidden by default, Flex Col when open. Desktop: Always Flex Row */}
          <div className={`
             flex flex-col gap-3
             md:flex-row md:items-center md:justify-end md:gap-2
             ${showFilters ? 'block' : 'hidden md:flex'}
          `}>
            
            {/* SEARCH BAR (Full width on mobile, auto on desktop) */}
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-48 pl-9 pr-4 py-2 rounded-lg text-sm font-semibold text-slate-700 outline-none border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 transition"
              />
            </div>

            {/* FILTERS WRAPPER (Grid on mobile for better spacing, flex on desktop) */}
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
              
              {/* VEHICLE */}
              <div className="relative col-span-2 md:col-span-1">
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="w-full md:w-40 appearance-none pl-3 pr-8 py-2 rounded-lg text-sm font-semibold text-slate-700 border border-gray-200 bg-white hover:border-blue-400 cursor-pointer"
                >
                  <option value="">All Vehicles</option>
                  {vehicleOptions.map((v, i) => <option key={i} value={v}>{v}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={14} />
              </div>

              {/* EXPENSE */}
              <div className="relative col-span-2 md:col-span-1">
                <select
                  value={expFilter}
                  onChange={(e) => setExpFilter(e.target.value)}
                  className="w-full md:w-40 appearance-none pl-3 pr-8 py-2 rounded-lg text-sm font-semibold text-slate-700 border border-gray-200 bg-white hover:border-blue-400 cursor-pointer"
                >
                  <option value="">All Expenses</option>
                  {expOptions.map((e, i) => <option key={i} value={e}>{e}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={14} />
              </div>

              {/* DATES */}
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full md:w-auto px-2 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full md:w-auto px-2 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white"
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={clearFilters}
                className="flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition"
              >
                Clear
              </button>
              <button
                onClick={() => { fetchData(); setShowFilters(false); }}
                className="flex-1 md:flex-none px-4 py-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="max-w-[99%] mx-auto mt-6 space-y-6 px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Bills */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center border border-slate-100 h-[125px]">
            <div>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold text-red-500">{filteredBillsCount}</h3>
                <span className="text-sm text-slate-400 font-bold">/ {allBillsCount}</span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase">Filtered / Total Bills</p>
            </div>
            <LayoutGrid className="text-red-500" size={24} />
          </div>

          {/* Card 2: Total Amount */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center border border-slate-100 h-[125px]">
            <div>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-extrabold text-blue-600 tracking-tight">
                    ₹{(totalAmount / 100000).toFixed(2)} L
                </h3>
                <span className="text-sm font-bold text-slate-400">
                    / ₹{(overallTotal / 100000).toFixed(2)} L
                </span>
              </div>
              <p className="text-slate-400 text-xs font-bold mt-1 uppercase">Filtered / Overall Amount</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <IndianRupee size={24} />
            </div>
          </div>

          {/* Card 3: Active Vehicles */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center border border-slate-100 h-[125px]">
            <div>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-extrabold text-green-500 tracking-tight">
                  {activeVehiclesCount}
                </h3>
                <span className="text-sm font-bold text-slate-400">
                  / {totalVehiclesCount}
                </span>
              </div>
              <p className="text-slate-400 text-xs font-bold mt-1 uppercase">
                Active / Total Vehicles
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <Car size={24} />
            </div>
          </div>

          {/* Card 4: Year Filter */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3 border border-slate-100 h-[125px]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
                <Filter size={14} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">Year Filter</span>
            </div>
            <div className="flex gap-2">
              <select
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="flex-1 h-9 px-2 rounded border border-slate-200 text-xs font-bold bg-slate-50 cursor-pointer hover:border-blue-400"
              >
                {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="flex-1 h-9 px-2 rounded border border-slate-200 text-xs font-bold bg-slate-50 cursor-pointer hover:border-blue-400"
              >
                {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* DESKTOP TABLE VIEW */}
        {/* ------------------------------------------------------------------------- */}
        <div className="hidden md:flex flex-col bg-white border border-gray-300 shadow-sm rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-300 border-b border-gray-300 pr-1.5">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr>
                    <th className="p-3 w-[100px] text-center font-bold text-slate-700">Bill No</th>
                    <th className="p-3 w-[220px] text-center font-bold text-slate-700">Vehicle</th>
                    <th className="p-3 w-[120px] text-center font-bold text-slate-700">Date</th>
                    <th className="p-3 w-[200px] text-center font-bold text-slate-700">Party</th>
                    <th className="p-3 font-bold  text-center text-slate-700 w-[400px]">Description</th>
                    <th className="p-3 w-[140px]  text-center font-bold text-slate-700">Amount</th>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Table Body */}
            <div className="h-[600px] overflow-y-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(groupedData).map(([billKey, rows], gIndex) => {
                    const total = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0);

                    return (
                      <React.Fragment key={gIndex}>
                        {rows.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            {i === 0 && (
                           <td
                                  rowSpan={rows.length}
                                  className="w-[100px] p-3 border-r border-gray-200 font-bold text-center align-middle bg-white
                                            break-all whitespace-normal"
                                >
                              {item.billno || item.slno}
                            </td>

                            )}
                            {i === 0 && (
                              <td rowSpan={rows.length} className="w-[220px] p-3 border-r border-gray-200 text-center align-middle bg-white">
                                <div className="font-bold text-lg">{item.mcno}</div>
                                <div className="text-md text-gray-500 mt-2 font-bold">{item.grp}</div>
                              </td>
                            )}
                            {i === 0 && (
                              <td rowSpan={rows.length} className="w-[120px] p-3 border-r border-gray-200 text-center align-middle bg-white">
                                {formatDate(item.date)}
                              </td>
                            )}
                            {i === 0 && (
                              <td rowSpan={rows.length} className="w-[200px] p-3 border-r border-gray-200 text-center align-middle bg-white">
                                {item.party}
                              </td>
                            )}
                            <td className="p-3 border-r border-gray-200 text-gray-700 w-[400px]">
                              {item.des}
                            </td>
                            <td className="w-[140px] p-3 text-right font-mono">
                              {Number(item.amount).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-bold border-t border-gray-300">
                          <td colSpan={5} className="p-2 border-r border-gray-300 text-right pr-4 text-gray-700">
                            TOTAL
                          </td>
                          <td className="w-[140px] p-2 text-right text-gray-900">
                            {total.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* MOBILE VIEW */}
        {/* ------------------------------------------------------------------------- */}
        <div className="md:hidden space-y-4 pb-10">
          {Object.entries(groupedData).map(([billKey, rows], gIndex) => {
            const first = rows[0];
            const billTotal = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
            return (
              <div key={gIndex} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-slate-800">{first.mcno}</span>
                    <span className="text-xs text-slate-500">{first.grp}</span>
                  </div>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded font-semibold">
                    #{billKey}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                  <span className="text-sm font-bold text-slate-800">{first.party}</span>
                  <span className="text-xs text-slate-500">{formatDate(first.date)}</span>
                </div>
                <div className="space-y-2">
                  {rows.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.des}</span>
                      <span className="font-semibold text-slate-800">
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{billTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default VehicleReport;