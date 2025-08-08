import React, { useState } from 'react';
import { X, User, Calendar, Flag, CheckCircle2 } from 'lucide-react';
import { usePlanner } from '../contexts/PlannerContext';

export function TaskDetailDrawer() {
  const { state, dispatch } = usePlanner();
  const [activeTab, setActiveTab] = useState<'overview' | 'work-area' | 'progress'>('overview');
  
  const task = state.selectedTask;

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_DETAIL_DRAWER', payload: false });
    dispatch({ type: 'SET_SELECTED_TASK', payload: null });
  };

  const handleStatusChange = (newStatus: string) => {
    if (!task) return;
    
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: task.id,
        updates: { status: newStatus as any, updatedAt: new Date() },
      },
    });
  };

  if (!state.isDetailDrawerOpen || !task) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-red-500';
      case 'progress': return 'bg-yellow-500';
      case 'review': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full lg:w-[340px] bg-[#1E1E1E] border-l border-gray-700 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{task.title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 p-4 border-b border-gray-700">
          <button
            onClick={() => handleStatusChange('progress')}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Move to Work area
          </button>
          <button
            onClick={() => handleStatusChange('review')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Ready for Review
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'work-area', label: 'Work Area', icon: Calendar },
            { id: 'progress', label: 'Progress', icon: Flag },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Task Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Task Name
                  </label>
                  <div className="text-white">{task.title}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                    <span className="text-white capitalize">{task.status.replace('-', ' ')}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Created by
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
                      RU
                    </div>
                    <span className="text-white">{task.createdBy}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Date
                  </label>
                  <div className="text-white">
                    {formatDate(task.startDate)} - {formatDate(task.endDate)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Priority
                  </label>
                  <div className={`capitalize ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Type
                  </label>
                  <div className="text-white capitalize">{task.type}</div>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <div className="bg-gray-800 rounded-lg p-4 text-white text-sm">
                    {task.description}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'work-area' && (
            <div className="text-center text-gray-400 py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Work area content would go here</p>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="text-center text-gray-400 py-8">
              <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Progress tracking would go here</p>
            </div>
          )}
        </div>

        {/* Success Message */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm">
            <CheckCircle2 className="h-4 w-4" />
            Task updated successfully
          </div>
        </div>
      </div>
    </>
  );
}