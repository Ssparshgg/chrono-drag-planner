import React from 'react';
import { X, Filter } from 'lucide-react';
import { usePlanner } from '../contexts/PlannerContext';

export function FilterSidebar() {
  const { state, dispatch } = usePlanner();

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_FILTER_SIDEBAR', payload: false });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...state.filters.categories, category]
      : state.filters.categories.filter(c => c !== category);
    
    dispatch({
      type: 'SET_FILTERS',
      payload: { categories: newCategories },
    });
  };

  const handleDurationChange = (duration: string) => {
    dispatch({
      type: 'SET_FILTERS',
      payload: { duration: duration as any },
    });
  };

  const categories = [
    { id: 'work', label: 'Work', count: 12 },
    { id: 'personal', label: 'Personal', count: 8 },
    { id: 'meetings', label: 'Meetings', count: 5 },
    { id: 'events', label: 'Events', count: 3 },
  ];

  const durations = [
    { id: 'week1', label: '≤ 1 week' },
    { id: 'week2', label: '≤ 2 weeks' },
    { id: 'week3', label: '≤ 3 weeks' },
    { id: 'all', label: 'All durations' },
  ];

  if (!state.isFilterSidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={handleClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-[#181818] border-r border-gray-700 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-white">Filters</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <label
                  key={category.id}
                  className="flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={state.filters.categories.includes(category.id)}
                      onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {category.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Duration</h3>
            <div className="space-y-2">
              {durations.map(duration => (
                <label
                  key={duration.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="duration"
                    value={duration.id}
                    checked={state.filters.duration === duration.id}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    className="w-4 h-4 border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {duration.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={() => dispatch({
                type: 'SET_FILTERS',
                payload: { categories: [], duration: 'all' },
              })}
              className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}