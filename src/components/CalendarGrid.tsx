import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { TaskBar } from './TaskBar';
import { usePlanner } from '../contexts/PlannerContext';
import { TaskItem } from '../types/planner';

export function CalendarGrid() {
  const { state, dispatch } = usePlanner();
  const [draggedTask, setDraggedTask] = useState<TaskItem | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  
  const currentDate = state.currentDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get first day of the month and calculate calendar grid
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  // Generate 35 days (5 weeks)
  for (let i = 0; i < 35; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getTasksForDay = (day: Date) => {
    return state.tasks.filter(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      taskStart.setHours(0, 0, 0, 0);
      taskEnd.setHours(0, 0, 0, 0);
      day.setHours(0, 0, 0, 0);
      
      return day >= taskStart && day <= taskEnd;
    });
  };

  const isToday = (day: Date) => {
    return day.getTime() === today.getTime();
  };

  const isCurrentMonth = (day: Date) => {
    return day.getMonth() === currentDate.getMonth();
  };

  const handleDayClick = useCallback((day: Date, event: React.MouseEvent) => {
    // Don't trigger if clicking on a task
    if ((event.target as HTMLElement).closest('.task-bar')) {
      return;
    }
    
    dispatch({ 
      type: 'SET_DATE_RANGE', 
      payload: { start: new Date(day), end: new Date(day) } 
    });
    dispatch({ type: 'TOGGLE_CREATE_MODAL', payload: true });
  }, [dispatch]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('.task-bar')) {
      return;
    }
    setDragStartPos({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!dragStartPos) return;
    
    const distance = Math.sqrt(
      Math.pow(event.clientX - dragStartPos.x, 2) + 
      Math.pow(event.clientY - dragStartPos.y, 2)
    );
    
    // If dragged more than 10px, start range selection
    if (distance > 10) {
      // Implementation for range selection would go here
    }
  }, [dragStartPos]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = state.tasks.find(t => t.id === event.active.id);
    setDraggedTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedTask(null);
    
    if (!over || !draggedTask) return;
    
    const targetDate = new Date(over.id as string);
    const task = draggedTask;
    
    // Calculate the difference between original start date and target date
    const daysDiff = Math.floor(
      (targetDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Update task dates
    const newStartDate = new Date(targetDate);
    const newEndDate = new Date(task.endDate);
    newEndDate.setDate(newEndDate.getDate() + daysDiff);
    
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: task.id,
        updates: {
          startDate: newStartDate,
          endDate: newEndDate,
          updatedAt: new Date(),
        },
      },
    });
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-1 p-6">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {days.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const visibleTasks = dayTasks.slice(0, 3);
            const remainingCount = dayTasks.length - 3;
            
            return (
              <div
                key={index}
                className={`calendar-day ${
                  isCurrentMonth(day) ? 'opacity-100' : 'opacity-50'
                } ${isToday(day) ? 'today' : ''}`}
                onClick={(e) => handleDayClick(day, e)}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                data-droppable="true"
                id={day.toISOString()}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday(day) ? 'text-indigo-400 font-bold' : 'text-gray-300'
                }`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-2">
                  {visibleTasks.map(task => (
                    <TaskBar key={task.id} task={task} day={day} />
                  ))}
                  
                  {remainingCount > 0 && (
                    <div className="text-xs text-gray-500 px-2 py-1">
                      + {remainingCount} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {draggedTask && (
          <div className={`task-bar ${draggedTask.status === 'todo' ? 'task-todo' : 
            draggedTask.status === 'progress' ? 'task-progress' :
            draggedTask.status === 'review' ? 'task-review' : 'task-completed'
          } opacity-90`}>
            <div className="flex items-center gap-2 flex-1">
              <div className="drag-handle" />
              <span className="text-sm font-medium text-gray-900">
                {draggedTask.title}
              </span>
            </div>
            <div className="drag-handle" />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}