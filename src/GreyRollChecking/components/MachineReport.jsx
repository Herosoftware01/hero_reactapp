import React from 'react';
import { useParams } from 'react-router-dom';

const MachineReport = () => {

    const {id} = useParams();

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Main Card Container */}
      <div className="bg-white shadow-md rounded-sm border-t-4 border-blue-600">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-center p-4">
          <h1 className="text-xl font-bold text-gray-800">Machine {id} - Report</h1>
          
          <div className="flex gap-4 mt-2 md:mt-0">
             {/* The Back button is centered in the gap in the design, 
                 but standard flex puts it here. Adjusted margin to match visual. */}
            <button className="bg-red-400 hover:bg-red-500 text-white px-6 py-1.5 rounded text-sm font-medium transition-colors">
              Back
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
              Cost Report
            </button>
          </div>
        </div>

        {/* Stats and Filters Row */}
        <div className="flex flex-col xl:flex-row justify-between items-center px-4 pb-4 gap-4">
          
          {/* Stats Group */}
          <div className="flex gap-4 text-sm font-bold w-full xl:w-auto">
            <span className="text-yellow-600">Total: 0</span>
            <span className="text-green-600">Pass Roll: 0</span>
            <span className="text-red-600">Fail Roll: 0</span>
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap gap-2 w-full xl:w-auto items-center">
            {/* Filter 1 */}
            <select className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 text-gray-600 w-20">
              <option>All</option>
            </select>

            {/* Filter 2 - Job ID */}
            <select className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 text-gray-600 w-24">
              <option>J6957A</option>
            </select>

            {/* Filter 3 - Colors (Wider) */}
            <select className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 text-gray-600 flex-grow min-w-[150px]">
              <option>All Colors</option>
            </select>

            {/* Search Input */}
            <input 
              type="text" 
              placeholder="Search Roll No" 
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-40 placeholder-gray-400"
            />

            {/* Date Picker */}
            <input 
              type="date" 
              className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto mx-4 mb-4 border border-gray-200 rounded-sm">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-900 uppercase bg-white border-b border-gray-200 font-bold">
              <tr>
                <th className="px-4 py-3 border-r border-gray-200">Roll No</th>
                <th className="px-4 py-3 border-r border-gray-200">DC No</th>
                <th className="px-4 py-3 border-r border-gray-200">Job No</th>
                <th className="px-4 py-3 border-r border-gray-200">Lot No</th>
                <th className="px-4 py-3 border-r border-gray-200">Color</th>
                <th className="px-4 py-3 border-r border-gray-200">Types</th>
                <th className="px-4 py-3 border-r border-gray-200">Dia</th>
                <th className="px-4 py-3 border-r border-gray-200">Act GSM</th>
                <th className="px-4 py-3 border-r border-gray-200">Remarks</th>
                <th className="px-4 py-3 border-r border-gray-200">Time</th>
                <th className="px-4 py-3 border-r border-gray-200">Mistakes</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty State Row */}
              <tr>
                <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MachineReport;