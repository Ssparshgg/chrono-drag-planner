import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Calendar, Clock, AlertCircle, User, Plus } from 'lucide-react';
import { usePlanner } from '../contexts/PlannerContext';
import { TaskItem, ItemType, TaskStatus, Priority } from '../types/planner';

export function CreateItemModal() {
  const { state, dispatch } = usePlanner();
  const [activeTab, setActiveTab] = useState<ItemType>('event');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'medium' as Priority,
    attendees: [] as string[],
    newAttendee: '',
  });

  useEffect(() => {
    if (state.selectedDateRange) {
      const start = state.selectedDateRange.start.toISOString().split('T')[0];
      const end = state.selectedDateRange.end.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, startDate: start, endDate: end }));
    }
  }, [state.selectedDateRange]);

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_CREATE_MODAL', payload: false });
    dispatch({ type: 'SET_DATE_RANGE', payload: null });
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      priority: 'medium',
      attendees: [],
      newAttendee: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;
    
    const newTask: TaskItem = {
      id: `${activeTab}-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      type: activeTab,
      status: 'todo',
      priority: formData.priority,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      assignees: formData.attendees,
      createdBy: 'Current User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    dispatch({ type: 'ADD_TASK', payload: newTask });
    handleClose();
  };

  const addAttendee = () => {
    if (formData.newAttendee.trim()) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, prev.newAttendee.trim()],
        newAttendee: '',
      }));
    }
  };

  const removeAttendee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index),
    }));
  };

  if (!state.isCreateModalOpen) return null;

  return (
    <Dialog open={state.isCreateModalOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-[#1E1E1E] rounded-xl shadow-2xl">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Create New Item</h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tab Switcher */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('event')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'event'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Event
                  <span className="text-xs opacity-75">Meeting, appointment</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('task')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'task'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  Task
                  <span className="text-xs opacity-75">Work item, todo</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {activeTab === 'event' ? 'Event Name' : 'Task Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={`Enter ${activeTab} name...`}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={`Describe your ${activeTab}...`}
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/500
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {activeTab === 'event' ? 'Due Date' : 'Due Date'}
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Priority */}
                {activeTab === 'task' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  </div>
                )}

                {/* Attendees */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {activeTab === 'event' ? 'Attendees' : 'Assignees'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={formData.newAttendee}
                      onChange={(e) => setFormData(prev => ({ ...prev, newAttendee: e.target.value }))}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addAttendee}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.attendees.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.attendees.map((attendee, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg"
                        >
                          <span className="text-sm text-gray-300">{attendee}</span>
                          <button
                            type="button"
                            onClick={() => removeAttendee(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2 ${
                  activeTab === 'event' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'
                } text-white rounded-lg font-medium transition-colors`}
              >
                Create {activeTab === 'event' ? 'Event' : 'Task'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}