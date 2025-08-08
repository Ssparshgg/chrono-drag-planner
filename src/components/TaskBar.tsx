import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TaskItem } from '../types/planner';
import { usePlanner } from '../contexts/PlannerContext';

interface TaskBarProps {
  task: TaskItem;
  day: Date;
}

export function TaskBar({ task, day }: TaskBarProps) {
  const { dispatch } = usePlanner();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: {
      task,
      originalDate: day,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'todo':
        return 'task-todo';
      case 'progress':
        return 'task-progress';
      case 'review':
        return 'task-review';
      case 'completed':
        return 'task-completed';
      default:
        return 'task-todo';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'SET_SELECTED_TASK', payload: task });
    dispatch({ type: 'TOGGLE_DETAIL_DRAWER', payload: true });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-bar ${getStatusClass(task.status)} ${
        isDragging ? 'opacity-40 scale-105 z-50' : ''
      }`}
      onClick={handleClick}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="drag-handle" />
        <span className="text-sm font-medium text-gray-900 truncate">
          {task.title}
        </span>
      </div>
      <div className="drag-handle" />
    </div>
  );
}