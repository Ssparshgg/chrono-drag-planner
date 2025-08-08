import React from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Menu } from 'lucide-react';
import { usePlanner } from '../contexts/PlannerContext';

export function CalendarHeader() {
  const { state, dispatch } = usePlanner();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = state.currentDate.getMonth();
  const currentYear = state.currentDate.getFullYear();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(state.currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    dispatch({ type: 'SET_CURRENT_DATE', payload: newDate });
  };

  const goToToday = () => {
    dispatch({ type: 'SET_CURRENT_DATE', payload: new Date() });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F0F] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Calendar label and hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_FILTER_SIDEBAR' })}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-white">
              {monthNames[currentMonth]} {currentYear}
            </h1>
            <p className="text-sm text-gray-400">
              {monthNames[currentMonth]} {currentYear}
            </p>
          </div>
        </div>

        {/* Center - Month Navigator */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Right side - Search and utilities */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Filter className="h-5 w-5" />
          </button>
          
          <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Month</option>
            <option>Week</option>
            <option>Day</option>
          </select>
        </div>
      </div>
    </header>
  );
}